// src/ecs/pools/exhaustPool.js

const pool = [];

export function acquireExhaust() {
  return pool.pop() || {};
}

export function releaseExhaust(exhaust) {
  pool.push(exhaust);
}