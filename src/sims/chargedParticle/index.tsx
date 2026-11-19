import React from 'react';
import { SimDefinition } from '@/core/types';
import { Vec3, vec3, add, scale, cross, length } from '@/core/vec3';
import { rk4Particle, ParticleState } from '@/core/rk4';
import { Scene } from './Scene';

const Q = 1.602e-19; // simplified proton charge for visualization
const M = 1.673e-27; // proton mass

export interface ChargedParticleState {
  pos: Vec3;
  vel: Vec3;
  trail: Vec3[];
}

export const chargedParticle: SimDefinition<ChargedParticleState> = {
  id: 'charged-particle',
  title: 'Charged particle in a magnetic field',
  topic: 'Electromagnetism',
  levels: ['G12', 'Y1'],
  params: [
    { name: 'Magnetic field', symbol: 'B', unit: 'T', min: 0.01, max: 5, default: 0.5, step: 0.01 },
    { name: 'Speed', symbol: 'v', unit: 'm/s', min: 1e5, max: 5e6, default: 1e6, step: 1e4, log: true },
    { name: 'Pitch angle', symbol: 'θ', unit: '°', min: 0, max: 90, default: 0, step: 1 },
    { name: 'Charge sign', symbol: 'q', unit: 'e', min: -1, max: 1, default: 1, step: 2 },
  ],
  initState: (params) => {
    const B = params['Magnetic field'] ?? 0.5;
    const v = params['Speed'] ?? 1e6;
    const theta = ((params['Pitch angle'] ?? 0) * Math.PI) / 180;
    const sign = Math.sign(params['Charge sign'] ?? 1);

    // B along +y. Velocity in xz-plane plus y-component for helix.
    const vPerp = v * Math.cos(theta);
    const vPar = v * Math.sin(theta);

    return {
      pos: vec3(0, 0, 0),
      vel: vec3(vPerp * sign, vPar, 0),
      trail: [],
    };
  },
  step: (state, params, dt) => {
    const B = vec3(0, params['Magnetic field'] ?? 0.5, 0);
    const q = (params['Charge sign'] ?? 1) * Q;

    const forceFn = (_pos: Vec3, vel: Vec3) => {
      // F = q v × B
      return scale(cross(vel, B), q);
    };

    const next = rk4Particle(
      { pos: state.pos, vel: state.vel },
      dt,
      forceFn,
      M
    );

    const newTrail = [...state.trail, next.pos].slice(-600); // keep last 600 points

    return { pos: next.pos, vel: next.vel, trail: newTrail };
  },
  Scene: Scene,
  equations: (state, params) => {
    const B = params['Magnetic field'] ?? 0.5;
    const v = length(state.vel);
    const q = Math.abs(params['Charge sign'] ?? 1) * Q;
    const r = (M * v) / (q * B);

    return [
      {
        symbolic: 'F = q\\,v\\,B\\,\\sin\\theta',
        substituted: `F = (${q.toExponential(2)})(\\,${v.toExponential(2)}\\,)(\\,${B.toFixed(2)}\\,)`,
        result: `${(q * v * B).toExponential(2)} N`,
      },
      {
        symbolic: 'r = \\frac{mv}{qB}',
        substituted: `r = \\frac{(${M.toExponential(2)})(\\,${v.toExponential(2)}\\,)}{(${q.toExponential(2)})(\\,${B.toFixed(2)}\\,)}`,
        result: `${r.toFixed(3)} m`,
      },
    ];
  },
  graphs: (state) => ({
    label: 'Speed (m/s)',
    data: {
      x: state.trail.map((_, i) => i * (1 / 240)),
      y: state.trail.map((_, i) => {
        // approximate speed from trail spacing
        if (i === 0) return 0;
        const prev = state.trail[i - 1];
        const cur = state.trail[i];
        const dx = cur.x - prev.x, dy = cur.y - prev.y, dz = cur.z - prev.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz) * 240;
      }),
    },
  }),
  vectorToggles: [
    { id: 'velocity', label: 'Velocity v', colorVar: '--q-velocity' },
    { id: 'force', label: 'Force F', colorVar: '--q-force' },
    { id: 'field', label: 'Field B', colorVar: '--q-magnetic' },
  ],
  predictionPrompts: [
    {
      question: 'If you double the magnetic field, what happens to the radius?',
      answer: 'The radius halves, because r ∝ 1/B.',
    },
    {
      question: 'If the pitch angle is 0°, what is the motion?',
      answer: 'Pure circular motion in the plane perpendicular to B.',
    },
  ],
  depthLevels: {
    intuition: 'A charged particle moving perpendicular to a magnetic field experiences a force perpendicular to both v and B. This force acts as a centripetal force, producing circular motion. If there is also a velocity component along B, the particle traces a helix.',
    equation: 'The magnetic force is F = qv × B. For v perpendicular to B, the radius is r = mv/(qB), and the cyclotron frequency is ω = qB/m.',
    derivation: 'Starting from Newton’s second law, m dv/dt = qv × B. For uniform B along y, this yields coupled differential equations whose solution is circular motion in the xz-plane.',
  },
};
