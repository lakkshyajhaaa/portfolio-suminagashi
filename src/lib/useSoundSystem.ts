"use client";

import { useEffect, useRef, useState } from "react";
import { Howl } from "howler";

export function useSoundSystem(transitionState: string) {
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("suminagashi_audio");
      if (stored !== null) return stored === "true";
    }
    return true; // Muted by default
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("suminagashi_audio", String(isMuted));
    }
  }, [isMuted]);

  const ambientTrack = useRef<Howl | null>(null);

  useEffect(() => {
    // Initialize the ambient vinyl track
    ambientTrack.current = new Howl({
      src: ["/sound/gigidelaromusic-deep-calm-texture-short-450960.mp3"],
      loop: true,
      volume: 0.5,
    });

    return () => {
      ambientTrack.current?.unload();
    };
  }, []);

  // Control playback based on the vinyl player's state
  useEffect(() => {
    if (isMuted) {
      ambientTrack.current?.pause();
    } else {
      if (ambientTrack.current && !ambientTrack.current.playing()) {
        ambientTrack.current.play();
        ambientTrack.current.fade(0, 0.5, 1000); // Smooth 1-second fade in when dropping the needle
      }
    }
  }, [isMuted]);

  return { isMuted, setIsMuted };
}
