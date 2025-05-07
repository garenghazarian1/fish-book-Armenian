"use client";

import { useRef, useEffect, useState } from "react";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
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
  const [interacting, setInteracting] = useState(false);

  const startPos = new THREE.Vector3(-2.5, -0.2, 0.5);
  const endPos = new THREE.Vector3(0.1, 1, -1);
  const endQuat = new THREE.Quaternion().setFromEuler(
    new THREE.Euler(Math.PI / 8, Math.PI / 1.4, -0.4)
  );

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const mat = (child.material =
          child.material.clone()) as THREE.MeshStandardMaterial;
        mat.metalness = 0.3;
        mat.roughness = 0.5;
        mat.emissive.setHex(0x0a1a2a).multiplyScalar(0.15);
        child.castShadow = child.receiveShadow = true;
      }
    });
  }, [scene]);

  useFrame(({ clock }) => {
    const fish = modelRef.current;
    if (!fish) return;

    const t = clock.getElapsedTime();
    const progress = Math.min(t / 2.5, 1);
    const offset = Math.sin(t * 2.5) * 0.15;

    const target = endPos.clone();
    target.y += offset * 0.5;
    target.z += offset * 0.3;

    fish.position.lerpVectors(startPos, target, progress);
    fish.quaternion.slerpQuaternions(new THREE.Quaternion(), endQuat, progress);

    if (progress < 1) {
      fish.rotation.x += Math.sin(t * 1.5) * 0.005;
      fish.position.y += Math.sin(t * 2) * 0.01;
    }
  });

  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight
        position={[3, 2, 4]}
        intensity={1.5}
        castShadow
        shadow-mapSize={{ width: 1024, height: 1024 }}
      />
      <primitive
        ref={modelRef}
        object={scene}
        scale={scale}
        position={position}
      />
      <OrbitControls
        autoRotate={!interacting}
        autoRotateSpeed={0.75}
        enableDamping
        dampingFactor={0.05}
        enableZoom={false}
        enablePan={false}
        minDistance={2}
        maxDistance={8}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.75}
        onStart={() => setInteracting(true)}
        onEnd={() => setInteracting(false)}
      />
    </>
  );
}

useGLTF.preload("/threeDGLB/sampleMeshy.glb");
