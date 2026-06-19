// ecs/spawn.js

import { world } from './core/world';
import { enemyDefs } from './content/enemyDefs';
import { acquireBullet } from './pools/bulletPool';
import { acquireParticle } from './pools/particlePool';
import { acquireMissile } from './pools/missilePool';
import { acquireBeam } from './pools/beamPool';
import { PARTICLE_SPARK, PARTICLE_FLASH, PARTICLE_EXHAUST, PARTICLE_SMOKE } from './shared/particleTypes';
import { particleDefs } from './content/particleDefs';

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
| PARTICLES
|--------------------------------------------------------------------------
*/

export function spawnParticle({

  particleType,

  x,
  y,

  vx = 0,
  vy = 0,

  life,
  size,

  colorR = 1,
  colorG = 1,
  colorB = 1,

}) {

  const particle = acquireParticle();
  const def = particleDefs[particleType];

  particle.particle = true;
  particle.particleType = particleType;

  particle.x = x;
  particle.y = y;

  particle.vx = vx;
  particle.vy = vy;

  particle.life = life ?? def.life;

  particle.size = size ?? def.size;

  particle.colorR = colorR;
  particle.colorG = colorG;
  particle.colorB = colorB;

  return world.add(particle);
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

export function spawnExhaustParticle({ x, y, vx, vy }) {

  const exhaust = acquireExhaust();

  Object.assign(exhaust, {
    particle: true,
    particleType: PARTICLE_EXHAUST,

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

  return world.add(exhaust);
}

/*
|--------------------------------------------------------------------------
| MUZZLE FLASH
|--------------------------------------------------------------------------
*/

export function spawnMuzzleFlash({
  x,
  y,
  rotation,
  size = 1,
  colorR = 1,
  colorG = 0.8,
  colorB = 0.2
}) {

  const particle = acquireParticle();

  Object.assign(particle, {
    particle: true,
    particleType: PARTICLE_FLASH,

    x,
    y,

    rotation,

    size,

    colorR,
    colorG,
    colorB,

    life: 0.06,
  });

  return world.add(particle);
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

  const particle = acquireParticle();

  Object.assign(particle, {
    particle: true,
    particleType: PARTICLE_SMOKE,

    x,
    y,

    vx,
    vy,

    radius: 0.4,
    life: 0.7,
  });

  return world.add(particle);
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

  const particle = acquireParticle();

  Object.assign(particle, {
    particle: true,
    particleType: PARTICLE_SPARK,

    x,
    y,

    vx,
    vy,

    life: 0.35,
  });

  return world.add(particle);
}
