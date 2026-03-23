import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { 
    Activity, ShieldCheck, AlertTriangle, Zap, Search, 
    Bell, Settings, Terminal, Database, History, 
    MessageSquare, Cpu, BarChart3, Truck, ArrowUpRight,
    ArrowDownRight, Download, Upload, CheckCircle2,
    Clock, Wrench, Users, Thermometer, Waves, Gauge
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import GlossyAgent from '../components/GlossyAgent';

// --- SUB-COMPONENTS ---

const NavItem = ({ icon, active, onClick }) => (
    <button 
        onClick={onClick}
        className={`p-3 rounded-2xl transition-all duration-300 relative group overflow-hidden ${active ? 'bg-orange-600 text-white shadow-lg shadow-orange-950/40' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}>
        {icon}
        {active && (
            <motion.div layoutId="nav-active" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-white rounded-r-full" />
        )}
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
    </button>
);

const SensorWidget = ({ label, value, color }) => (
    <div className="flex flex-col">
        <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{label}</span>
        <span className={`text-xs font-black font-mono ${color}`}>{value}</span>
    </div>
);

const MaintenancePortal = () => {
    // --- STATE ---
    const [currentTime, setCurrentTime] = useState(new Date());
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('overview');
    const [logs, setLogs] = useState([]);
    const [isAILinked, setIsAILinked] = useState(true);
    const [notifications, setNotifications] = useState(3);
    
    // --- MOCK DATA ---
    const KPIs = [
        { label: 'Asset Health Index', value: '94.2%', trend: '+0.5%', color: '#10B981', icon: <ShieldCheck size={20} /> },
        { label: 'Active Work Orders', value: '12', trend: '-2', color: '#F97316', icon: <Wrench size={20} /> },
        { label: 'Response Latency', value: '8.4ms', trend: 'Stable', color: '#06B6D4', icon: <Clock size={20} /> },
    ];

    const RECENT_HISTORY = [
        { id: 'LOG-88229', asset: 'ST-900 Core', type: 'Predictive', date: '2026-03-21', status: 'Completed' },
        { id: 'LOG-88230', asset: 'XR-200 Arm', type: 'Emergency', date: '2026-03-21', status: 'In-Progress' },
        { id: 'LOG-88231', asset: 'MV-500 Pump', type: 'Routine', date: '2026-03-20', status: 'Scheduled' },
    ];

    const CHART_DATA = [
        { name: '00:00', load: 45, heat: 32 },
        { name: '04:00', load: 52, heat: 38 },
        { name: '08:00', load: 88, heat: 65 },
        { name: '12:00', load: 94, heat: 78 },
        { name: '16:00', load: 82, heat: 70 },
        { name: '20:00', load: 60, heat: 50 },
        { name: '23:59', load: 48, heat: 35 },
    ];

    // --- EFFECTS ---
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        // Simple log simulator
        const initialLogs = [
            { id: 1, time: '21:35:04', level: 'INFO', msg: 'System Kernel initialized. Neural Link stable.' },
            { id: 2, time: '21:36:12', level: 'SUCCESS', msg: 'Sync completed for Plant Sector Alpha-12.' },
            { id: 3, time: '21:38:20', level: 'WARN', msg: 'Vibration deviation detected in Unit ST-900.' },
        ];
        // Use functional update to avoid lint warning/overhead if needed, 
        // but here it's fine for initial mount
        setLogs(initialLogs);

        const logInterval = setInterval(() => {
            const types = ['INFO', 'SUCCESS', 'WARN', 'ERROR'];
            const msgs = [
                'Relay heartbeat verified.',
                'Data packets ingested from IoT nodes.',
                'Temperature threshold approaching warning zone.',
                'Sub-system 04 restarted successfully.',
                'Diagnostic sweep initiated on secondary core.'
            ];
            const newLog = {
                id: Date.now(),
                time: new Date().toLocaleTimeString('en-GB'),
                level: types[Math.floor(Math.random() * types.length)],
                msg: msgs[Math.floor(Math.random() * msgs.length)]
            };
            setLogs(prev => [...prev.slice(-14), newLog]);
        }, 4000);

        return () => clearInterval(logInterval);
    }, []);

    // --- RENDER HELPERS ---
    const getLevelColor = (level) => {
        switch(level) {
            case 'SUCCESS': return 'text-emerald-400';
            case 'WARN': return 'text-orange-400';
            case 'ERROR': return 'text-rose-500';
            default: return 'text-cyan-400';
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-orange-500/30 overflow-hidden flex flex-col">
            {/* --- TOP HUD --- */}
            <header className="h-16 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl px-6 flex items-center justify-between z-50">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                            <Zap size={18} className="text-white fill-current" />
                        </div>
                        <h1 className="text-lg font-black tracking-tighter uppercase whitespace-nowrap">
                            GearGuide <span className="text-orange-500">Command</span>
                        </h1>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-2 bg-slate-900/50 border border-white/5 px-4 py-1.5 rounded-full">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">System_Online</span>
                    </div>

                    <div className="relative group hidden lg:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                        <input 
                            type="text" 
                            placeholder="Search Assets, Tickets, or Logs..."
                            className="bg-slate-900/40 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-xs w-64 focus:outline-none focus:border-orange-500/50 transition-all font-bold"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{currentTime.toLocaleDateString()}</p>
                        <p className="text-xs font-mono font-bold text-orange-400">{currentTime.toLocaleTimeString()}</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="p-2.5 bg-slate-900/50 border border-white/5 rounded-xl text-slate-400 hover:text-white transition-colors relative">
                            <Bell size={18} />
                            {notifications > 0 && (
                                <span className="absolute top-2 right-2 w-2 h-2 bg-orange-600 rounded-full"></span>
                            )}
                        </button>
                        <button className="p-2.5 bg-slate-900/50 border border-white/5 rounded-xl text-slate-400 hover:text-white transition-colors">
                            <Settings size={18} />
                        </button>
                    </div>

                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-orange-500 to-amber-300 p-[1px]">
                        <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center font-black text-xs">
                            JD
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* --- SIDEBAR NAV --- */}
                <aside className="w-16 border-r border-white/5 bg-[#020617]/50 flex flex-col items-center py-6 gap-6">
                    <NavItem icon={<Activity size={20}/>} active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                    <NavItem icon={<Database size={20}/>} active={activeTab === 'assets'} onClick={() => setActiveTab('assets')} />
                    <NavItem icon={<History size={20}/>} active={activeTab === 'archive'} onClick={() => setActiveTab('archive')} />
                    <NavItem icon={<Wrench size={20}/>} />
                    <NavItem icon={<Users size={20}/>} />
                    <div className="mt-auto">
                        <NavItem icon={<MessageSquare size={20}/>} />
                    </div>
                </aside>

                <main className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                    {/* --- KPI UNIT --- */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {KPIs.map((kpi, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-slate-900/30 backdrop-blur-md border border-white/5 p-6 rounded-[2rem] group hover:border-orange-500/30 transition-all shadow-xl"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-orange-500/10 transition-colors" style={{ color: kpi.color }}>
                                        {kpi.icon}
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] font-black uppercase" style={{ color: kpi.color }}>
                                        {kpi.trend} <ArrowUpRight size={12} />
                                    </div>
                                </div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{kpi.label}</p>
                                <h3 className="text-3xl font-black text-white tracking-tighter">{kpi.value}</h3>
                            </motion.div>
                        ))}
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* --- DISPATCH TERMINAL (3D) --- */}
                        <section className="lg:col-span-8 bg-[#050A10] rounded-[3.5rem] border border-white/10 overflow-hidden relative min-h-[580px] shadow-[0_40px_100px_rgba(0,0,0,0.6)] group">
                            {/* Decorative Background Elements */}
                            <div className="absolute inset-0 opacity-20 z-0 pointer-events-none" style={{ 
                                backgroundImage: `radial-gradient(circle at 2px 2px, rgba(249, 115, 22, 0.15) 1px, transparent 0)`,
                                backgroundSize: '24px 24px' 
                            }}></div>
                            
                            {/* HUD Header */}
                            <div className="absolute top-10 left-10 z-20 flex items-start gap-6">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-950/50">
                                            <Terminal size={22} className="text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Dispatch Terminal</h2>
                                            <div className="flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping"></span>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Sector Alpha-01 Live Digital Twin</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tactical Sensor HUD */}
                            <div className="absolute top-10 right-10 z-20">
                                <div className="bg-black/60 backdrop-blur-2xl border border-white/10 p-5 rounded-[2.5rem] flex items-center gap-8 shadow-2xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full border-2 border-orange-500/20 flex items-center justify-center relative">
                                            <div className="absolute inset-0 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                            <Zap size={16} className="text-orange-500" />
                                        </div>
                                        <SensorWidget label="Main PWR" value="1.24 kW" color="text-white" />
                                    </div>
                                    <div className="w-px h-10 bg-white/10"></div>
                                    <div className="flex items-center gap-4">
                                        <Thermometer size={18} className="text-orange-400" />
                                        <SensorWidget label="Core TMP" value="42.8 °C" color="text-orange-400" />
                                    </div>
                                    <div className="w-px h-10 bg-white/10"></div>
                                    <div className="flex items-center gap-4 text-emerald-400">
                                        <div className="flex flex-col gap-0.5">
                                            {[1,2,3].map(i => <div key={i} className="w-4 h-1 bg-current opacity-30 rounded-full"></div>)}
                                            <div className="w-4 h-1 bg-current rounded-full mt-0.5"></div>
                                        </div>
                                        <SensorWidget label="VIB State" value="Nominal" color="text-emerald-400" />
                                    </div>
                                </div>
                            </div>
                            
                            {/* 3D Visualizer Context */}
                            <div className="w-full h-full cursor-grab active:cursor-grabbing relative z-10 pt-20">
                                <div className="absolute inset-0 bg-gradient-to-b from-[#050A10] via-transparent to-[#050A10] z-20 pointer-events-none"></div>
                                <Canvas dpr={[1, 2]} gl={{ antialias: true }}>
                                    <Suspense fallback={null}>
                                        <PerspectiveCamera makeDefault position={[6, 3, 10]} />
                                        <Environment preset="city" />
                                        <group position={[0, 1.5, 0]}>
                                            <GlossyAgent />
                                        </group>
                                        <ContactShadows opacity={0.5} scale={12} blur={2} far={10} color="#F97316" />
                                    </Suspense>
                                </Canvas>
                            </div>

                            {/* Terminal Footer UI */}
                            <div className="absolute bottom-10 left-10 right-10 z-30 flex justify-between items-end">
                                <div className="space-y-6">
                                    <div className="bg-black/60 backdrop-blur-xl border border-white/5 p-4 rounded-3xl flex gap-6 items-center">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-orange-600"></div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Session:</span>
                                            <span className="text-[10px] font-mono font-black text-white">04:12:88</span>
                                        </div>
                                        <div className="w-px h-4 bg-white/10"></div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hardware:</span>
                                            <span className="text-[10px] font-black text-orange-400 uppercase">Neural_Grok_v9</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <button className="px-8 py-4 bg-orange-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-orange-500 transition-all shadow-[0_20px_40px_rgba(249,115,22,0.3)] flex items-center gap-3 group/btn">
                                            <span>Initialize Calibration</span>
                                            <ArrowUpRight size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                        </button>
                                        <button className="px-8 py-4 bg-white/5 backdrop-blur-md text-white border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center gap-3">
                                            <Activity size={16} className="text-orange-500" />
                                            <span>Full System Diagnostics</span>
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col items-end gap-3 translate-y-2">
                                    <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-right">
                                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Telemetry Confidence</p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <div className="w-[99.8%] h-full bg-gradient-to-r from-orange-600 to-amber-400"></div>
                                            </div>
                                            <p className="text-xs font-mono font-bold text-white uppercase">99.8%</p>
                                        </div>
                                    </div>
                                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest pr-2">System_ID: GG-X99-22-ALPHA</p>
                                </div>
                            </div>
                        </section>

                        {/* --- TELEMETRY FEED (LIVE LOGS) --- */}
                        <section className="lg:col-span-4 flex flex-col gap-6">
                            <div className="flex-1 bg-black border border-white/10 rounded-[2.5rem] p-6 flex flex-col shadow-2xl">
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Terminal size={14} /> Telemetry_Feed_v4
                                    </h4>
                                    <div className="w-2 h-2 rounded-full bg-orange-600 animate-pulse"></div>
                                </div>
                                
                                <div className="flex-1 font-mono text-[10px] space-y-3 overflow-y-auto scrollbar-hide">
                                    <AnimatePresence mode='popLayout'>
                                        {logs.map((log) => (
                                            <motion.div 
                                                key={log.id}
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                className="flex gap-3 leading-relaxed"
                                            >
                                                <span className="text-slate-600">[{log.time}]</span>
                                                <span className={`font-black uppercase w-12 ${getLevelColor(log.level)}`}>{log.level}:</span>
                                                <span className="text-slate-300">{log.msg}</span>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>

                                <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-[8px] font-black text-slate-600 uppercase tracking-widest">
                                    <span>Stream_Active</span>
                                    <span>3.2 MB/s Inbound</span>
                                </div>
                            </div>

                            <div className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem]">
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Cpu size={14} className="text-orange-500" /> AI Pattern Engine
                                </h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/5">
                                        <span className="text-[10px] font-bold text-slate-300">Wear Prediction</span>
                                        <span className="text-xs font-black text-emerald-400">92% Health</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/5">
                                        <span className="text-[10px] font-bold text-slate-300">Next Maint.</span>
                                        <span className="text-xs font-black text-orange-400">14 Days</span>
                                    </div>
                                    <button className="w-full py-3 bg-orange-600/10 border border-orange-500/30 text-orange-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all">
                                        Ingest Historical CSV
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* --- LOWER GRIDS --- */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-12">
                        {/* MAINTENANCE ARCHIVE */}
                        <div className="bg-slate-900/30 border border-white/5 rounded-[3rem] p-8 shadow-xl">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-black uppercase tracking-tighter">Maintenance Archive</h3>
                                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10 text-[10px] font-black uppercase tracking-widest">
                                    <Download size={14} className="text-orange-500" /> Export CSV
                                </button>
                            </div>
                            
                            <div className="space-y-3">
                                {RECENT_HISTORY.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center font-bold text-[10px] text-slate-400">#{idx+1}</div>
                                            <div>
                                                <p className="text-sm font-black text-white">{item.asset}</p>
                                                <p className="text-[10px] text-slate-500 uppercase font-bold">{item.type} Protocol</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-300">{item.date}</p>
                                            <p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${item.status === 'Completed' ? 'text-emerald-400' : 'text-orange-400'}`}>{item.status}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ANALYTICS SNAPSHOT */}
                        <div className="bg-slate-900/30 border border-white/5 rounded-[3rem] p-8 shadow-xl">
                            <h3 className="text-xl font-black uppercase tracking-tighter mb-8">Intelligence Analytics</h3>
                            <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={CHART_DATA}>
                                        <defs>
                                            <linearGradient id="colorOrange" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#F97316" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                        <XAxis dataKey="name" stroke="#475569" fontSize={10} fontWeight="black" axisLine={false} tickLine={false} />
                                        <YAxis stroke="#475569" fontSize={10} fontWeight="black" axisLine={false} tickLine={false} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
                                            itemStyle={{ color: '#fff', fontSize: '12px' }}
                                        />
                                        <Area type="monotone" dataKey="load" stroke="#F97316" strokeWidth={3} fillOpacity={1} fill="url(#colorOrange)" />
                                        <Area type="monotone" dataKey="heat" stroke="#06B6D4" strokeWidth={3} fillOpacity={0} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* --- NEURAL CHAT INTEGRATION --- */}
            <div className="fixed bottom-8 right-8 z-[100]">
                <button 
                   onClick={() => setIsAILinked(!isAILinked)}
                   className={`h-16 w-16 rounded-[2rem] flex items-center justify-center shadow-2xl transition-all hover:scale-105 active:scale-95 ${isAILinked ? 'bg-orange-600' : 'bg-slate-800 border border-white/10'}`}>
                    <MessageSquare size={24} className={isAILinked ? 'text-white' : 'text-slate-400'} />
                </button>
                <AnimatePresence>
                    {isAILinked && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="absolute bottom-20 right-0 w-[400px] bg-[#020617] border border-white/10 rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.8)] overflow-hidden"
                        >
                            <div className="p-6 bg-orange-600 flex justify-between items-center text-white">
                                <div>
                                    <h4 className="font-black uppercase tracking-widest text-[10px]">Neural Link Established</h4>
                                    <p className="text-xl font-black tracking-tight">GearGuide AI</p>
                                </div>
                                <div className="p-2 bg-white/20 rounded-xl">
                                    <Cpu size={24} />
                                </div>
                            </div>
                            <div className="p-6 h-64 overflow-y-auto space-y-4">
                                <div className="bg-slate-900/50 p-4 rounded-3xl border border-white/5 rounded-bl-none max-w-[85%]">
                                    <p className="text-xs font-bold leading-relaxed">Neural Core sync complete. I am tracking 124 active assets. How can I assist with your mission protocols today?</p>
                                </div>
                                <div className="bg-orange-600/10 p-4 rounded-3xl border border-orange-500/20 rounded-br-none max-w-[85%] ml-auto text-right">
                                    <p className="text-xs font-black text-orange-400">Initiate diagnostic for ST-900 Core.</p>
                                </div>
                            </div>
                            <div className="p-4 border-t border-white/5 bg-slate-950/50 flex gap-3">
                                <input type="text" placeholder="Direct technical directive..." className="flex-1 bg-slate-900 border border-white/5 rounded-2xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-orange-500" />
                                <button className="p-3 bg-orange-600 rounded-2xl text-white">
                                    <ArrowUpRight size={20} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default MaintenancePortal;
