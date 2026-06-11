// src/ecs/abilities/weaponAbilities.js

import { spawnBullet } from '../shared/factories/spawnBullet.js';

export const weaponAbilities = {

  singleShot(ship) {

    spawnBullet({

      x: ship.x,
      y: ship.y,

      rotation: ship.rotation,

      speed: 20,

      colorR: 0,
      colorG: 1,
      colorB: 1
    });
  },

  rapidShot(ship) {

    spawnBullet({

      x: ship.x,
      y: ship.y,

      rotation: ship.rotation,

      speed: 25,

      colorR: 1,
      colorG: 1,
      colorB: 0
    });
  },

  spreadShot(ship) {

    const spread = 0.25;

    for (let i = -2; i <= 2; i++) {

      spawnBullet({

        x: ship.x,
        y: ship.y,

        rotation: ship.rotation + i * spread,

        speed: 18
      });
    }
  },

  rainbowShot(ship) {

    const colors = [

      [1,0,0],
      [1,0.5,0],
      [1,1,0],
      [0,1,0],
      [0,0,1],
      [1,0,1],
    ];

    colors.forEach((c,index) => {

      spawnBullet({

        x: ship.x,
        y: ship.y,

        rotation: ship.rotation + (index - 3) * 0.05,

        colorR:c[0],
        colorG:c[1],
        colorB:c[2],

        speed:22,
        glow:2
      });

    });
  },

  //  flameBurst(ship){

 //   spawnBullet({

 //     x: ship.x,
  //    y: ship.y,

  //    rotation: ship.rotation + (Math.random() -0.5) * 0.4,
  //    speed: 8,
  //    life: 0.4,
  //    radius: 0.08,
  //    colorR: 1,
  //    colorG: 0.4,
  //    colorB: 0
 //   });

 // },

 // chargeBeam(ship, delta){


//},



};