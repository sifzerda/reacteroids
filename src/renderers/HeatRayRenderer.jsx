// src/renderers/HeatRayRenderer.jsx

import { heatrays } from '../ecs/queries';

export default function HeatRayRenderer() {

    const lines = [];

    for (const beam of heatrays) {

        const ship = beam.ship;

        const start = [ship.x, ship.y, 0];
        const end = [ship.x + Math.cos(ship.rotation) * beam.length, ship.y + Math.sin(ship.rotation) * beam.length, 0];

        lines.push(

            <line key={ship.id}>

                <bufferGeometry>

                    <bufferAttribute
                        attach="attributes-position"
                        count={2}
                        itemSize={3}
                        array={new Float32Array([...start, ...end])} />

                </bufferGeometry>

                <lineBasicMaterial color="#ff0000" />

            </line>
        );
    }

    return <>{lines}</>;
}