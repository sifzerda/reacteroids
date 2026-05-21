// src/ecs/factories/spawnBullet.js

import { world } from '../world';

import { transform } from '../components/transform';
import { velocity } from '../components/velocity';
import { collider } from '../components/collider';
import { lifespan } from '../components/lifespan';
import { renderColor } from '../components/renderColor';

export function spawnBullet({
  x,
  y,
  rotation,

  speed = 20,
  damage = 100,

  radius = 0.15,

  colorR = 1,
  colorG = 0,
  colorB = 1,

  life = 1.2,
}) {

  const vx =
    Math.cos(rotation) * speed;

  const vy =
    Math.sin(rotation) * speed;

  return world.add({

    bullet: true,

    ...transform(
      x,
      y,
      rotation
    ),

    ...velocity(vx, vy),

    ...collider(radius),

    ...lifespan(life),

    ...renderColor(
      colorR,
      colorG,
      colorB
    ),

    damage,
  });
}