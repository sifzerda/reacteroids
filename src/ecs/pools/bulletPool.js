// src/ecs/pools/bulletPool.js
// recycling of bullets

const pool = [];

export function acquireBullet() {
  return pool.pop() || {};
}

export function releaseBullet(bullet) {
  pool.push(bullet);
}