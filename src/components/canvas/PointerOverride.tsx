"use client";

import { useFrame } from "@react-three/fiber";
import { useHandTracking } from "@/lib/HandTrackingContext";

export default function PointerOverride() {
  const { isCameraActive, getHandPosition } = useHandTracking();

  useFrame((state) => {
    if (isCameraActive) {
      const hand = getHandPosition();
      if (hand) {
        // Override the global R3F pointer state
        state.pointer.set(hand.x, hand.y);
        
        // Force the raycaster to update using the new pointer position and current camera
        state.raycaster.setFromCamera(state.pointer, state.camera);
      }
    }
  });

  return null;
}
