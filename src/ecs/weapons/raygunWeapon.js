import { spawnBullet } from '../factories/spawnBullet';

export const raygunWeapon = {
  cooldown: 0.15,

  fire(ship) {
    const muzzleDistance = 0.7;

    spawnBullet({
      x:
        ship.x +
        Math.cos(ship.rotation) * muzzleDistance,

      y:
        ship.y +
        Math.sin(ship.rotation) * muzzleDistance,

      rotation: ship.rotation,

      speed: 20,

      colorR: 1,
      colorG: 0,
      colorB: 1,
    });
  },
};