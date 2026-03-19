import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Float, 
  PerspectiveCamera, 
  OrbitControls, 
  Text, 
  MeshDistortMaterial, 
  Sphere, 
  MeshWobbleMaterial, 
  Cylinder,
  Box,
  Stars,
  Html,
  Line,
  Icosahedron,
  Octahedron
} from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Database, Brain, Zap, ArrowRight, Activity, Cpu, ShieldCheck } from 'lucide-react';

// --- STAGE 1: Machine Monitoring (Industrial Gear) ---
const MachineModel = ({ isHovered }) => {
  const meshRef = useRef();
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      if (isHovered) {
        meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 4) * 0.1;
      }
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[0.5, 0.15, 256, 32, 2, 3]} />
        <meshPhysicalMaterial 
          color="#3B82F6" 
          metalness={0.9}
          roughness={0.1}
          emissive="#3B82F6"
          emissiveIntensity={isHovered ? 2 : 0.5}
        />
      </mesh>
      {/* Outer Wireframe Ring */}
      <mesh rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[0.8, 0.01, 16, 100]} />
        <meshBasicMaterial color="#3B82F6" wireframe />
      </mesh>
      {isHovered && (
        <Html distanceFactor={10} position={[1.2, 1.2, 0]}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0A1118]/90 backdrop-blur-md p-4 rounded-2xl border border-blue-500/30 whitespace-nowrap pointer-events-none"
          >
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="text-blue-400 w-4 h-4" />
              <span className="text-white font-bold text-xs uppercase tracking-widest">Live Telemetry</span>
            </div>
            <div className="space-y-1 text-[10px] font-bold">
              <p className="text-gray-400 flex justify-between space-x-4"><span>Temp:</span> <span className="text-white">42.4°C</span></p>
              <p className="text-gray-400 flex justify-between space-x-4"><span>Vibr:</span> <span className="text-white">0.32mm/s</span></p>
              <p className="text-gray-400 flex justify-between space-x-4"><span>Power:</span> <span className="text-white">12.8kW</span></p>
            </div>
          </motion.div>
        </Html>
      )}
    </group>
  );
};

// --- STAGE 2: Data Collection (Crystalline Database) ---
const DatabaseModel = ({ isHovered }) => {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
      if (isHovered) {
        groupRef.current.scale.setScalar(1.1 + Math.sin(state.clock.elapsedTime * 2) * 0.02);
      } else {
        groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <cylinderGeometry args={[0.4, 0.6, 1.2, 6]} />
        <meshPhysicalMaterial 
          color="#0D9488" 
          metalness={1} 
          roughness={0} 
          transmission={0.5}
          thickness={1}
          emissive="#0D9488" 
          emissiveIntensity={0.4} 
        />
      </mesh>
      {/* Internal Core */}
      <mesh>
        <cylinderGeometry args={[0.1, 0.1, 1.3, 32]} />
        <meshBasicMaterial color="#5EEAD4" />
      </mesh>
      {/* Floating Shards */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={i} position={[Math.cos(i) * 0.8, Math.sin(i * 2) * 0.5, Math.sin(i) * 0.8]}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshBasicMaterial color="#5EEAD4" />
        </mesh>
      ))}
      {isHovered && (
        <Html distanceFactor={10} position={[1.2, 1.2, 0]}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0A1118]/90 backdrop-blur-md p-4 rounded-2xl border border-teal-500/30 whitespace-nowrap pointer-events-none"
          >
            <div className="flex items-center space-x-2 mb-2">
              <Database className="text-teal-400 w-4 h-4" />
              <span className="text-white font-bold text-xs uppercase tracking-widest">Cloud Storage</span>
            </div>
            <div className="space-y-1 text-[10px] font-bold">
              <p className="text-gray-400 flex justify-between space-x-4"><span>Packets:</span> <span className="text-white font-black">SYNCED</span></p>
              <p className="text-gray-400 flex justify-between space-x-4"><span>Throughput:</span> <span className="text-white">1.2 GB/s</span></p>
            </div>
          </motion.div>
        </Html>
      )}
    </group>
  );
};

