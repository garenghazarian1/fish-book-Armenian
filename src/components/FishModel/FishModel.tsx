"use client";

import { useRef, useState } from "react";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface FishModelProps {
  scale?: number;
  position?: [number, number, number];
}

export default function FishModel({
  scale = 1.5,
  position = [0, 0, 0],
}: FishModelProps) {
  const modelRef = useRef<THREE.Object3D>(null);
  const [stopped, setStopped] = useState(false);
  const [finalTransform] = useState({
    pos: new THREE.Vector3(0.4, 0, 1.4),
    rot: new THREE.Euler(Math.PI / 6, Math.PI / -4, 0.3), // 30° down + 45° horizontal
  });

  const { scene } = useGLTF("/threeDGLB/sample_cartoon_style.glb");

  // Material setup
  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      if ((mesh.material as any).isMeshStandardMaterial) {
        const material = mesh.material as THREE.MeshStandardMaterial;
        material.metalness = 0.2;
        material.roughness = 0.6;
      }
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
  });

  // Animate fish motion
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (!modelRef.current) return;

    const fish = modelRef.current;

    if (!stopped && t < 2) {
      // Smooth swimming animation
      fish.position.x = Math.sin(t * 0.2) * 0.6;
      fish.position.y = Math.sin(t * 0.4) * 0.2 + position[1];
      fish.rotation.y = Math.sin(t * 0.6) * 0.5;
      fish.rotation.x = Math.sin(t * 0.3) * 0.05;
      fish.rotation.z = Math.sin(t * 0.2) * 0.05;
    } else {
      // Smoothly ease to final position and rotation
      setStopped(true);

      fish.position.lerp(finalTransform.pos, 0.05);
      fish.rotation.x = THREE.MathUtils.lerp(
        fish.rotation.x,
        finalTransform.rot.x,
        0.05
      );
      fish.rotation.y = THREE.MathUtils.lerp(
        fish.rotation.y,
        finalTransform.rot.y,
        0.05
      );
      fish.rotation.z = THREE.MathUtils.lerp(
        fish.rotation.z,
        finalTransform.rot.z,
        0.05
      );
    }
  });

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[2, 2, 2]} intensity={1.2} castShadow />
      <primitive ref={modelRef} object={scene} scale={scale} />
      <OrbitControls enableZoom={false} enableRotate={true} />
    </>
  );
}

useGLTF.preload("/threeDGLB/sample_cartoon_style.glb");
