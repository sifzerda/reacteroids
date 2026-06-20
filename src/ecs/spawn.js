// ecs/spawn.js

import { world } from './core/world';
import { enemyDefs } from './content/enemyDefs';
import { acquireBullet } from './pools/bulletPool';
import { acquireExhaust } from './pools/exhaustPool';
import { acquireFlash } from './pools/flashPool';
import { acquireSmoke } from './pools/smokePool';
import { acquireSpark } from './pools/sparkPool';
import { acquireMissile } from './pools/missilePool';
import { acquireBeam } from './pools/beamPool';

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
    invulnerable: 2,

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

export function spawnAsteroid({
  x,
  y,
  vx = 0,
  vy = 0,
  radius = 1,
  size = 3
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
  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);

  x += cos * muzzleOffset;
  y += sin * muzzleOffset;

  const bullet = acquireBullet();

  Object.assign(bullet, {

    bullet: true,
    bulletType,

    x,
    y,

    rotation,

    vx: cos * speed,
    vy: sin * speed,

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

  return world.add(bullet);
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
  colorG = 0,
  colorB = 0,

  glow = 1,

  life = 0.1

}) {

  const beam = acquireBeam();

  Object.assign(beam, {
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

    life,
  });

  return world.add(beam);
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

  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);

  const missile = acquireMissile();

  Object.assign(missile, {
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

    vx: cos * 10,
    vy: sin * 10,
  });

  return world.add(missile);
}


/*
|--------------------------------------------------------------------------
| EXHAUST
|--------------------------------------------------------------------------
*/

export function spawnExhaust({ x, y, vx, vy }) {

  const exhaust = acquireExhaust();

  Object.assign(exhaust, {

    particle: true,
    particleExhaust: true,

    x,
    y,

    vx,
    vy,

    life: 1.1,
    size: 10,

    colorR: 0.2,
    colorG: 0.7,
    colorB: 2.0,
  });

  return world.add(exhaust);
}

/*
|--------------------------------------------------------------------------
| MUZZLE FLASH
|--------------------------------------------------------------------------
*/

export function spawnFlash({
  x,
  y,
  rotation,
  size = 1,
  colorR = 1,
  colorG = 0.8,
  colorB = 0.2
}) {

  const flash = acquireFlash();

  Object.assign(flash, {

    particle: true,
    particleFlash: true,

    x,
    y,

    rotation,

    size: 6,

    colorR,
    colorG,
    colorB,

    life: 0.12,
  });

  return world.add(flash);
}

/*
|--------------------------------------------------------------------------
| SMOKE
|--------------------------------------------------------------------------
*/

export function spawnSmoke({
  x,
  y,
  vx = 0,
  vy = 0
}) {

  const smoke = acquireSmoke();

  Object.assign(smoke, {

    particle: true,
    particleSmoke: true,

    x,
    y,

    vx,
    vy,

    size: 12,

    life: 0.7,

    colorR: 0.5,
    colorG: 0.5,
    colorB: 0.5,
  });

  return world.add(smoke);
}

/*
|--------------------------------------------------------------------------
| SPARKS
|--------------------------------------------------------------------------
*/

export function spawnSpark({
  x,
  y,
  vx,
  vy
}) {

  const spark = acquireSpark();

  Object.assign(spark, {

    particle: true,
    particleSpark: true,

    x,
    y,

    vx,
    vy,

    size: 16,

    life: 0.35,

    colorR: 1,
    colorG: 1,
    colorB: 1,
  });

  return world.add(spark);
}
