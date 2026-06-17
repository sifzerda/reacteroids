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

            if (dist < ship.radius + asteroid.radius && ship.invulnerable <= 0) {
                // LOSE A LIFE
                ship.lives -= 1;
                // TEMP INVULNERABILITY
                ship.invulnerable = 2;
                // RESET SHIP POSITION
                ship.x = 0;
                ship.y = 0;

                ship.vx = 0;
                ship.vy = 0;

                for (const asteroid of asteroids) {

                    const dx = asteroid.x - ship.x;
                    const dy = asteroid.y - ship.y;

                    const dist = Math.hypot(dx, dy);

                    if (dist < 6) {

                        const angle = Math.random() * Math.PI * 2;

                        asteroid.x = Math.cos(angle) * 10;
                        asteroid.y = Math.sin(angle) * 10;
                    }
                }

                // GAME OVER
                if (ship.lives <= 0) {
                    onGameOver?.();
                }
            }

        }
    }
}