// src/ecs/factories/spawnAsteroid.js

import { world } from '../../core/world';

import { transform } from '../../components/transform';
import { velocity } from '../../components/velocity';
import { collider } from '../../components/collider';

export function spawnAsteroid({
  x,
  y,

  vx = 0,
  vy = 0,

  radius = 1,
  size = 3,
}) {

  return world.add({

    asteroid: true,
    size,
    wrap: true,

    ...transform(x, y),
    ...velocity(vx, vy),
    ...collider(radius),
  });
}