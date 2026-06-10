// src/ecs/features/lasergun/index.js

import {lasergunWeapon } from './lasergunWeapon';
import { laserDamageSystem } from './laserDamageSystem';
import { lasergunSystem } from './lasergunSystem';

export default {

  id: 'laser',

  hotkey: 'Digit4',

  weapon: lasergunWeapon,

  cooldown: lasergunWeapon.cooldown,

  systems: [
    lasergunSystem, laserDamageSystem
  ],

  fire(ship) {
    lasergunWeapon.fire(ship);
  },
};