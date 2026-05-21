// This component represents the position and rotation of an entity in the game world.
// src/ecs/components/transform.js
export function transform(
  x = 0,
  y = 0,
  rotation = 0
) {
  return {
    x,
    y,
    rotation,
  };
}