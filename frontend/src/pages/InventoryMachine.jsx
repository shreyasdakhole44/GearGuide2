import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Cpu, Activity, Database, ShieldAlert, 
  Brain, Zap, ArrowRight, X, LayoutGrid, List,
  Thermometer, Gauge, Clock, Calendar, CheckCircle,
  AlertTriangle, Filter, MoreVertical, Settings
} from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, Sphere, MeshDistortMaterial, ContactShadows, Environment, Html } from '@react-three/drei';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

// --- STYLED COMPONENTS ---

const GlassCard = ({ children, className = "" }) => (
  <div className={`bg-white/70 backdrop-blur-md border border-white/40 rounded-3xl shadow-xl ${className}`}>
    {children}
  </div>
);

const DarkCard = ({ children, className = "" }) => (
  <div className={`bg-[#020617] text-white rounded-3xl shadow-2xl border border-white/10 ${className}`}>
    {children}
  </div>
);

const MetricBadge = ({ label, value, colorClass }) => (
  <div className="flex flex-col">
    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</span>
    <span className={`text-2xl font-black ${colorClass} tracking-tighter`}>{value}</span>
  </div>
);

// --- 3D COMPONENTS ---

const WireframeSphere = () => {
  const mesh = useRef();
  useFrame((state) => {
    // Using performance.now() or state.clock.elapsedTime might be safer, 
    // but state.clock.getElapsedTime() is what triggers the warning in newer Three.js versions.
    // However, R3F provides state.elapsedTime in newer versions.
    const t = state.clock.elapsedTime || performance.now() / 1000;
    mesh.current.rotation.x = t * 0.1;
    mesh.current.rotation.y = t * 0.15;
  });

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color="#3B82F6" wireframe opacity={0.1} transparent />
    </mesh>
  );
};

const MachineNode = ({ position, health, name, onSelect, isSelected }) => {
  const color = health > 80 ? "#10B981" : health > 40 ? "#F59E0B" : "#E11D48";
  
  return (
    <group position={position} onClick={onSelect}>
      <mesh castShadow position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
        <meshPhysicalMaterial 
          color={color} 
          roughness={0.2} 
          metalness={0.9}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      
      {isSelected && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.7, 0.8, 32]} />
          <meshBasicMaterial color="#3B82F6" transparent opacity={0.5} />
        </mesh>
      )}

      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={5} toneMapped={false} />
        </mesh>
      </Float>
    </group>
  );
};

// --- DATA MOCKS ---

const MOCK_MACHINES = [
  { id: 1, name: 'CNC-MASTER-01', type: 'CNC Lathe', health: 92, temp: 42, vibe: 0.2, serial: 'SN-9922-A', pos: [-5, 0, -2] },
  { id: 2, name: 'ROBO-ARM-X2', type: 'Robotic Arm', health: 38, temp: 78, vibe: 1.4, serial: 'SN-4410-B', pos: [0, 0, 2] },
  { id: 3, name: 'PRESS-UNIT-04', type: 'Hydraulic Press', health: 65, temp: 55, vibe: 0.8, serial: 'SN-1120-C', pos: [5, 0, -3] },
  { id: 4, name: 'MILL-PRO-07', type: 'Milling center', health: 88, temp: 45, vibe: 0.3, serial: 'SN-8833-D', pos: [-3, 0, 5] },
];

const TELEMETRY_DATA = [
  { time: '00:00', temp: 40, vibe: 0.2 },
  { time: '04:00', temp: 45, vibe: 0.4 },
  { time: '08:00', temp: 60, vibe: 0.9 },
  { time: '12:00', temp: 78, vibe: 1.4 },
  { time: '16:00', temp: 65, vibe: 1.1 },
  { time: '20:00', temp: 45, vibe: 0.5 },
];

