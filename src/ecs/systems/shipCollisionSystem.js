// src/ecs/systems/shipCollisionSystem.js

import { ships, asteroids } from '../core/queries';

export function shipCollisionSystem(delta, onGameOver) {
    for (const ship of ships) {
        // INVULNERABILITY TIMER
        if (ship.invulnerable > 0) {
            ship.invulnerable -= delta;
        }

        for (const asteroid of asteroids) {
            const dx = ship.x - asteroid.x;
            const dy = ship.y - asteroid.y;

            const dist = Math.sqrt(dx * dx + dy * dy);

            if (
                dist < ship.radius + asteroid.radius &&
                ship.invulnerable <= 0
            ) {
                // LOSE A LIFE
                ship.lives -= 1;
                // TEMP INVULNERABILITY
                ship.invulnerable = 2;
                // RESET SHIP POSITION
                ship.x = 0;
                ship.y = 0;

                ship.vx = 0;
                ship.vy = 0;

                // GAME OVER
                if (ship.lives <= 0) {
                    onGameOver?.();
                }
            }

        }
    }
}