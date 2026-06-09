// src/ecs/features/index.js

import raygun from './raygun';
import shotgun from './shotgun';
import machinegun from './machinegun';

export const features = [
  raygun,
  shotgun,
  machinegun,
];

export const featureMap = {};

for (const feature of features) {
  featureMap[feature.id] = feature;
}