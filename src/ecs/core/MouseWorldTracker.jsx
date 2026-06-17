// src/ecs/core/MouseWorldTracker.jsx

import { useFrame, useThree } from '@react-three/fiber';
import { mouse } from './input';

export default function MouseWorldTracker() {

  const { viewport, size } = useThree();

  useFrame(() => {

    mouse.worldX = ((mouse.x / size.width) - 0.5) * viewport.width;
    mouse.worldY = (0.5 - mouse.y / size.height) * viewport.height;
  });

  return null;
}