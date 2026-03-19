import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Points, PointMaterial } from '@react-three/drei';

const DigitalNetwork = () => {
  const { viewport, mouse } = useThree();
  const particleCount = 200;
  const connectionDistance = 2.5;

  // Generate random particles
  const particles = useMemo(() => {
    const tempPositions = new Float32Array(particleCount * 3);
    const tempVelocities = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
        // Distribute in a box
        tempPositions[i * 3] = (Math.random() - 0.5) * 15;
        tempPositions[i * 3 + 1] = (Math.random() - 0.5) * 15;
        tempPositions[i * 3 + 2] = (Math.random() - 0.5) * 15;

        // Small random velocities
        tempVelocities[i * 3] = (Math.random() - 0.5) * 0.02;
        tempVelocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
        tempVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    return { positions: tempPositions, velocities: tempVelocities };
  }, [particleCount]);

  const pointsRef = useRef();
  const linesRef = useRef();

  // Create line geometry
  const lineGeometry = useMemo(() => new THREE.BufferGeometry(), []);
  
  useFrame((state) => {
    const { positions, velocities } = particles;
    const linePositions = [];
    const lineColors = [];

    // Update positions and handle boundaries
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] += velocities[i3];
        positions[i3 + 1] += velocities[i3 + 1];
        positions[i3 + 2] += velocities[i3 + 2];

        // Bounce or wrap
        if (Math.abs(positions[i3]) > 10) velocities[i3] *= -1;
        if (Math.abs(positions[i3 + 1]) > 10) velocities[i3 + 1] *= -1;
        if (Math.abs(positions[i3 + 2]) > 10) velocities[i3 + 2] *= -1;

        // Subtle mouse influence
        positions[i3] += (mouse.x * 0.5 - positions[i3] * 0.01) * 0.01;
        positions[i3 + 1] += (mouse.y * 0.5 - positions[i3 + 1] * 0.01) * 0.01;
    }

    // Connect particles
    for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
            const dx = positions[i * 3] - positions[j * 3];
            const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
            const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (dist < connectionDistance) {
                linePositions.push(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
                linePositions.push(positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]);
                
                // Fade out based on distance
                const alpha = 1 - dist / connectionDistance;
                lineColors.push(0.02, 0.71, 0.83, alpha * 0.3); // Cyan
                lineColors.push(0.02, 0.71, 0.83, alpha * 0.3);
            }
        }
    }

    // Update points
    if (pointsRef.current) {
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Update lines
    if (linesRef.current) {
        linesRef.current.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        linesRef.current.geometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 4));
    }

    // System rotation
    if (pointsRef.current) {
        pointsRef.current.rotation.y += 0.001;
        pointsRef.current.rotation.x += 0.0005;
    }
  });

  return (
    <group>
      {/* Particles */}
      <Points ref={pointsRef} positions={particles.positions} stride={3}>
        <PointMaterial
          transparent
          color="#06b6d4"
          size={0.08}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>

      {/* Connections (Lines) */}
      <lineSegments ref={linesRef}>
          <bufferGeometry />
          <lineBasicMaterial transparent vertexColors={true} blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>
      
      <fog attach="fog" args={['#020617', 5, 20]} />
    </group>
  );
};

export default DigitalNetwork;
