// src/ecs/weapons/machinegunWeapon.js
import { spawnBullet } from '../factories/spawnBullet';

export const machinegunWeapon = {

    cooldown: 0.05,

    fire(ship) {

        const muzzle = 0.7;

        spawnBullet({

            x:
                ship.x +
                Math.cos(ship.rotation) * muzzle,

            y:
                ship.y +
                Math.sin(ship.rotation) * muzzle,

            rotation: ship.rotation,

            speed: 26,

            damage: 35,

            life: 0.7,

            colorR: 0,
            colorG: 1,
            colorB: 1,
        });
    },
};