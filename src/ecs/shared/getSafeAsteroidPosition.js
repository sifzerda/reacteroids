// src/ecs/shared/getSafeAsteroidPosition.js
// helper function for safe ship spawning on game start

import { ships } from '../core/queries';

export function getSafeAsteroidPosition() {

  const ship = ships[0];

  const angle =
    Math.random() * Math.PI * 2;

  const distance =
    12 + Math.random() * 6;

  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  if (!ship) {

    return {
      x: cos * distance,
      y: sin * distance,
    };
  }

  return {
    x: ship.x + cos * distance,
    y: ship.y + sin * distance,
  };
}