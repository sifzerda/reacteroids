// src/ecs/features/index.js

import raygun from './raygun';
import shotgun from './shotgun';
import machinegun from './machinegun';
import lasergun from './lasergun';

export const features = [
  raygun,
  shotgun,
  machinegun,
  lasergun,
];

export const featureMap = {};

for (const feature of features) {
  featureMap[feature.id] = feature;
}