import { Vec3, add, scale } from './vec3';

export type Derivative<T> = (state: T) => T;
export type Add<T> = (a: T, b: T) => T;
export type Scale<T> = (a: T, s: number) => T;

export function rk4<T>(
  state: T,
  dt: number,
  deriv: Derivative<T>,
  addFn: Add<T>,
  scaleFn: Scale<T>
): T {
  const k1 = deriv(state);
  const k2 = deriv(addFn(state, scaleFn(k1, dt / 2)));
  const k3 = deriv(addFn(state, scaleFn(k2, dt / 2)));
  const k4 = deriv(addFn(state, scaleFn(k3, dt)));

  // state + (dt/6)(k1 + 2k2 + 2k3 + k4)
  const weighted = addFn(
    addFn(k1, scaleFn(k2, 2)),
    addFn(scaleFn(k3, 2), k4)
  );
  return addFn(state, scaleFn(weighted, dt / 6));
}

// Convenience wrapper for vector states (position + velocity)
export interface ParticleState {
  pos: Vec3;
  vel: Vec3;
}

export function particleDeriv(
  state: ParticleState,
  forceFn: (pos: Vec3, vel: Vec3) => Vec3,
  mass: number
): ParticleState {
  const acc = scale(forceFn(state.pos, state.vel), 1 / mass);
  return { pos: state.vel, vel: acc };
}

export function rk4Particle(
  state: ParticleState,
  dt: number,
  forceFn: (pos: Vec3, vel: Vec3) => Vec3,
  mass: number
): ParticleState {
  return rk4(
    state,
    dt,
    (s) => particleDeriv(s, forceFn, mass),
    (a, b) => ({ pos: add(a.pos, b.pos), vel: add(a.vel, b.vel) }),
    (a, s) => ({ pos: scale(a.pos, s), vel: scale(a.vel, s) })
  );
}
