// src/ecs/queries.js

import { world } from './world';

export const ships = world.with('ship');
export const bullets = world.with('bullet');
export const movable = world.with( 'x', 'y', 'vx', 'vy' );
export const asteroids = world.with('asteroid');