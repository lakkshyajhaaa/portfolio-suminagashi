"use client";

import { useEffect, useRef, useState } from "react";
import { Howl } from "howler";

export function useSoundSystem(transitionState: string) {
  const [isMuted, setIsMuted] = useState(true); // Muted by default

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
