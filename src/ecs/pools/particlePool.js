// src/ecs/pools/particlePool.js

const pool = [];

export function acquireParticle() {

  const particle =
    pool.pop() || {};

  if (particle.seed === undefined) {

    particle.seed =
      Math.random();
  }

  return particle;
}

export function releaseParticle(particle) {

  for (const key in particle) {

    // keep seed permanently
    if (key !== 'seed') {
      delete particle[key];
    }
  }

  pool.push(particle);
}