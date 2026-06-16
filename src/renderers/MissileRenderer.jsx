// src/renderers/MissileRenderer.jsx

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { missiles } from '../ecs/core/queries';

const MAX = 5000;

const temp = new THREE.Object3D();

const glowGeometry =
    new THREE.SphereGeometry(
        0.25,
        6,
        6
    );

const glowMaterial =
    new THREE.MeshBasicMaterial({

        color: '#ff5500',

        transparent: true,

        opacity: 0.7,

        toneMapped: false
    });

export default function MissileRenderer() {

    const ref = useRef();

    const geometry = useMemo(() => {

        const shape = new THREE.ConeGeometry(
            0.18,
            0.8,
            6
        );

        shape.rotateZ(-Math.PI / 2);

        return shape;

    }, []);

    const material = useMemo(() => {

        return new THREE.MeshBasicMaterial({

            color: '#ff8844',

            toneMapped: false
        });

    }, []);

    useFrame(() => {

        if (!ref.current)
            return;

        let count = 0;

        for (const missile of missiles) {

            if (count >= MAX)
                break;

            temp.position.set(
                missile.x,
                missile.y,
                0
            );

            const rearX =
                missile.x -
                Math.cos(
                    missile.rotation
                ) * 0.4;

            const rearY =
                missile.y -
                Math.sin(
                    missile.rotation
                ) * 0.4;

            temp.rotation.z =
                missile.rotation;

            temp.scale.setScalar(1);

            temp.updateMatrix();

            ref.current.setMatrixAt(
                count,
                temp.matrix
            );

            count++;
        }

        ref.current.count = count;
        ref.current.instanceMatrix.needsUpdate =
            true;

    });

    return (

        <instancedMesh
            ref={ref}
            args={[
                geometry,
                material,
                MAX
            ]}
        />

    );
}