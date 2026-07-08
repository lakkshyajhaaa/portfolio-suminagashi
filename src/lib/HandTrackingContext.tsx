"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";

interface HandTrackingContextType {
  isCameraActive: boolean;
  toggleCamera: () => void;
  // Accelerated position for full-screen cursor and WebGL
  handPosition: { x: number; y: number } | null;
  getHandPosition: () => { x: number; y: number } | null;
  // Raw position for the video box overlay to track the physical finger
  rawPosition: { x: number; y: number } | null;
  getRawPosition: () => { x: number; y: number } | null;
  isLoading: boolean;
  videoElement: HTMLVideoElement | null;
  isPinching: boolean;
}

const HandTrackingContext = createContext<HandTrackingContextType>({
  isCameraActive: false,
  toggleCamera: () => {},
  handPosition: null,
  getHandPosition: () => null,
  rawPosition: null,
  getRawPosition: () => null,
  isLoading: false,
  videoElement: null,
  isPinching: false,
});

export const useHandTracking = () => useContext(HandTrackingContext);

export const HandTrackingProvider = ({ children }: { children: React.ReactNode }) => {
  const [isCameraActive, setIsCameraActive] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("suminagashi_camera") === "true";
    }
    return false;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isHandVisible, setIsHandVisible] = useState(false);
  const [isPinching, setIsPinching] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const rafId = useRef<number | null>(null);

  const lastPosition = useRef<{ x: number; y: number } | null>(null);
  const lastRawPosition = useRef<{ x: number; y: number } | null>(null);
  const lastVideoTimeRef = useRef<number>(-1);

  const initHandTracking = async () => {
    setIsLoading(true);
    try {
      // 1. Load MediaPipe HandLandmarker
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      const handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
          delegate: "CPU", // MUST be CPU. GPU delegate blocks Three.js WebGL context and tanks framerate
        },
        runningMode: "VIDEO",
        numHands: 1,
      });

      landmarkerRef.current = handLandmarker;

      // 2. Get webcam stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
        audio: false,
      });

      if (!videoRef.current) {
        const video = document.createElement("video");
        video.width = 640;
        video.height = 480;
        video.playsInline = true;
        video.muted = true;
        videoRef.current = video;
      }

      videoRef.current.srcObject = stream;
      await new Promise<void>((resolve) => {
        if (!videoRef.current) return;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          resolve();
        };
      });

      setIsLoading(false);
      
      // 3. Start prediction loop
      predict();
    } catch (error) {
      console.error("Failed to initialize hand tracking:", error);
      setIsCameraActive(false);
      setIsLoading(false);
    }
  };

  const stopHandTracking = () => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    landmarkerRef.current?.close();
    landmarkerRef.current = null;
    setIsHandVisible(false);
    lastPosition.current = null;
    lastRawPosition.current = null;
    lastVideoTimeRef.current = -1;
  };

  const predict = () => {
    try {
      if (!videoRef.current || !landmarkerRef.current || !isCameraActive) return;

      if (videoRef.current.readyState >= 2) {
        let startTimeMs = performance.now();
        
        if (lastVideoTimeRef.current >= startTimeMs) {
          startTimeMs = lastVideoTimeRef.current + 1;
        }
        lastVideoTimeRef.current = startTimeMs;
        
        let results = { landmarks: [] as any[] };
        const originalError = console.error;
        const originalWarn = console.warn;
        const originalLog = console.log;
        const originalInfo = console.info;
        
        try {
          const filterXNNPACK = (originalFn: any) => (...args: any[]) => {
            const msg = args.map(a => String(a)).join(' ');
            if (msg.includes('TensorFlow Lite XNNPACK') || msg.includes('XNNPACK')) return;
            originalFn(...args);
          };
          
          console.error = filterXNNPACK(originalError);
          console.warn = filterXNNPACK(originalWarn);
          console.log = filterXNNPACK(originalLog);
          console.info = filterXNNPACK(originalInfo);
          
          results = landmarkerRef.current.detectForVideo(videoRef.current, startTimeMs);
        } catch (e) {
          // Ignore prediction errors (e.g. monotonically increasing timestamp errors on soft navigation)
        } finally {
          console.error = originalError;
          console.warn = originalWarn;
          console.log = originalLog;
          console.info = originalInfo;
        }
        
        if (results && results.landmarks && results.landmarks.length > 0) {
          const indexFingerTip = results.landmarks[0][8];
          
          if (indexFingerTip) {
            let targetNormX = 1.0 - indexFingerTip.x;
            let targetNormY = indexFingerTip.y;
            
            const thumbTip = results.landmarks[0][4];
            if (thumbTip && indexFingerTip) {
              const distance = Math.sqrt(
                Math.pow(indexFingerTip.x - thumbTip.x, 2) + 
                Math.pow(indexFingerTip.y - thumbTip.y, 2)
              );
              
              let currentlyPinching = isPinching;
              if (distance < 0.08) {
                 currentlyPinching = true;
              } else if (distance > 0.11) {
                 currentlyPinching = false;
              }
              
              setIsPinching(currentlyPinching);
              
              const midX = 1.0 - ((indexFingerTip.x + thumbTip.x) / 2);
              const midY = (indexFingerTip.y + thumbTip.y) / 2;
              
              const pinchBlend = Math.max(0, Math.min(1, (0.12 - distance) / (0.12 - 0.05)));
              
              targetNormX = targetNormX * (1 - pinchBlend) + midX * pinchBlend;
              targetNormY = targetNormY * (1 - pinchBlend) + midY * pinchBlend;
            }
            
            const rawThreeX = (targetNormX * 2) - 1;
            const rawThreeY = -(targetNormY * 2) + 1;
            
            let smoothedRawX = rawThreeX;
            let smoothedRawY = rawThreeY;
            
            if (lastRawPosition.current) {
              const alpha = 0.4;
              smoothedRawX = lastRawPosition.current.x * (1 - alpha) + rawThreeX * alpha;
              smoothedRawY = lastRawPosition.current.y * (1 - alpha) + rawThreeY * alpha;
            }
            
            lastRawPosition.current = { x: smoothedRawX, y: smoothedRawY };

            const SENSITIVITY = 1.5;
            
            let normX = ((targetNormX - 0.5) * SENSITIVITY) + 0.5;
            let normY = ((targetNormY - 0.5) * SENSITIVITY) + 0.5;
            
            normX = Math.max(0, Math.min(1, normX));
            normY = Math.max(0, Math.min(1, normY));
            
            const threeX = (normX * 2) - 1;
            const threeY = -(normY * 2) + 1;
            
            let smoothedX = threeX;
            let smoothedY = threeY;
            if (lastPosition.current) {
              const alpha = 0.85; 
              smoothedX = lastPosition.current.x * (1 - alpha) + threeX * alpha;
              smoothedY = lastPosition.current.y * (1 - alpha) + threeY * alpha;
            }
            
            lastPosition.current = { x: smoothedX, y: smoothedY };

            if (!isHandVisible) setIsHandVisible(true);
          }
        } else {
          if (isHandVisible) setIsHandVisible(false);
          setIsPinching(false);
          lastPosition.current = null;
          lastRawPosition.current = null;
        }
      }
    } catch (err) {
      console.error("Critical error in predict loop:", err);
    } finally {
      rafId.current = requestAnimationFrame(predict);
    }
  };

  const toggleCamera = () => {
    setIsCameraActive((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") localStorage.setItem("suminagashi_camera", String(next));
      return next;
    });
  };

  // Lifecycle
  useEffect(() => {
    if (isCameraActive) {
      initHandTracking();
    } else {
      stopHandTracking();
    }
    return () => stopHandTracking();
  }, [isCameraActive]);

  return (
    <HandTrackingContext.Provider value={{ 
      isCameraActive, 
      toggleCamera, 
      handPosition: isHandVisible ? lastPosition.current : null, // keep legacy prop for simple checks
      getHandPosition: () => lastPosition.current,
      getRawPosition: () => lastRawPosition.current,
      rawPosition: isHandVisible ? lastRawPosition.current : null, // keep legacy prop
      isLoading,
      videoElement: videoRef.current,
      isPinching
    }}>
      {children}
    </HandTrackingContext.Provider>
  );
};
