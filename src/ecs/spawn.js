// ecs/spawn.js

import { world } from './core/world';

import { weapons } from './content/weapons';
import { enemies } from './content/enemies';

export function spawnShip() {

  return world.add({

    ship: true,

    wrap: true,

    x: 0,
    y: 0,

    rotation: 0,

    vx: 0,
    vy: 0,

    radius: 0.45,

    lives: 3,

    invulnerable: 0,

    weapon: 'raygun',

    cooldown: 0,
  });
}

export function spawnBullet({

  x,
  y,

  rotation,

  speed = 20,

  damage = 100,

  radius = 0.15,

  colorR = 1,
  colorG = 1,
  colorB = 1,

  life = 1.2,

  length = 1,
  width = 1,
  glow = 1,
  distortion = 0,
}) {

  return world.add({

    bullet: true,

    x,
    y,

    rotation,

    vx:
      Math.cos(rotation) *
      speed,

    vy:
      Math.sin(rotation) *
      speed,

    damage,

    radius,

    life,

    colorR,
    colorG,
    colorB,

    length,
    width,
    glow,
    distortion,

    speed,
  });
}

export function spawnEnemy(
  type,
  x,
  y
) {

  const def =
    enemies[type];

  return world.add({

    enemy: true,

    enemyType: type,

    x,
    y,

    vx: 0,
    vy: 0,

    hp: def.hp,

    speed: def.speed,

    radius: def.radius,
  });
}