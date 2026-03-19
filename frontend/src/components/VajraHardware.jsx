import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Sphere, Cylinder, Text, Float, QuadraticBezierLine, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

const DataParticle = ({ start, end, delay }) => {
    const ref = useRef();
    const curve = useMemo(() => {
        const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
        mid.y += 2;
        return new THREE.QuadraticBezierCurve3(start, end, mid);
    }, [start, end]);

    useFrame((state) => {
        const t = (state.elapsedTime * 0.5 + delay) % 1;
        const pos = curve.getPoint(t);
        ref.current.position.set(pos.x, pos.y, pos.z);
        ref.current.scale.setScalar(Math.sin(t * Math.PI) * 0.2);
    });

    return (
        <Sphere ref={ref} args={[0.2, 8, 8]}>
            <meshBasicMaterial color="#06b6d4" transparent opacity={0.6} />
        </Sphere>
    );
};

const VajraHardware = ({ data }) => {
    const motorRef = useRef();
    const temp = parseFloat(data?.field1 || 0);
    const gas = parseFloat(data?.field3 || 0);
    const vibration = parseFloat(data?.field4 || 0);
    
    const isOverheated = temp > 35;
    const isGasAlert = gas > 400;
    const isVibrating = vibration > 0;

    useFrame((state, delta) => {
        if (motorRef.current && !isOverheated) {
            motorRef.current.rotation.y -= delta * 20;
        }
        if (isVibrating && motorRef.current) {
            motorRef.current.position.x = Math.sin(state.elapsedTime * 50) * 0.02;
        }
    });

    return (
        <group rotation={[0, 0, 0]}>
            {/* --- ULTIMATE GLOSSY PCB --- */}
            <Box args={[12, 0.2, 17]} position={[0, -0.1, 0]}>
                <meshPhysicalMaterial 
                    color="#022c22" 
                    roughness={0.05} 
                    metalness={0.8} 
                    clearcoat={1} 
                    clearcoatRoughness={0.1}
                    reflectivity={1}
                />
            </Box>
            
            {/* Mounting Holes (Metal Rings) */}
            {[[-5.5, 8], [5.5, 8], [-5.5, -8], [5.5, -8]].map((pos, i) => (
                <Cylinder key={i} args={[0.22, 0.22, 0.25, 16]} position={[pos[0], -0.05, pos[1]]}>
                    <meshPhysicalMaterial color="#94a3b8" metalness={1} roughness={0.1} />
                </Cylinder>
            ))}

            {/* PCB Traces - High Density */}
            {[...Array(60)].map((_, i) => (
                <Box key={i} args={[0.02, 0.01, 16.5]} position={[-5.8 + i * 0.2, 0.01, 0]}>
                    <meshPhysicalMaterial color="#fbbf24" metalness={1} roughness={0} emissive="#fbbf24" emissiveIntensity={0.1} />
                </Box>
            ))}

            {/* --- SENSOR & COMPONENT NODES --- */}
            
            {/* NodeMCU - The Heart */}
            <group position={[-3.5, 0.3, -5]}>
                <Box args={[3.2, 0.4, 5.2]}>
                    <meshPhysicalMaterial color="#1e293b" metalness={0.9} roughness={0.1} clearcoat={1} />
                </Box>
                <Box args={[1, 0.3, 0.5]} position={[0, 0, -2.8]}>
                    <meshPhysicalMaterial color="#64748b" metalness={1} />
                </Box>
                <Text position={[0, 0.3, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.35} color="white" fontWeight="black">CORE_ESP</Text>
            </group>

            {/* Terminal Blocks for External Connections */}
            <group position={[4.5, 0.3, 1]}>
                <Box args={[1.5, 0.8, 2.5]}>
                    <meshPhysicalMaterial color="#312e81" roughness={0.2} />
                </Box>
                {[[-0.4, -0.6], [0.4, -0.6], [-0.4, 0.6], [0.4, 0.6]].map((pos, i) => (
                    <Cylinder key={i} args={[0.15, 0.15, 0.1, 12]} position={[pos[0], 0.4, pos[1]]}>
                        <meshPhysicalMaterial color="#94a3b8" metalness={1} />
                    </Cylinder>
                ))}
                <Text position={[0, 0.9, 0]} fontSize={0.2} color="white" fontWeight="bold">EXT_IO</Text>
            </group>

            {/* Power Core */}
            <group position={[4, 1.2, -6]}>
                <Box args={[2.2, 2.5, 1.4]} castShadow>
                    <meshPhysicalMaterial color="#0f172a" roughness={0.15} metalness={0.4} />
                </Box>
                <Cylinder args={[0.3, 0.3, 0.5]} position={[-0.5, 1.3, 0]}>
                    <meshPhysicalMaterial color="#94a3b8" metalness={1} />
                </Cylinder>
                <Cylinder args={[0.3, 0.3, 0.5]} position={[0.5, 1.3, 0]}>
                    <meshPhysicalMaterial color="#94a3b8" metalness={1} />
                </Cylinder>
                <Text position={[0, 0, 0.8]} fontSize={0.4} color="#06b6d4" fontWeight="black" rotation={[0, 0, Math.PI / 2]}>9V POWER</Text>
            </group>

            {/* Fan & Motor Assembly */}
            <group position={[0, 1.8, 3]}>
                <Cylinder args={[0.7, 0.7, 1.8, 32]} rotation={[Math.PI / 2, 0, 0]}>
                    <meshPhysicalMaterial color="#334155" metalness={1} roughness={0.1} />
                </Cylinder>
                <group ref={motorRef} position={[0, 0, 1.1]}>
                    {[0, Math.PI * 0.66, Math.PI * 1.33].map((angle, i) => (
                        <group key={i} rotation={[0, 0, angle]}>
                            <Box args={[2.8, 0.7, 0.05]} position={[1.2, 0, 0]}>
                                <meshPhysicalMaterial color={isOverheated ? "#1e293b" : "#06b6d4"} transparent opacity={0.8} roughness={0} metalness={0.5} />
                            </Box>
                        </group>
                    ))}
                </group>
                <Text position={[0, 2.2, 0]} fontSize={0.35} color="white" fontWeight="black">COOLING_CORE</Text>
            </group>

            {/* Gas Sensor MQ-2 */}
            <group position={[-4.5, 0.8, 5]}>
                <Cylinder args={[0.8, 0.8, 1.4, 32]}>
                    <meshPhysicalMaterial color="#94a3b8" metalness={1} wireframe={true} />
                </Cylinder>
                <Cylinder args={[0.7, 0.7, 0.2]} position={[0, -0.6, 0]}>
                    <meshPhysicalMaterial color="#475569" />
                </Cylinder>
                {isGasAlert && (
                    <pointLight color="#f43f5e" intensity={2} distance={3} />
                )}
                <Text position={[0, 1, 0]} fontSize={0.25} color="white" fontWeight="black">MQ-2_GAS</Text>
            </group>

            {/* DHT11 Temp/Hum */}
            <group position={[4.5, 0.8, 4]}>
                <Box args={[1.5, 1.8, 0.8]}>
                    <meshPhysicalMaterial color="#2563eb" roughness={0.1} />
                </Box>
                {[...Array(6)].map((_, i) => (
                    <Box key={i} args={[1.6, 0.1, 0.1]} position={[0, -0.6 + i * 0.25, 0.41]}>
                        <meshPhysicalMaterial color="#1e3a8a" />
                    </Box>
                ))}
                <Text position={[0, 1.2, 0]} fontSize={0.25} color="white" fontWeight="black">DHT11_CORE</Text>
            </group>

            {/* --- DATA FLOW VISUALIZATION --- */}
            {/* Particle Stream from Sensors to Center Hub */}
            <DataParticle start={new THREE.Vector3(-4.5, 1, 5)} end={new THREE.Vector3(-3.5, 0.3, -5)} delay={0} />
            <DataParticle start={new THREE.Vector3(4.5, 1, 4)} end={new THREE.Vector3(-3.5, 0.3, -5)} delay={0.3} />
            <DataParticle start={new THREE.Vector3(0, 1.5, 3)} end={new THREE.Vector3(-3.5, 0.3, -5)} delay={0.6} />

            {/* WiFi Signal Arc to "Agent" */}
            <group position={[-3.5, 2.5, -5]}>
                {[0, 1, 2].map((i) => (
                    <group key={i} position={[0, i * 0.4, 0]}>
                        <Box args={[0.1, 0.05, 0.5]}>
                            <meshBasicMaterial color="#06b6d4" transparent opacity={0.6} />
                        </Box>
                    </group>
                ))}
                <Text position={[0, 1.5, 0]} fontSize={0.3} color="#06b6d4" fontWeight="black">TX_WIFI</Text>
            </group>

            {/* Professional Wiring - Cyan Neon */}
            <QuadraticBezierLine start={[-3.5, 0.8, -4]} end={[4, 1.5, -5.5]} mid={[0, 4, -5]} color="#06b6d4" lineWidth={1.5} opacity={0.6} transparent />
            <QuadraticBezierLine start={[0, 1.8, 2]} end={[-3.5, 0.4, -3]} mid={[-1, 3, 0]} color="#06b6d4" lineWidth={1.5} opacity={0.6} transparent />

            {/* Status LEDs */}
            <group position={[5.5, 0.2, -3]}>
                {[
                    { color: "#f43f5e", active: isOverheated || isGasAlert, label: "CRIT" },
                    { color: "#eab308", active: isVibrating, label: "WARN" },
                    { color: "#10b981", active: !isOverheated && !isGasAlert, label: "NOMINAL" }
                ].map((led, i) => (
                    <group key={i} position={[0, 0, i * 1.2]}>
                        <Sphere args={[0.18, 16, 16]}>
                            <meshPhysicalMaterial 
                                emissive={led.color} 
                                emissiveIntensity={led.active ? 4 : 0.1} 
                                color={led.active ? led.color : "#1e293b"} 
                                roughness={0}
                            />
                        </Sphere>
                        {led.active && <pointLight color={led.color} intensity={1.5} distance={1.5} />}
                        <Text position={[0.8, 0, 0]} rotation={[-Math.PI / 2, 0, -Math.PI/2]} fontSize={0.18} color="#64748b" fontWeight="black">{led.label}</Text>
                    </group>
                ))}
            </group>

            <ContactShadows position={[0, -0.2, 0]} opacity={0.8} scale={30} blur={4} color="#000000" />
        </group>
    );
};

export default VajraHardware;

