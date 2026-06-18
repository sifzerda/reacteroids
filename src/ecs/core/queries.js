// src/ecs/core/queries.js

import { world } from './world';

export const ships = world.with('ship');
export const bullets = world.with('bullet');
export const asteroids = world.with('asteroid');

export const enemies = world.with('enemy');

export const movable = world.with('x', 'y', 'vx', 'vy');
export const collidable = world.with('x', 'y', 'radius');
export const wrappable = world.with('wrap', 'x', 'y');

export const particles = world.with('particle');
export const beams = world.with('beam');
export const chargeEffects = world.with('chargeEffect');
export const missiles = world.with('missile');




