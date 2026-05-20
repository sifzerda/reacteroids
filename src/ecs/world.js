// ecs/world.js

import { World } from 'miniplex';

export const world = new World();

world.addComponent({
    type: 'bullet',

    x: 0,
    y: 0,

    vx: 0,
    vy: 0,

    life: 1,
  damage: 100,

  radius: 0.15,

  colorR: 1,
  colorG: 0,
  colorB: 1,
});