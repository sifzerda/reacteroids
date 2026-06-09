// src/ecs/queries.js

import { world } from './world';

export const ships = world.with('ship');
export const bullets = world.with('bullet');

export const heatrays = world.with('heatray');
export const flamethrowers = world.with('flamethrower');

export const asteroids = world.with('asteroid');
export const exhaustParticles = world.with('exhaust');

export const movable = world.with('x', 'y', 'vx', 'vy');
export const collidable = world.with('x', 'y', 'radius');
export const wrappable = world.with('wrap', 'x', 'y');

export const bombWaves = world.with('bombWave');