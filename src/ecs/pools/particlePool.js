// src/ecs/pools/particlePool.js

const pool = [];

export function acquireParticle() {
  return pool.pop() || {};
}

export function releaseParticle(particle) {
  pool.push(particle);
}