// --- STAGE 3: AI Failure Prediction (Neural Cluster) ---
const AIModel = ({ isHovered }) => {
  const meshRef = useRef();
  const wireRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.elapsedTime * 0.5;
      meshRef.current.rotation.z = state.elapsedTime * 0.3;
      meshRef.current.scale.setScalar(1 + Math.sin(state.elapsedTime * 3) * 0.05);
    }
    if (wireRef.current) {
      wireRef.current.rotation.y -= 0.01;
    }
  });

  return (
    <group>
      <Icosahedron ref={meshRef} args={[0.7, 1]}>
        <meshPhysicalMaterial 
          color="#8B5CF6" 
          metalness={1}
          roughness={0}
          emissive="#8B5CF6"
          emissiveIntensity={isHovered ? 3 : 1}
        />
      </Icosahedron>
      {/* Floating Wireframe */}
      <Sphere ref={wireRef} args={[1, 16, 16]}>
        <meshBasicMaterial color="#A78BFA" wireframe transparent opacity={0.2} />
      </Sphere>
      {isHovered && (
        <Html distanceFactor={10} position={[1.2, 1.2, 0]}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0A1118]/90 backdrop-blur-md p-4 rounded-2xl border border-purple-500/30 whitespace-nowrap pointer-events-none"
          >
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="text-purple-400 w-4 h-4" />
              <span className="text-white font-bold text-xs uppercase tracking-widest">AI Prediction</span>
            </div>
            <div className="space-y-1 text-[10px] font-bold">
              <p className="text-gray-400 flex justify-between space-x-4"><span>Risk Score:</span> <span className="text-teal-400 font-bold">SAFE</span></p>
              <p className="text-gray-400 flex justify-between space-x-4"><span>Neural Load:</span> <span className="text-white">14%</span></p>
            </div>
          </motion.div>
        </Html>
      )}
    </group>
  );
};

// --- STAGE 4: Smart Maintenance (Control Interface) ---
const MaintenanceModel = ({ isHovered }) => {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      groupRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <octahedronGeometry args={[0.7, 0]} />
        <meshPhysicalMaterial 
          color="#F59E0B" 
          metalness={1} 
          roughness={0.1}
          emissive="#F59E0B"
          emissiveIntensity={isHovered ? 2 : 0.5}
        />
      </mesh>
      {/* Orbital Bits */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[Math.cos(i * 2) * 1, Math.sin(i * 2) * 1, 0]}>
          <boxGeometry args={[0.1, 0.4, 0.1]} />
          <meshBasicMaterial color="#FBBF24" />
        </mesh>
      ))}
      {isHovered && (
        <Html distanceFactor={10} position={[1.2, 1.2, 0]}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0A1118]/90 backdrop-blur-md p-4 rounded-2xl border border-orange-500/30 whitespace-nowrap pointer-events-none"
          >
             <div className="flex items-center space-x-2 mb-2 text-orange-400">
                <Zap size={14} fill="currentColor" />
                <span className="text-white font-bold text-[10px] uppercase tracking-widest">Active Insight</span>
             </div>
             <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl mb-2">
                <p className="text-[9px] font-black text-red-500 uppercase tracking-tighter">AI Action Recommended</p>
                <p className="text-[11px] font-bold text-white mt-1">Lubricate Unit B-12</p>
             </div>
             <p className="text-[10px] text-gray-400 font-bold">Schedule: <span className="text-white">AUTO-LOGGED</span></p>
          </motion.div>
        </Html>
      )}
    </group>
  );
};

// --- DATA PACKETS ---
const DataPacket = ({ start, end, speed = 0.5 }) => {
  const meshRef = useRef();
  const [progress, setProgress] = useState(Math.random());

  useFrame((state, delta) => {
    setProgress((prev) => (prev + delta * speed) % 1);
    if (meshRef.current) {
      meshRef.current.position.lerpVectors(new THREE.Vector3(...start), new THREE.Vector3(...end), progress);
    }
  });

  return (
    <Sphere ref={meshRef} args={[0.04, 8, 8]}>
      <meshBasicMaterial color="#3B82F6" transparent opacity={0.6} />
    </Sphere>
  );
};

const WorkflowStage = ({ position, title, subtitle, children, onHover }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <group 
      position={position}
      onPointerOver={() => { setHovered(true); onHover(true); }}
      onPointerOut={() => { setHovered(false); onHover(false); }}
    >
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        {React.cloneElement(children, { isHovered: hovered })}
      </Float>
      
      <Html position={[0, -1.8, 0]} center>
        <div className={`text-center transition-all duration-500 ${hovered ? 'scale-110' : 'scale-100'}`}>
          <h3 className={`text-sm font-black uppercase tracking-widest mb-1 ${hovered ? 'text-blue-400' : 'text-gray-400'}`}>
            {title}
          </h3>
          <p className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter w-24">
            {subtitle}
          </p>
        </div>
      </Html>
    </group>
  );
};

