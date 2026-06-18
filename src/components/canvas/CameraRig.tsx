"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";

export default function CameraRig({ transitionState }: { transitionState: string }) {
  const { camera, pointer } = useThree();
  const targetPosition = useRef(new THREE.Vector3(0, 0, 5));
  const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    // 1. Determine target based on transition state
    if (transitionState === "convergence" || transitionState === "absorption") {
      // Pull camera closer during absorption
      targetPosition.current.set(0, 0, 2);
    } else if (transitionState === "void") {
      // In void, camera sits close
      targetPosition.current.set(0, 0, 1.5);
    } else if (transitionState === "genesis" || transitionState === "reconstruction") {
      // Pull back out
      targetPosition.current.set(0, 0, 6);
    } else {
      // Idle state - no parallax, keep camera static
      targetPosition.current.set(0, 0, 6);
    }

    // 2. Apply inertia/momentum using damp (mass)
    // Smooth damp is frame-rate independent
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetPosition.current.x, 3, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetPosition.current.y, 3, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetPosition.current.z, 3, delta);
    
    // Damp lookAt
    const currentLookAt = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion).add(camera.position);
    currentLookAt.x = THREE.MathUtils.damp(currentLookAt.x, lookAtTarget.current.x, 4, delta);
    currentLookAt.y = THREE.MathUtils.damp(currentLookAt.y, lookAtTarget.current.y, 4, delta);
    currentLookAt.z = THREE.MathUtils.damp(currentLookAt.z, lookAtTarget.current.z, 4, delta);
    
    camera.lookAt(currentLookAt);
  });

  return null;
}
