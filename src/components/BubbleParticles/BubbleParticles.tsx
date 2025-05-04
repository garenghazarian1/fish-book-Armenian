"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { InstancedMesh } from "three";

interface BubbleParticlesProps {
  count?: number;
}

export default function BubbleParticles({ count = 50 }: BubbleParticlesProps) {
  const mesh = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const { gl } = useThree();

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const lowPower = gl.capabilities.maxTextureSize <= 2048 || isMobile;
  const actualCount = lowPower ? Math.min(count, 20) : count;

  const particles = useMemo(() => {
    const temp: {
      x: number;
      y: number;
      z: number;
      speed: number;
      scale: number;
    }[] = [];
    for (let i = 0; i < actualCount; i++) {
      temp.push({
        x: THREE.MathUtils.randFloatSpread(4),
        y: THREE.MathUtils.randFloat(-2, -5),
        z: THREE.MathUtils.randFloatSpread(2),
        speed: THREE.MathUtils.randFloat(0.0015, 0.006),
        scale: THREE.MathUtils.randFloat(0.02, 0.07),
      });
    }
    return temp;
  }, [actualCount]);

  useFrame(() => {
    if (!mesh.current) return;

    particles.forEach((p, i) => {
      p.y += p.speed;
      if (p.y > 2.5) {
        p.y = THREE.MathUtils.randFloat(-2, -5);
      }

      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.set(p.scale, p.scale, p.scale);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, actualCount]}>
      <sphereGeometry args={[1, 8, 8]} />
      {lowPower ? (
        <meshStandardMaterial transparent opacity={0.2} color="#c2f0ff" />
      ) : (
        <meshPhysicalMaterial
          color="#e0f7ff"
          transmission={1}
          roughness={0}
          metalness={0}
          thickness={2}
          clearcoat={1}
          clearcoatRoughness={0.1}
          reflectivity={0.7}
          ior={1.33}
          attenuationColor="#aeefff"
          attenuationDistance={1.5}
          transparent
          opacity={0.7}
        />
      )}
    </instancedMesh>
  );
}
