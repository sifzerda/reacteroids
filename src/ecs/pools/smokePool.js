// src/ecs/pools/smokePool.js

const pool = [];

export function acquireSmoke() {
  return pool.pop() || {};
}

export function releaseSmoke(smoke) {

  for (const key in smoke) {
    delete smoke[key];
  }

  pool.push(smoke);
}

