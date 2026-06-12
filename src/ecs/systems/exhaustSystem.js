
import { ships } from '../core/queries';
import { keys } from '../core/input';
import { spawnExhaustParticle } from '../spawn';

export function exhaustSystem() {

    for (const ship of ships) {
        if (!keys['ArrowUp']) continue;
        
        const angle = ship.rotation;
        const rearDistance = 0.40; // distance of emission from rear

        const x = ship.x - Math.cos(angle) * rearDistance;
        const y = ship.y - Math.sin(angle) * rearDistance;

        spawnExhaustParticle({
            x,
            y,

            vx: -Math.cos(angle) * 3 + (Math.random() - 0.5),
            vy: -Math.sin(angle) * 3 + (Math.random() - 0.5),
        });
    }
}