const ConnectingLines = () => {
  const points = useMemo(() => {
    return [
      [-6, 0, 0], [-2, 0, 0], [2, 0, 0], [6, 0, 0]
    ];
  }, []);

  return (
    <group>
      {/* Visual Lines */}
      <Line points={[[-6, 0, 0], [-2, 0, 0]]} color="#3B82F6" lineWidth={1} transparent opacity={0.2} />
      <Line points={[[-2, 0, 0], [2, 0, 0]]} color="#10B981" lineWidth={1} transparent opacity={0.2} />
      <Line points={[[2, 0, 0], [6, 0, 0]]} color="#8B5CF6" lineWidth={1} transparent opacity={0.2} />

      {/* Animated Packets */}
      <DataPacket start={[-6, 0, 0]} end={[-2, 0, 0]} speed={0.4} />
      <DataPacket start={[-6, 0, 0]} end={[-2, 0, 0]} speed={0.3} />
      <DataPacket start={[-2, 0, 0]} end={[2, 0, 0]} speed={0.5} />
      <DataPacket start={[2, 0, 0]} end={[6, 0, 0]} speed={0.6} />
    </group>
  );
};

const ThreeWorkflow = () => {
  const [hoverInfo, setHoverInfo] = useState("");

  return (
    <section className="h-[700px] w-full bg-[#020617] relative overflow-hidden group/canvas">
      {/* Text Overlay */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10 text-center w-full pointer-events-none">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight"
        >
          How GearGuide <span className="text-blue-500">Protects Your Machines</span>
        </motion.h2>
        <p className="text-gray-400 font-medium">From machine data to AI-powered maintenance decisions in seconds.</p>
      </div>

      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={45} />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          rotateSpeed={0.5}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 1.8}
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
        />
        
        {/* Lights */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#3B82F6" />
        <pointLight position={[-10, 5, 5]} intensity={1} color="#10B981" />
        <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={2} decay={2} color="#ffffff" />
        
        {/* Scene Environment */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <fog attach="fog" args={['#020617', 5, 20]} />
        
        {/* Grid Floor */}
        <gridHelper args={[40, 40, '#1E293B', '#111827']} position={[0, -4, 0]} rotation={[0, 0, 0]} />

        <ConnectingLines />

        <WorkflowStage position={[-6, 0, 0]} title="Monitoring" subtitle="Live Data Feed" onHover={() => {}}>
          <MachineModel />
        </WorkflowStage>

        <WorkflowStage position={[-2, 0, 0]} title="Collection" subtitle="Secure Storage" onHover={() => {}}>
          <DatabaseModel />
        </WorkflowStage>

        <WorkflowStage position={[2, 0, 0]} title="Prediction" subtitle="AI Logic Engine" onHover={() => {}}>
          <AIModel />
        </WorkflowStage>

        <WorkflowStage position={[6, 0, 0]} title="Action" subtitle="Smart Dispatch" onHover={() => {}}>
          <MaintenanceModel />
        </WorkflowStage>

      </Canvas>

      {/* Mobile Fallback Overlay (Hidden on Desktop) */}
      <div className="md:hidden absolute inset-0 bg-[#020617] flex items-center justify-center p-8 z-50 text-center">
         <div>
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500 border border-blue-500/20">
               <Cpu animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} />
            </div>
            <h3 className="text-2xl font-black text-white mb-4">Interactive 3D Pipeline</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
               For the best experience, view this interactive 3D workflow on a desktop device.
            </p>
            <div className="flex flex-col space-y-3">
               <div className="bg-[#0F172A] p-4 rounded-xl border border-white/5 flex items-center">
                  <Activity className="text-blue-400 mr-3" size={18} />
                  <span className="text-white font-bold text-xs uppercase tracking-widest">Live Monitoring</span>
               </div>
               <div className="bg-[#0F172A] p-4 rounded-xl border border-white/5 flex items-center">
                  <ShieldCheck className="text-teal-400 mr-3" size={18} />
                  <span className="text-white font-bold text-xs uppercase tracking-widest">AI Prediction</span>
               </div>
            </div>
         </div>
      </div>
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#F8FAFC] to-transparent pointer-events-none opacity-100 z-10"></div>
    </section>
  );
};

export default ThreeWorkflow;
