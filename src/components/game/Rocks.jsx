// components/Rocks.js

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const MAX_ASTEROIDS = 1000;

const ASTEROID_MIN_SPEED = 0.5;
const ASTEROID_MAX_SPEED = 2;
const SPAWN_INTERVAL = 0.5;

const ASTEROID_SIZES = {
  LARGE: 2.0,
  MEDIUM: 0.1,
  SMALL: 0.5,
};

const ASTEROID_HEALTH = {
  LARGE: 500,
  MEDIUM: 300,
  SMALL: 100,
};

export default function Rocks({bulletsRef, shipDataRef, setLives, lives, fxRef}) {

  const meshRef = useRef();
  const asteroids = useRef([]);
  const spawnTimer = useRef(0);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const collisionCooldown = useRef(0);
  const bulletGrid = useRef(new Map());
  const tempVec = useMemo(() => new THREE.Vector3(), []);

  // ==========================================
  // GPU ATTRIBUTES
  // ==========================================
  const healthArray = useMemo(() => new Float32Array(MAX_ASTEROIDS), []);
  const flashArray = useMemo(() => new Float32Array(MAX_ASTEROIDS), []);
  const healthAttr = useMemo(() => new THREE.InstancedBufferAttribute(healthArray, 1), [healthArray]);
  const flashAttr = useMemo(() => new THREE.InstancedBufferAttribute(flashArray, 1), [flashArray]);
  const rand = (min, max) => Math.random() * (max - min) + min;

  // ==========================================
  // MATERIAL (SHADER MOD)
  // ==========================================
  const material = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({roughness: 0.85, flatShading: true});

    mat.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
        #include <common>
        attribute float instanceHealth;
        attribute float instanceFlash;
        varying float vHealth;
        varying float vFlash;
        `
      );

      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>
        vHealth = instanceHealth;
        vFlash = instanceFlash;
        `
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <common>',
        `
        #include <common>
        varying float vHealth;
        varying float vFlash;
        `
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <color_fragment>',
        `
        #include <color_fragment>
        vec3 baseColor = vec3(0.6, 0.65, 0.7);
        baseColor *= (0.75 + 0.25 * vHealth);
        vec3 flashColor = vec3(1.0, 0.5, 0.15);
        baseColor = mix(baseColor, flashColor, vFlash);
        diffuseColor.rgb = baseColor;
        `
      );
    };

    return mat;
  }, []);

  // ==========================================
  // SPAWN
  // ==========================================
  function spawnAsteroid(size = 'LARGE', position = null) {
    if (asteroids.current.length >= MAX_ASTEROIDS) return;

    const radius = ASTEROID_SIZES[size];
    const limit = 10;

    let pos = new THREE.Vector3();

    if (position) {
      pos.copy(position);
    } else {
      const edge = Math.floor(Math.random() * 4);
      const padding = 1.5;

      if (edge === 0) pos.set(rand(-limit, limit), limit + padding, 0);
      else if (edge === 1) pos.set(rand(-limit, limit), -limit - padding, 0);
      else if (edge === 2) pos.set(-limit - padding, rand(-limit, limit), 0);
      else pos.set(limit + padding, rand(-limit, limit), 0);
    }

    const vel = new THREE.Vector3(
      rand(-1, 1),
      rand(-1, 1),
      0
    ).normalize().multiplyScalar(rand(ASTEROID_MIN_SPEED, ASTEROID_MAX_SPEED));

    asteroids.current.push({
      pos,
      vel,
      radius,
      size,
      health: ASTEROID_HEALTH[size],
      maxHealth: ASTEROID_HEALTH[size],
      visualHealth: ASTEROID_HEALTH[size],
      rotX: rand(0, Math.PI),
      rotY: rand(0, Math.PI),
      hitFlash: 0,
    });
  }

  // ==========================================
  // DESTROY
  // ==========================================
  function destroyAsteroid(index) {
    const asteroid = asteroids.current[index];
    // ==========================================
    // EXPLOSION PARTICLES
    // ==========================================
    for (let i = 0; i < 28; i++) {
      tempVec.set(Math.random() - 0.5, Math.random() - 0.5, 0).normalize();

      fxRef?.current?.spawnExplosionParticle?.({
        position: asteroid.pos,

        velocity:
          tempVec.clone()
            .multiplyScalar(1 + Math.random() * 4)
            .add(asteroid.vel),

        color: [2.4, 1.2 + Math.random(), 0.25],
        life: 0.5 + Math.random() * 0.6,
      });

      fxRef?.current?.spawnShockwave?.(asteroid.pos, '#ffaa44');
    }

    const nextSize =
      asteroid.size === 'LARGE'
        ? 'MEDIUM'
        : asteroid.size === 'MEDIUM'
          ? 'SMALL'
          : null;

    if (nextSize) {
      for (let i = 0; i < 2; i++) {
        tempVec.set(Math.random() - 0.5, Math.random() - 0.5, 0).normalize();
        spawnAsteroid(nextSize, asteroid.pos.clone());
        asteroids.current[asteroids.current.length - 1].vel =
          tempVec.clone().multiplyScalar(rand(1, 2));
      }
    }

    const last = asteroids.current.length - 1;
    asteroids.current[index] = asteroids.current[last];
    asteroids.current.pop();
  }

  const GRID_SIZE = 2;

  function getCellKey(x, y) {
    const cx = Math.floor(x / GRID_SIZE);
    const cy = Math.floor(y / GRID_SIZE);
    return `${cx},${cy}`;
  }

  function insertBulletIntoGrid(grid, bullet) {
    const key = getCellKey(bullet.pos.x, bullet.pos.y);

    if (!grid.has(key)) {
      grid.set(key, []);
    }

    grid.get(key).push(bullet);
  }

  function getNearbyBullets(grid, x, y) {
    const cx = Math.floor(x / GRID_SIZE);
    const cy = Math.floor(y / GRID_SIZE);

    const bullets = [];

    for (let ox = -1; ox <= 1; ox++) {
      for (let oy = -1; oy <= 1; oy++) {
        const key = `${cx + ox},${cy + oy}`;

        const cell = grid.get(key);

        if (cell) bullets.push(...cell);
      }
    }

    return bullets;
  }

  // ==========================================
  // UPDATE LOOP
  // ==========================================
  useFrame((_, delta) => {
    spawnTimer.current += delta;

    // collision cooldown
    if (collisionCooldown.current > 0) {
      collisionCooldown.current -= delta;
    }

    if (spawnTimer.current > SPAWN_INTERVAL) {
      spawnTimer.current = 0;
      for (let i = 0; i < 2; i++) spawnAsteroid();
    }

    // get bullets
    const bullets = bulletsRef?.current?.getBullets?.() || [];

    // ==========================================
    // BUILD SPATIAL GRID
    // ==========================================
    bulletGrid.current.clear();

    for (let i = 0; i < bullets.length; i++) {
      const b = bullets[i];

      if (!b.active || b.life <= 0) continue;

      insertBulletIntoGrid(bulletGrid.current, b);
    }

    for (let i = asteroids.current.length - 1; i >= 0; i--) {
      const a = asteroids.current[i];

      a.pos.addScaledVector(a.vel, delta);
      a.rotX += delta * 0.4;
      a.rotY += delta * 0.3;

      a.visualHealth = THREE.MathUtils.lerp(a.visualHealth, a.health, 0.35);
      a.hitFlash = Math.max(0, a.hitFlash - delta * 4);

      // ==========================================
      // SHIP COLLISION
      // ==========================================
      if (shipDataRef?.current && collisionCooldown.current <= 0 && lives > 0) {
        const ship = shipDataRef.current;

        const dx = a.pos.x - ship.position.x;
        const dy = a.pos.y - ship.position.y;

        const distSq = dx * dx + dy * dy;
        const hitRadius = a.radius + ship.radius;

        if (distSq < hitRadius * hitRadius) {
          collisionCooldown.current = 1.2;

          setLives((v) => Math.max(v - 1, 0));

          tempVec
            .copy(a.pos)
            .sub(ship.position)
            .normalize();

          a.vel.addScaledVector(tempVec, 1.8);

          ship.hit?.();
          a.hitFlash = 1;
          destroyAsteroid(i);
          continue;
        }
      }

      // ==========================================
      // SPATIAL HASH COLLISION
      // ==========================================
      const nearbyBullets = getNearbyBullets(bulletGrid.current, a.pos.x, a.pos.y);

      for (let j = 0; j < nearbyBullets.length; j++) {
        const b = nearbyBullets[j];

        if (!b.active) continue;

        const dx = a.pos.x - b.pos.x;
        const dy = a.pos.y - b.pos.y;

        const distSq = dx * dx + dy * dy;
        const hitRadius = a.radius + 0.15;

        if (distSq < hitRadius * hitRadius) {
          b.active = false;
          b.life = 0;
          a.health -= b.damage || 100;

          tempVec
            .copy(b.vel)
            .normalize();

          const impactForce = (b.damage || 100) * 0.0025;

          a.vel.addScaledVector(tempVec, impactForce);
          a.hitFlash = 1;

          if (a.health <= 0) {
            destroyAsteroid(i);
          }

          break;
        }
      }
    }

    // ==========================================
    // ASTEROID VS ASTEROID COLLISION
    // ==========================================
    for (let i = 0; i < asteroids.current.length; i++) {
      const a = asteroids.current[i];

      for (let j = i + 1; j < asteroids.current.length; j++) {
        const b = asteroids.current[j];

        const dx = b.pos.x - a.pos.x;
        const dy = b.pos.y - a.pos.y;

        const distSq = dx * dx + dy * dy;
        const minDist = a.radius + b.radius;

        if (distSq < minDist * minDist) {
          const dist = Math.sqrt(distSq) || 0.0001;

          tempVec.set(dx / dist, dy / dist, 0);

          const overlap = minDist - dist;

          // separate
          a.pos.addScaledVector(tempVec, -overlap * 0.5);
          b.pos.addScaledVector(tempVec, overlap * 0.5);

          // velocity push
          a.vel.addScaledVector(tempVec, -0.12);
          b.vel.addScaledVector(tempVec, 0.12);
        }
      }
    }

    const mesh = meshRef.current;
    if (!mesh) return;

    for (let i = 0; i < asteroids.current.length; i++) {
      const a = asteroids.current[i];

      dummy.position.copy(a.pos);
      dummy.rotation.set(a.rotX, a.rotY, 0);
      dummy.scale.setScalar(a.radius);
      dummy.updateMatrix();

      mesh.setMatrixAt(i, dummy.matrix);

      healthArray[i] = a.visualHealth / a.maxHealth;
      flashArray[i] = a.hitFlash;
    }

    mesh.count = asteroids.current.length;
    mesh.instanceMatrix.needsUpdate = true;
    healthAttr.needsUpdate = true;
    flashAttr.needsUpdate = true;
  });

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <instancedMesh
      ref={meshRef}
      args={[new THREE.IcosahedronGeometry(1, 1), material, MAX_ASTEROIDS]}>
      <instancedBufferAttribute
        attach="geometry-attributes-instanceHealth"
        args={[healthArray, 1]}
      />
      <instancedBufferAttribute
        attach="geometry-attributes-instanceFlash"
        args={[flashArray, 1]}
      />
    </instancedMesh>
  );
}