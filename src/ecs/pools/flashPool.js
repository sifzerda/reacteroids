//src/ecs/pools/flashPool.js

const pool = [];

export function acquireFlash() {
  return pool.pop() || {};
}

export function releaseFlash(flash) {

  for (const key in flash) {
    delete flash[key];
  }

  pool.push(flash);
}