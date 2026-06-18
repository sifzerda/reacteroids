// src/content/particleDefs.js

import {
  PARTICLE_EXHAUST,
  PARTICLE_SMOKE,
  PARTICLE_SPARK,
  PARTICLE_FLASH
}
from '../shared/particleTypes.js';

export const particleDefs = {

  [PARTICLE_EXHAUST]: {
    size: 16,
    life: 1.1,
  },

  [PARTICLE_SMOKE]: {
    size: 24,
    life: 1.2,
  },

  [PARTICLE_SPARK]: {
    size: 8,
    life: 0.35,
  },

  [PARTICLE_FLASH]: {
    size: 32,
    life: 0.06,
  },
};