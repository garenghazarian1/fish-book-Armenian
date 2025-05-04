// File: components/FishModel.tsx

"use client";

import { useRef, useState, useEffect } from "react";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface FishModelProps {
  scale?: number;
  position?: [number, number, number];
}

export default function FishModel({
  scale = 0.6,
  position = [0, 0, 0],
}: FishModelProps) {
  const modelRef = useRef<THREE.Object3D>(null);
  const { scene } = useGLTF("/threeDGLB/sampleMeshy.glb");
  const { camera } = useThree();
  const [isInteracting, setIsInteracting] = useState(false);

  const moveDuration = 2.5;
  const easeFactor = 0.08;
  const swimAmplitude = 0.15;
  const swimFrequency = 2.5;

  const finalTransform = {
    position: new THREE.Vector3(0.1, 1, -1),
    rotation: new THREE.Euler(Math.PI / 8, Math.PI / 1.4, -0.4),
    quaternion: new THREE.Quaternion(),
  };
  finalTransform.quaternion.setFromEuler(finalTransform.rotation);

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = child.material.clone();
        const mat = child.material as THREE.MeshStandardMaterial;
        mat.metalness = 0.3;
        mat.roughness = 0.5;
        mat.emissive.setHex(0x0a1a2a).multiplyScalar(0.15);
        mat.needsUpdate = true;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const fish = modelRef.current;
    if (!fish) return;

    const progress = Math.min(t / moveDuration, 1);
    const swimOffset = Math.sin(t * swimFrequency) * swimAmplitude;

    const targetPosition = finalTransform.position.clone();
    targetPosition.y += swimOffset * 0.5;
    targetPosition.z += swimOffset * 0.3;

    fish.position.lerpVectors(
      new THREE.Vector3(-2.5, -0.2, 0.5),
      targetPosition,
      progress
    );

    const initialQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(0, 0, 0)
    );
    fish.quaternion.slerpQuaternions(
      initialQuaternion,
      finalTransform.quaternion,
      progress
    );

    // Extra subtle motion
    if (progress < 1) {
      fish.rotation.x += Math.sin(t * 1.5) * 0.005;
      fish.position.y += Math.sin(t * 2) * 0.01;
    }
  });

  const handleControlsChange = () => {
    setIsInteracting(true);
    setTimeout(() => setIsInteracting(false), 2000);
  };

  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight
        position={[3, 2, 4]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <primitive
        ref={modelRef}
        object={scene}
        scale={scale}
        position={position}
      />
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        autoRotate={!isInteracting}
        autoRotateSpeed={0.75}
        minDistance={2}
        maxDistance={8}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.75}
        enableZoom={true}
        enablePan={false}
        onChange={handleControlsChange}
      />
    </>
  );
}

useGLTF.preload("/threeDGLB/sampleMeshy.glb");
