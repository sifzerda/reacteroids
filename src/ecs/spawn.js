// ecs/spawn.js

import { world } from './core/world';
import { enemyDefs } from './content/enemyDefs';

/*
|--------------------------------------------------------------------------
| SHIP
|--------------------------------------------------------------------------
*/

export function spawnShip() {

  return world.add({

    ship: true,
    wrap: true,

    lives: 3,
    invulnerable: 0,

    weapon: 'raygun',
    cooldown: 0,

    x: 0,
    y: 0,
    rotation: 0,

    vx: 0,
    vy: 0,

    radius: 0.45,
  });
}

/*
|--------------------------------------------------------------------------
| ASTEROID
|--------------------------------------------------------------------------
*/

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

    x,
    y,

    vx,
    vy,

    radius,

    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 1.5,
  });
}

/*
|--------------------------------------------------------------------------
| BULLET
|--------------------------------------------------------------------------
*/

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

  bulletType = 'normal',

  length = 1,
  width = 1,
  glow = 1,
  distortion = 1,

}) {

  const vx = Math.cos(rotation) * speed;
  const vy = Math.sin(rotation) * speed;

  return world.add({

    bullet: true,
    bulletType,

    x,
    y,
    rotation,

    vx,
    vy,

    radius,

    life,

    colorR,
    colorG,
    colorB,

    damage,
    speed,

    length,
    width,
    glow,
    distortion,
  });
}

/*
|--------------------------------------------------------------------------
| ENEMIES
|--------------------------------------------------------------------------
*/

export function spawnEnemy(type, x, y) {

  const def = enemyDefs[type];

  if (!def) {

    console.warn(`Unknown enemy type: ${type}`);

    return null;
  }

  return world.add({

    enemy: true,

    enemyType: type,

    x,
    y,

    vx: 0,
    vy: 0,

    rotation: 0,

    hp: def.hp,
    maxHp: def.hp,

    speed: def.speed,

    radius: def.radius,

    wrap: true,
  });
}

/*
|--------------------------------------------------------------------------
| EXHAUST
|--------------------------------------------------------------------------
*/

export function spawnExhaustParticle({
  x,
  y,
  vx,
  vy,
}) {

  return world.add({

    exhaust: true,

    x,
    y,

    vx,
    vy,

    life: 1.1,

    radius: 0.12,

    colorR: 0.2,
    colorG: 0.7,
    colorB: 2.0,
  });
}