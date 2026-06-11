// src/ecs/core/queries.js

import { world } from './world';

export const ships = world.with('ship');
export const bullets = world.with('bullet');

export const lasers = world.with('laser');
export const enemies = world.with('enemy');

export const asteroids = world.with('asteroid');
export const exhaustParticles = world.with('exhaust');

export const movable = world.with('x', 'y', 'vx', 'vy');
export const collidable = world.with('x', 'y', 'radius');
export const wrappable = world.with('wrap', 'x', 'y');