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

    chargeTime: 0,
    charging: false,
  });
}

/*
|--------------------------------------------------------------------------
| ASTEROID
|--------------------------------------------------------------------------
*/

export function spawnAsteroid({ x, y, vx = 0, vy = 0, radius = 1, size = 3 }) {

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

  muzzleOffset = 0,

  speed = 20,
  damage = 100,
  radius = 0.15,

  colorR = 1,
  colorG = 0,
  colorB = 1,
  rainbow = false,

  life = 1.2,
  bulletType = 'normal',

  length = 1.5,
  width = 0.2,
  glow = 1,
}) {

  // move spawn point to muzzle
  x += Math.cos(rotation) * muzzleOffset;
  y += Math.sin(rotation) * muzzleOffset;

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

    rainbow,

    damage,
    speed,

    length,
    width,
    glow,
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

export function spawnExhaustParticle({ x, y, vx, vy }) {

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


/*
|--------------------------------------------------------------------------
| BEAM PROJECTILE
|--------------------------------------------------------------------------
*/

export function spawnBeam({

  beamType = 'laser',

  x,
  y,

  rotation,

  damage,

  length,
  width,

  colorR = 1,
  colorG = 1,
  colorB = 1,

  glow = 1,

  life = 0.1

}) {

  return world.add({

    beam: true,

    beamType,

    x,
    y,

    rotation,

    damage,

    length,
    width,

    colorR,
    colorG,
    colorB,

    glow,

    life
  });
}

  /*
  |--------------------------------------------------------------------------
  | MISSILE BULLET
  |--------------------------------------------------------------------------
  */

  export function spawnMissile({
  x,
  y,
  rotation,
  target
  }) {

    return world.add({

    missile: true,

    x,
    y,

    rotation,
    target,

    speed: 10,
    turnRate: 5,
    damage: 1000,
    radius: 0.4,
    life: 12,

    vx: Math.cos(rotation) * 10,
    vy: Math.sin(rotation) * 10
    });
  }