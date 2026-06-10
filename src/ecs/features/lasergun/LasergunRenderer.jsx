// src/ecs/features/lasergun/LasergunRenderer.jsx

import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { lasers } from '../../core/queries.js';

const MAX = 256;

export default function LaserRenderer() {

    const geometry = useMemo(() => {

        const geo =
            new THREE.InstancedBufferGeometry();

        const plane =
            new THREE.PlaneGeometry(1, 1);

        geo.index = plane.index;

        geo.attributes.position =
            plane.attributes.position;

        geo.attributes.uv =
            plane.attributes.uv;

        geo.setAttribute(
            'offset',
            new THREE.InstancedBufferAttribute(
                new Float32Array(MAX * 3),
                3
            )
        );

        geo.setAttribute(
            'rotation',
            new THREE.InstancedBufferAttribute(
                new Float32Array(MAX),
                1
            )
        );

        geo.setAttribute(
            'laserLength',
            new THREE.InstancedBufferAttribute(
                new Float32Array(MAX),
                1
            )
        );

        geo.setAttribute(
            'laserWidth',
            new THREE.InstancedBufferAttribute(
                new Float32Array(MAX),
                1
            )
        );

        geo.setAttribute(
            'instanceColor',
            new THREE.InstancedBufferAttribute(
                new Float32Array(MAX * 3),
                3
            )
        );

        return geo;

    }, []);

    const material = useMemo(() => {

        return new THREE.ShaderMaterial({

            transparent: true,

            blending:
                THREE.AdditiveBlending,

            depthWrite: false,

            uniforms: {},

            vertexShader: `

        attribute vec3 offset;
        attribute float rotation;
        attribute float laserLength;
        attribute float laserWidth;
        attribute vec3 instanceColor;

        varying vec3 vColor;
        varying vec2 vUv;

        mat2 rotate2D(float a){

          float s = sin(a);
          float c = cos(a);

          return mat2(
            c,-s,
            s, c
          );
        }

        void main(){

          vUv = uv;
          vColor = instanceColor;

vec3 pos = position;

// local beam coords
float f = pos.x * laserLength;
float s = pos.y * laserWidth;

// game forward direction
vec2 forward = vec2(
  cos(rotation),
  sin(rotation)
);

vec2 side = vec2(
  -forward.y,
  forward.x
);

// anchor beam at muzzle
f += laserLength * 0.5;

// rebuild in world orientation
pos.xy =
    forward * f +
    side * s;

          pos += offset;

          gl_Position =
            projectionMatrix *
            modelViewMatrix *
            vec4(pos,1.0);
        }
      `,

            fragmentShader: `

        varying vec2 vUv;
        varying vec3 vColor;

        void main(){

          float beam =
            smoothstep(
              0.5,
              0.0,
              abs(vUv.y - 0.5)
            );

          vec3 color =
            vColor * beam * 4.0;

          gl_FragColor =
            vec4(color, beam);
        }
      `
        });

    }, []);

    useFrame(() => {

        const offsets =
            geometry.attributes.offset.array;

        const rotations =
            geometry.attributes.rotation.array;

        const lengths =
            geometry.attributes.laserLength.array;

        const widths =
            geometry.attributes.laserWidth.array;

        const colors =
            geometry.attributes.instanceColor.array;

        let i = 0;

        for (const laser of lasers) {

            const i3 = i * 3;

            offsets[i3] = laser.x;
            offsets[i3 + 1] = laser.y;
            offsets[i3 + 2] = 0;

            rotations[i] =
                laser.rotation;

            lengths[i] =
                laser.length;

            widths[i] =
                laser.width;

            colors[i3] =
                laser.colorR;

            colors[i3 + 1] =
                laser.colorG;

            colors[i3 + 2] =
                laser.colorB;

            i++;
        }

        geometry.instanceCount = i;

        for (const attr of Object.values(
            geometry.attributes
        )) {
            attr.needsUpdate = true;
        }

    });

    return (
        <mesh
            geometry={geometry}
            material={material}
            frustumCulled={false}
        />
    );
}