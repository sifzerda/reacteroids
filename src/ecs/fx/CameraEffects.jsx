// src/ecs/fx/CameraEffects.jsx

import { useThree, useFrame } from '@react-three/fiber';
import { gameEffects } from './gameEffects';

export default function CameraEffects() {

  const { camera } = useThree();

  useFrame(() => {

    if (
      gameEffects.screenShake > 0
    ) {

      const intensity = gameEffects.screenShake;

      camera.position.x = (Math.random() - 0.5) * 0.25 * intensity;
      camera.position.y = (Math.random() - 0.5) * 0.25 * intensity;

      gameEffects.screenShake *= 0.9;

    } else {

      camera.position.x = 0;
      camera.position.y = 0;
    }
  });

  return null;
}
