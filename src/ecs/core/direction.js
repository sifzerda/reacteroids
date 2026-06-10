// src/ecs/core/direction.js

export function forwardVector(rotation) {
  return {
    x: Math.cos(rotation),
    y: Math.sin(rotation),
  };
}

export function rightVector(rotation) {
  return {
    x: -Math.sin(rotation),
    y: Math.cos(rotation),
  };
}