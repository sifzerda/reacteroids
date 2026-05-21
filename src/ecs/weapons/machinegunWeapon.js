import { spawnBullet } from '../factories/spawnBullet';

export const machinegunWeapon = {
  cooldown: 0.05,

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

      speed: 25,
      damage: 35,
      life: 0.7,

      colorR: 0,
      colorG: 1,
      colorB: 1,
    });
  },
};