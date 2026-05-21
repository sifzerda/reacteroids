// src/ecs/components/velocity.js

export function velocity(
  vx = 0,
  vy = 0
) {
  return {
    vx,
    vy,
  };
}