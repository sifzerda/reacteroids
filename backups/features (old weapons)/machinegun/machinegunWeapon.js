// src/ecs/features/machinegunWeapon.js
import { spawnBullet } from '../../../src/ecs/shared/factories/spawnBullet';

export const machinegunWeapon = {

    cooldown: 0.05,

    fire(ship) {

        const muzzle = 1.9; // position of bullet emission

        spawnBullet({

            x:
                ship.x +
                Math.cos(ship.rotation) * muzzle,

            y:
                ship.y +
                Math.sin(ship.rotation) * muzzle,

            rotation: ship.rotation,

            speed: 34,

            length: 2.5,
            width: 0.12,
            glow: 0.6,
            distortion: 0.1,

            damage: 35,

            life: 0.35,
            radius: 0.08,

            colorR: 0,
            colorG: 1,
            colorB: 1,
        });
    },
};