import { spawnBullet } from '../factories/spawnBullet';

export const normalWeapon = {

  cooldown: 0.15,

  fire(ship) {

    const muzzle = 0.7;

    spawnBullet({

      x: ship.x + Math.cos(ship.rotation) * muzzle,
      y: ship.y + Math.sin(ship.rotation) * muzzle,

      rotation: ship.rotation,
    });
  },
};