const InventoryMachine = () => {
  const [selectedMachine, setSelectedMachine] = useState(MOCK_MACHINES[0]);
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [syncTime, setSyncTime] = useState(0);
  const [newMachine, setNewMachine] = useState({ 
    name: '', 
    type: 'CNC Center', 
    serial: '', 
    purchaseDate: new Date().toISOString().split('T')[0], 
    warrantyEnd: '' 
  });

  // Simulated live sync timer
  useEffect(() => {
    const timer = setInterval(() => setSyncTime(prev => (prev + 1) % 60), 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredMachines = MOCK_MACHINES.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.serial.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Onboarding Logic: Auto-fill
  useEffect(() => {
    if (newMachine.name.toLowerCase().includes('cnc')) {
      setNewMachine(prev => ({ ...prev, type: 'CNC Center', serial: prev.serial || 'SN-CNC-NEW' }));
    } else if (newMachine.name.toLowerCase().includes('robot')) {
      setNewMachine(prev => ({ ...prev, type: 'Robotic Arm', serial: prev.serial || 'SN-ROBO-NEW' }));
    }
  }, [newMachine.name]);

  // Warranty Logic: Purchase Date + 1 Year
  useEffect(() => {
    if (newMachine.purchaseDate) {
      const date = new Date(newMachine.purchaseDate);
      date.setFullYear(date.getFullYear() + 1);
      setNewMachine(prev => ({ ...prev, warrantyEnd: date.toISOString().split('T')[0] }));
    }
  }, [newMachine.purchaseDate]);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    // Simulate backend POST
    const nextId = MOCK_MACHINES.length + 1;
    const pos = [Math.random() * 10 - 5, 0, Math.random() * 10 - 5];
    // In a real app we would update the list state here
    setIsAdding(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-gray-900 font-inter pb-20">
      
      {/* 1. GLOBAL STATUS BAR */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#020617]/80 backdrop-blur-lg border-b border-white/5 px-6 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Cloud Core Online</span>
          </div>
          <div className="h-3 w-px bg-white/10" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sync: {syncTime}s ago</span>
        </div>
        <div className="flex items-center space-x-6">
          <span className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center">
            <Activity size={12} className="mr-2 text-blue-400" /> 24 Assets Tracked
          </span>
        </div>
      </div>

      {/* 2. KINETIC HEADER SECTION */}
      <section className="relative pt-16 pb-24 bg-[#020617] overflow-hidden min-h-[400px] flex items-center justify-center">
        {/* Background 3D */}
        <div className="absolute inset-0 z-0">
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <Suspense fallback={<Html center className="text-white text-xs font-bold uppercase tracking-widest">Loading Analytics...</Html>}>
              <Float speed={1.5} rotationIntensity={1} floatIntensity={1}>
                <WireframeSphere />
              </Float>
              <Environment preset="night" />
              <ContactShadows opacity={0.4} scale={10} blur={2.4} far={10} />
            </Suspense>
          </Canvas>
        </div>

        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4 leading-none">
              Machine <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-300">Inventory</span>
            </h1>
            <p className="text-gray-400 max-w-xl mx-auto font-medium text-lg leading-relaxed">
              Real-time digital twin architecture for enterprise asset management and predictive structural analysis.
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <button className="px-8 py-3 bg-orange-500 text-white font-black rounded-xl hover:bg-orange-400 shadow-[0_10px_30px_rgba(249,115,22,0.4)] transition-all flex items-center group">
                <Brain size={18} className="mr-2" /> Advanced Visualizer
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. METRIC KPI ROW */}
      <div className="max-w-[1600px] mx-auto -mt-12 px-6 relative z-30">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <GlassCard className="p-6 border-b-4 border-b-blue-500">
            <MetricBadge label="Total Units" value="128" colorClass="text-[#020617]" />
            <p className="text-[10px] font-bold text-blue-600 mt-2">Active Infrastructure</p>
          </GlassCard>
          <GlassCard className="p-6 border-b-4 border-b-emerald-500">
            <MetricBadge label="Healthy Units" value="112" colorClass="text-emerald-500" />
            <p className="text-[10px] font-bold text-gray-400 mt-2">Nominal Operation</p>
          </GlassCard>
          <GlassCard className="p-6 border-b-4 border-b-amber-500">
            <MetricBadge label="Warning Phase" value="12" colorClass="text-amber-500" />
            <p className="text-[10px] font-bold text-gray-400 mt-2">Maintenance Required</p>
          </GlassCard>
          <GlassCard className="p-6 border-b-4 border-b-rose-600">
            <MetricBadge label="Critical Assets" value="4" colorClass="text-rose-600" />
            <p className="text-[10px] font-bold text-rose-500 mt-2 underline cursor-pointer">Immediate Action</p>
          </GlassCard>
        </div>
      </div>

      {/* 4. INTERACTIVE COMMAND LAYER + 3D FLOOR */}
      <div className="max-w-[1600px] mx-auto mt-12 px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Onboarding Card */}
        <div className="lg:col-span-4 lg:h-[600px] flex flex-col space-y-6">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-8 text-white shadow-2xl flex-1 flex flex-col justify-between">
            <div>
              <Plus size={48} className="mb-6 opacity-40" />
              <h2 className="text-3xl font-black tracking-tighter mb-4">Onboard New Asset</h2>
              <p className="text-orange-50/80 font-medium leading-relaxed">
                Expand your digital infrastructure by adding new mechanical nodes to the ensemble cluster.
              </p>
            </div>
            <button 
              onClick={() => setIsAdding(true)}
              className="mt-8 w-full py-4 bg-white text-orange-600 font-bold rounded-2xl shadow-lg hover:bg-orange-50 transition-colors flex justify-center items-center"
            >
              Initialize Node Setup
            </button>
          </div>

          <GlassCard className="p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <ShieldAlert size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-gray-900 leading-none mb-1">Security Shield</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Encrypted Local Tunnel</span>
              </div>
            </div>
            <div className="text-emerald-500 font-black text-xs">ACTIVE</div>
          </GlassCard>
        </div>

        {/* Digital Twin Floor */}
        <div className="lg:col-span-8 bg-[#020617] rounded-[3rem] h-[600px] relative overflow-hidden shadow-2xl">
          <div className="absolute top-8 left-8 z-10">
            <h3 className="text-white font-black text-xl tracking-tighter">Digital Twin Floor</h3>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Real-time Node Visualization</p>
          </div>
          
          <div className="absolute bottom-8 right-8 z-10 flex flex-col space-y-2">
            <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Healthy</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Warning</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Critical</span>
            </div>
          </div>

          <Canvas shadows>
            <Suspense fallback={<Html center className="text-blue-400 text-xs font-black uppercase tracking-widest">Initializing Digital Twin...</Html>}>
              <PerspectiveCamera makeDefault position={[10, 10, 10]} fov={50} />
              <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} />
              
              <ambientLight intensity={0.4} />
              <pointLight position={[10, 10, 10]} intensity={2} castShadow />
              <spotLight position={[-10, 20, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
              
              <gridHelper args={[20, 20, "#1E293B", "#0F172A"]} position={[0, 0, 0]} />
              
              {MOCK_MACHINES.map((m) => (
                <MachineNode 
                  key={m.id}
                  position={m.pos}
                  health={m.health}
                  name={m.name}
                  isSelected={selectedMachine?.id === m.id}
                  onSelect={() => setSelectedMachine(m)}
                />
              ))}
              <Environment preset="night" />
              <ContactShadows opacity={0.4} scale={10} blur={2.4} far={10} />
            </Suspense>
          </Canvas>
        </div>
      </div>

      {/* 5. TACTICAL MACHINE GRID */}
      <div className="max-w-[1600px] mx-auto mt-20 px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 space-y-6 md:space-y-0">
          <div>
            <h2 className="text-4xl font-black tracking-tighter mb-2">Machine Inventory</h2>
            <p className="text-gray-400 font-medium">Manage and monitor all assets in your industrial cluster.</p>
          </div>
          
          <div className="flex space-x-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by ID, Serial, or Model..."
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-medium text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm text-gray-600 hover:text-orange-500 transition-colors">
              <Filter size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {filteredMachines.map((m) => (
            <motion.div
              layout
              key={m.id}
              onClick={() => setSelectedMachine(m)}
              className="group cursor-pointer"
            >
              <GlassCard className="p-6 transition-all hover:bg-white hover:shadow-2xl hover:border-orange-500/30">
                <div className="flex justify-between items-start mb-6">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle cx="32" cy="32" r="28" stroke="#E2E8F0" strokeWidth="4" fill="transparent" />
                      <circle 
                        cx="32" cy="32" r="28" 
                        stroke={m.health > 80 ? "#10B981" : m.health > 40 ? "#F59E0B" : "#E11D48"} 
                        strokeWidth="4" fill="transparent"
                        strokeDasharray={2 * Math.PI * 28}
                        strokeDashoffset={2 * Math.PI * 28 * (1 - m.health / 100)}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="text-sm font-black text-gray-900">{m.health}%</span>
                  </div>
                  <button className="text-gray-300 hover:text-gray-900">
                    <MoreVertical size={20} />
                  </button>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-black tracking-tighter text-gray-900 group-hover:text-orange-600 transition-colors">{m.name}</h4>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{m.type}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center">
                      <Thermometer size={10} className="mr-1" /> Temp
                    </p>
                    <p className="text-sm font-black text-gray-900">{m.temp}°C</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center">
                      <Gauge size={10} className="mr-1" /> Vibe
                    </p>
                    <p className="text-sm font-black text-gray-900">{m.vibe}g</p>
                  </div>
                </div>

                {m.health < 40 && (
                  <div className="bg-rose-50 text-rose-600 p-3 rounded-xl border border-rose-100 flex items-center space-x-2 animate-pulse">
                    <ShieldAlert size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Predictive Critical Failure</span>
                  </div>
                )}
                
                {m.health >= 40 && (
                  <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <span>{m.serial}</span>
                    <span className="text-emerald-500 flex items-center"><CheckCircle size={10} className="mr-1" /> Verified</span>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* --- MODALS & OVERLAYS --- */}

      {/* ONBOARDING MODAL */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-[#020617]/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="max-w-xl w-full"
            >
              <GlassCard className="p-10 border-white/20">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-black tracking-tighter">Initialize New Node</h2>
                  <button onClick={() => setIsAdding(false)} className="p-2 text-gray-400 hover:text-rose-500 bg-gray-50 rounded-full">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleAddSubmit} className="space-y-6">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Machine Nomenclature</label>
                    <input 
                      type="text" 
                      placeholder="e.g. CNC-2000" 
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 font-bold" 
                      value={newMachine.name}
                      onChange={(e) => setNewMachine({...newMachine, name: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Machine Category</label>
                      <select 
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 font-bold"
                        value={newMachine.type}
                        onChange={(e) => setNewMachine({...newMachine, type: e.target.value})}
                      >
                        <option>CNC Center</option>
                        <option>Robotic Arm</option>
                        <option>Hydraulic Press</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Serial ID</label>
                      <input 
                        type="text" 
                        placeholder="SN-XXXX" 
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 font-bold" 
                        value={newMachine.serial}
                        onChange={(e) => setNewMachine({...newMachine, serial: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Purchase Date</label>
                      <input 
                        type="date" 
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 font-bold" 
                        value={newMachine.purchaseDate}
                        onChange={(e) => setNewMachine({...newMachine, purchaseDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Warranty End</label>
                      <input 
                        type="date" 
                        readOnly
                        className="w-full px-5 py-4 bg-blue-50/30 border border-blue-100/30 rounded-2xl outline-none font-bold text-blue-600" 
                        value={newMachine.warrantyEnd}
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100/50">
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-3 flex items-center">
                      < Brain size={12} className="mr-2" /> Neural Auto-Config
                    </p>
                    <p className="text-xs text-blue-800/70 font-medium">Selecting a purchase date will automatically calibrate the 12-month warranty horizon and baseline telemetry thresholds.</p>
                  </div>
                  <button type="submit" className="w-full py-5 bg-orange-500 text-white font-black rounded-2xl shadow-xl hover:bg-orange-600 transition-all">
                    Register Facility Node
                  </button>
                </form>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ASSET DRILL-DOWN PANEL */}
      <AnimatePresence>
        {selectedMachine && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#020617]/40 backdrop-blur-sm"
              onClick={() => setSelectedMachine(null)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-xl h-full bg-white shadow-2xl overflow-y-auto"
            >
              <div className="p-10">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <span className="inline-block px-3 py-1 bg-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-widest rounded-full mb-3">
                      Asset ID: {selectedMachine.serial}
                    </span>
                    <h2 className="text-4xl font-black tracking-tighter text-gray-900 leading-none">{selectedMachine.name}</h2>
                    <p className="text-gray-400 font-medium mt-2">{selectedMachine.type}</p>
                  </div>
                  <button onClick={() => setSelectedMachine(null)} className="p-3 text-gray-400 hover:text-rose-500 bg-gray-50 rounded-2xl transition-colors">
                    <X size={24} />
                  </button>
                </div>

                {/* AI Predictor Core */}
                <div className="bg-[#020617] rounded-[2.5rem] p-8 text-white mb-8 border border-white/5 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full animate-pulse ${selectedMachine.health > 80 ? 'bg-emerald-500' : selectedMachine.health > 40 ? 'bg-amber-500' : 'bg-rose-500'}`} />
                      <span className="text-xs font-black uppercase tracking-widest">Neural Health Index</span>
                    </div>
                    <span className="text-3xl font-black tracking-tighter">{selectedMachine.health}%</span>
                  </div>
                  <p className="text-sm text-gray-400 font-medium leading-relaxed italic">
                    "AI Analysis: {selectedMachine.health > 80 
                      ? "System operating at peak thermal efficiency. No structural anomalies detected." 
                      : selectedMachine.health > 40 
                        ? "Moderate harmonic oscillation detected. Baseline vibration remains within 15% of tolerance."
                        : "Critical frequency mismatch in joint actuator. Imminent failure probability high (88%) within 6-12 hours."
                    }"
                  </p>
                </div>

                {/* Telemetry Charts */}
                <div className="space-y-8">
                  <div>
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                      <Thermometer size={14} className="mr-2 text-rose-500" /> Temperature Gradient (24H)
                    </h4>
                    <div className="h-48 w-full bg-gray-50 rounded-3xl p-4 border border-gray-100">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={TELEMETRY_DATA}>
                          <defs>
                            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#F43F5E" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <Area type="monotone" dataKey="temp" stroke="#F43F5E" fillOpacity={1} fill="url(#colorTemp)" strokeWidth={3} />
                          <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontStyle: 'italic' }} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                      <Gauge size={14} className="mr-2 text-blue-500" /> Vibration Delta (Stability)
                    </h4>
                    <div className="h-48 w-full bg-gray-50 rounded-3xl p-4 border border-gray-100">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={TELEMETRY_DATA}>
                          <Line type="stepAfter" dataKey="vibe" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, fill: '#3B82F6' }} />
                          <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Maintenance Stream */}
                <div className="mt-12">
                  <h4 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest mb-6">Process Log History</h4>
                  <div className="space-y-6 relative ml-4 border-l-2 border-gray-100 pl-8">
                    {[
                      { date: 'Oct 12, 2025', task: 'Shield recalibration', op: 'System Auto' },
                      { date: 'Aug 04, 2025', task: 'Joint lubrication', op: 'Technician 09' },
                      { date: 'Mar 15, 2025', task: 'Initial commissioning', op: 'Global Setup' },
                    ].map((log, i) => (
                      <div key={i} className="relative">
                        <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-white border-4 border-orange-500" />
                        <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-1">{log.date}</p>
                        <p className="text-sm font-black text-gray-900">{log.task}</p>
                        <p className="text-[10px] font-bold text-gray-400">Operator: {log.op}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default InventoryMachine;
