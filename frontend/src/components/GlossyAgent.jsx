import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

const GlossyAgent = ({ isProcessing, color = '#3b82f6' }) => {
    const meshRef = useRef();
    const shellRef = useRef();
    const timeRef = useRef(0);

    // Mixing original color with a dark pinkish hue
    // Blue (#3b82f6) mixed with Deep Pink (#ff007f) results in a vibrant Purple/Magenta (#9d174d or similar)
    const mixColor = '#7a34cd'; // A deep, glossy purple-blue-pink mix

    useFrame((state, delta) => {
        timeRef.current += delta;
        const t = timeRef.current;

        if (meshRef.current) {
            meshRef.current.rotation.x = t * 0.2;
            meshRef.current.rotation.y = t * 0.3;
        }
        if (shellRef.current) {
            shellRef.current.rotation.x = -t * 0.1;
            shellRef.current.rotation.z = t * 0.2;
        }
    });

    return (
        <group>
            <Float
                speed={isProcessing ? 3 : 1}
                rotationIntensity={isProcessing ? 1.5 : 0.4}
                floatIntensity={isProcessing ? 1 : 0.5}
            >
                {/* --- LAYER 1: NEURAL CORE (Animated "Thinking" Core) --- */}
                <Sphere ref={meshRef} args={[2.4, 64, 64]} scale={isProcessing ? 1.05 : 1}>
                    <MeshDistortMaterial
                        color={mixColor}
                        emissive={color}
                        emissiveIntensity={isProcessing ? 1.5 : 0.5}
                        distort={isProcessing ? 0.6 : 0.4}
                        speed={isProcessing ? 4 : 2}
                        roughness={0}
                        metalness={1}
                        clearcoat={1}
                    />
                </Sphere>

                {/* --- LAYER 2: IONIC SHIELD (Subtle Pinkish Aura) --- */}
                <Sphere args={[2.55, 48, 48]} scale={isProcessing ? 1.1 : 1.02}>
                    <meshStandardMaterial
                        color="#ff007f"
                        transparent
                        opacity={isProcessing ? 0.4 : 0.1}
                        roughness={0}
                        metalness={1}
                        emissive="#ff007f"
                        emissiveIntensity={0.5}
                    />
                </Sphere>

                {/* --- LAYER 3: KINETIC WIREFRAME (Geometric Structure) --- */}
                <Sphere args={[2.7, 32, 32]} scale={isProcessing ? 1.15 : 1.08}>
                    <meshBasicMaterial
                        color={mixColor}
                        wireframe
                        transparent
                        opacity={isProcessing ? 0.5 : 0.2}
                        blending={THREE.AdditiveBlending}
                    />
                </Sphere>
            </Float>

            {/* --- INDUSTRIAL LIGHTING CONFIG (Enhanced for Gloss) --- */}
            <ContactShadows position={[0, -3.8, 0]} opacity={0.6} scale={20} blur={3} far={4.5} />
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
            <pointLight
                position={[-10, -10, -10]}
                intensity={isProcessing ? 3 : 1.5}
                color="#ff007f"
            />
        </group>
    );
};

export default GlossyAgent;
