import { spawnBullet } from '../factories/spawnBullet';

export const shotgunWeapon = {
  cooldown: 0.45,

  fire(ship) {
    const muzzleDistance = 0.7;

    const spread = 0.22;

    for (let i = -2; i <= 2; i++) {
      spawnBullet({
        x:
          ship.x +
          Math.cos(ship.rotation) * muzzleDistance,

        y:
          ship.y +
          Math.sin(ship.rotation) * muzzleDistance,

        rotation:
          ship.rotation + i * spread,

        speed: 18,
        damage: 40,

        colorR: 1,
        colorG: 0.5,
        colorB: 0,
      });
    }
  },
};