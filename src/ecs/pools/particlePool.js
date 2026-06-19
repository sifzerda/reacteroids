// src/ecs/pools/particlePool.js

const pool = [];

export function acquireParticle() {
  return pool.pop() || {};
}

export function releaseParticle(particle) {

  for (const key in particle) {
    delete particle[key];
  }

  pool.push(particle);
}