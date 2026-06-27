// ecs/spawn.js

import { world } from './core/world';
import { acquireAsteroid } from './pools/asteroidPool';
import { acquireBullet } from './pools/bulletPool';
import { acquireExhaust } from './pools/exhaustPool';
import { acquireSpark } from './pools/sparkPool';
import { acquireMissile } from './pools/missilePool';
import { acquireBeam } from './pools/beamPool';
import { weapons } from './content/weapons';

/*
|--------------------------------------------------------------------------
| SHIP
|--------------------------------------------------------------------------
*/
export function spawnShip() {

  const ship = {
    ship: true,
    wrap: true,
    lives: 3,
    invulnerable: 2,
    weapon: 'raygun',
    currentWeapon: weapons.raygun,
    cooldown: 0,
    x: 0,
    y: 0,
    rotation: 0,

    // Cached direction vectors
    forwardX: 1,
    forwardY: 0,
    rightX: 0,
    rightY: 1,

    vx: 0,
    vy: 0,
    radius: 0.45,
  };

  return world.add(ship);

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


  const asteroid = acquireAsteroid();


  asteroid.asteroid = true;

  asteroid.size = size;

  asteroid.wrap = true;


  asteroid.x = x;
  asteroid.y = y;


  asteroid.vx = vx;
  asteroid.vy = vy;


  asteroid.radius = radius;


  asteroid.rotation =
    Math.random() * Math.PI * 2;


  asteroid.rotationSpeed =
    (Math.random() - 0.5) * 1.5;


  return world.add(asteroid);

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
  rainbow = false,
  life = 1.2,
  bulletType = 'normal',
  length = 1.5,
  width = 0.2,
  glow = 1,
}) {

  const bullet = acquireBullet();

  bullet.bullet = true;
  bullet.bulletType = bulletType;
  bullet.x = x;
  bullet.y = y;
  bullet.rotation = rotation;
  bullet.vx = Math.cos(rotation) * speed;
  bullet.vy = Math.sin(rotation) * speed;
  bullet.radius = radius;
  bullet.life = life;
  bullet.colorR = colorR;
  bullet.colorG = colorG;
  bullet.colorB = colorB;
  bullet.rainbow = rainbow;
  bullet.damage = damage;
  bullet.speed = speed;
  bullet.length = length;
  bullet.width = width;
  bullet.glow = glow;

  return world.add(bullet);
}

/*
|--------------------------------------------------------------------------
| BEAM PROJECTILE
|--------------------------------------------------------------------------
*/

export function spawnBeam({ beamType = 'laser', x, y, rotation, damage, length, width, colorR = 1, colorG = 0, colorB = 0, glow = 1, life = 0.1 }) {

  const beam = acquireBeam();

  beam.beam = true;
  beam.beamType = beamType;
  beam.x = x;
  beam.y = y;
  beam.rotation = rotation;
  beam.damage = damage;
  beam.length = length;
  beam.width = width;
  beam.colorR = colorR;
  beam.colorG = colorG;
  beam.colorB = colorB;
  beam.glow = glow;
  beam.life = life;

  return world.add(beam);
}

/*
|--------------------------------------------------------------------------
| MISSILE BULLET
|--------------------------------------------------------------------------
*/

export function spawnMissile({ x, y, rotation, target }) {

  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);

  const missile = acquireMissile();

  missile.missile = true;
  missile.x = x;
  missile.y = y;
  missile.rotation = rotation;
  missile.target = target;
  missile.speed = 10;
  missile.turnRate = 5;
  missile.damage = 1000;
  missile.radius = 0.4;
  missile.life = 12;
  missile.vx = cos * 10;
  missile.vy = sin * 10;

  return world.add(missile);
}

/*
|--------------------------------------------------------------------------
| EXHAUST
|--------------------------------------------------------------------------
*/

export function spawnExhaust({ x, y, vx, vy }) {

  const exhaust = acquireExhaust();

  exhaust.particle = true;
  exhaust.particleExhaust = true;
  exhaust.x = x;
  exhaust.y = y;
  exhaust.vx = vx * 0.3;
  exhaust.vy = vy * 0.3;
  exhaust.life = 1.0;
  exhaust.size = 14 + Math.random() * 8;
  exhaust.colorR = 0.2;
  exhaust.colorG = 0.7;
  exhaust.colorB = 2.0;

  return world.add(exhaust);
}

/*
|--------------------------------------------------------------------------
| SPARKS
|--------------------------------------------------------------------------
*/

export function spawnSpark({ x, y, vx, vy, colorR = 1, colorG = 1, colorB = 1 }) {

  const spark = acquireSpark();

  spark.particle = true;
  spark.particleSpark = true;

  spark.x = x;
  spark.y = y;

  spark.vx = vx;
  spark.vy = vy;

  spark.size = 16;
  spark.life = 0.35;

  spark.colorR = colorR;
  spark.colorG = colorG;
  spark.colorB = colorB;

  return world.add(spark);
}