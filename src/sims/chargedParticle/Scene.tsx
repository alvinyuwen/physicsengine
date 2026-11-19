import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Line, ArrowHelper } from '@react-three/drei';
import { ChargedParticleState } from './index';
import * as THREE from 'three';

interface SceneProps {
  state: ChargedParticleState;
  params: Record<string, number>;
}

export const Scene: React.FC<SceneProps> = ({ state, params }) => {
  const trailPoints = useMemo(
    () => state.trail.map((p) => new THREE.Vector3(p.x, p.y, p.z)),
    [state.trail]
  );

  const v = state.vel;
  const speed = Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
  const vDir = new THREE.Vector3(v.x, v.y, v.z).normalize();

  // Force direction (approximate): q v × B, B along +y
  const B = new THREE.Vector3(0, params['Magnetic field'] ?? 0.5, 0);
  const q = (params['Charge sign'] ?? 1) * 1.602e-19;
  const force = new THREE.Vector3().crossVectors(new THREE.Vector3(v.x, v.y, v.z), B).multiplyScalar(q);

  return (
    <Canvas camera={{ position: [3, 2, 3], fov: 50 }}>
      <color attach="background" args={['#070B14']} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />

      {/* Grid and axes */}
      <Grid args={[10, 10]} cellColor="#1f2937" sectionColor="#374151" fadeDistance={20} />
      <axesHelper args={[2]} />

      {/* Particle */}
      <mesh position={[state.pos.x, state.pos.y, state.pos.z]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#22D3EE" emissive="#22D3EE" emissiveIntensity={0.6} />
      </mesh>

      {/* Trail */}
      {trailPoints.length > 1 && (
        <Line points={trailPoints} color="#22D3EE" lineWidth={2} transparent opacity={0.6} />
      )}

      {/* Velocity vector */}
      <ArrowHelper
        args={[vDir, new THREE.Vector3(state.pos.x, state.pos.y, state.pos.z), Math.min(speed * 1e-6, 1), 0x22d3ee, 0.1, 0.05]}
      />

      {/* Force vector (scaled for visibility) */}
      {force.length() > 0 && (
        <ArrowHelper
          args={[
            force.clone().normalize(),
            new THREE.Vector3(state.pos.x, state.pos.y, state.pos.z),
            0.5,
            0xff6b6b,
            0.1,
            0.05,
          ]}
        />
      )}

      {/* Magnetic field indicator (B along +y) */}
      <ArrowHelper
        args={[new THREE.Vector3(0, 1, 0), new THREE.Vector3(-1, -1, -1), 0.8, 0xa78bfa, 0.1, 0.05]}
      />

      <OrbitControls />
    </Canvas>
  );
};
