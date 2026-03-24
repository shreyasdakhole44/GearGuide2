import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import {
    Activity, ShieldCheck, AlertTriangle, Zap, Search,
    Bell, Settings, Terminal, Database, History,
    MessageSquare, Cpu, BarChart3, Truck, ArrowUpRight,
    ArrowDownRight, Download, Upload, CheckCircle2,
    Clock, Wrench, Users, Thermometer, Waves, Gauge, ArrowRight, Plus, Mail
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import axios from 'axios';
import emailjs from '@emailjs/browser';
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
    const [dbLogs, setDbLogs] = useState([]);
    const [filterType, setFilterType] = useState('ALL');
    const [isAILinked, setIsAILinked] = useState(true);
    const [notifications, setNotifications] = useState(3);
    const [technicians, setTechnicians] = useState([]);
    const [storage, setStorage] = useState([]);
    const [workOrders, setWorkOrders] = useState([]);
    const [downtimeData, setDowntimeData] = useState([]);
    const canvasContainerRef = useRef(null);
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState([
        { role: 'ai', text: 'Neural Core sync complete. I am tracking 124 active assets. How can I assist with your mission protocols today?' }
    ]);


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

    // Fetch database logs
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [logsRes, techsRes, storageRes, workRes, analyticsRes] = await Promise.all([
                    axios.get('/api/logs'),
                    axios.get('/api/technicians'),
                    axios.get('/api/storage'),
                    axios.get('/api/workorders'),
                    axios.get('/api/analytics/downtime')
                ]);
                setDbLogs(logsRes.data);
                setTechnicians(techsRes.data);
                setStorage(storageRes.data);
                setWorkOrders(workRes.data);
                setDowntimeData(analyticsRes.data);
            } catch (err) {
                console.error('Error fetching data:', err);
                // Fallbacks...
                setDbLogs([
                    { _id: '1', assetName: 'HVAC-03', issue: 'Sensor drift corrected via manual bypass', protocolLevel: 'WARNING', technicianEmail: 'sdakhole18@gmail.com', technician: 'J. DOE', technicianInitials: 'JD', date: new Date(), duration: '45m' },
                    { _id: '2', assetName: 'CNC-04', issue: 'Spindle recalibration based on vibration spike', protocolLevel: 'CRITICAL', technicianEmail: 'sdakhole18@gmail.com', technician: 'M. CHEN', technicianInitials: 'MC', date: new Date(), duration: '1h 20m' },
                    { _id: '3', assetName: 'ROBOT-01', issue: 'Hydraulic pressure test and seal check', protocolLevel: 'ROUTINE', technicianEmail: 'sdakhole18@gmail.com', technician: 'ALEX R.', technicianInitials: 'AR', date: new Date(), duration: '2h 15m' },
                    { _id: '4', assetName: 'ST-900 CORE', issue: 'Neural link recalibration required', protocolLevel: 'WARNING', technicianEmail: 'sdakhole18@gmail.com', technician: 'SARAH J.', technicianInitials: 'S', date: new Date(), duration: '15m' }
                ]);
                setTechnicians([
                    { _id: '1', name: 'Sarah Chen', email: 'sdakhole18@gmail.com', role: 'CERTIFIED TECH LVL 2', activeDeployment: { level: 'CRITICAL', asset: 'CNC-04' }, load: 35, estFinish: '15M', status: 'ACTIVE' },
                    { _id: '2', name: 'Mike Ross', email: 'sdakhole4@gmail.com', role: 'CERTIFIED TECH LVL 1', activeDeployment: { level: 'WARNING', asset: 'HVAC-03' }, load: 60, estFinish: '45M', status: 'ACTIVE' }
                ]);
                setStorage([
                    { _id: '1', filename: 'CNC-04_REPORT.PDF', uploadTime: '10:45', technician: 'SARAH', size: '2.4MB' },
                    { _id: '2', filename: 'HVAC-03_SENSOR.JPG', uploadTime: '09:30', technician: 'MIKE', size: '1.8MB' }
                ]);
                setWorkOrders([
                    { id: 'WO-001', title: 'CNC-04 OVERHEAT', priority: 'P0', technician: 'SARAH', technicianEmail: 'sdakhole18@gmail.com', progress: 30, status: 'ACTIVE', sector: 'G-4' },
                    { id: 'WO-002', title: 'HVAC-03 CALIBRATION', priority: 'P1', technician: 'MIKE', technicianEmail: 'sdakhole18@gmail.com', progress: 60, status: 'ACTIVE', sector: 'G-4' },
                    { id: 'WO-003', title: 'ROBOT-01 ROUTINE', priority: 'P2', technician: 'ALEX', technicianEmail: 'sdakhole18@gmail.com', progress: 100, status: 'ACTIVE', sector: 'G-4' }
                ]);
                setDowntimeData([
                    { day: 'M', value: 1.2 }, { day: 'T', value: 1.8 }, { day: 'W', value: 3.8 },
                    { day: 'T', value: 2.5 }, { day: 'F', value: 1.5 }, { day: 'S', value: 0.8 }, { day: 'S', value: 0.5 }
                ]);
            }
        };
        fetchData();
    }, []);

    // --- HANDLERS ---
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('technician', 'ADMIN_PORTAL');

        setIsUploading(true);
        try {
            const response = await axios.post('/api/storage/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setStorage(prev => [response.data, ...prev]);
        } catch (error) {
            console.error('File Upload Error:', error);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleChatAction = (e) => {
        if (e.key === 'Enter' && chatInput.trim()) {
            const userMsg = chatInput.trim();
            setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
            setChatInput('');

            setTimeout(() => {
                let aiResponse = 'Command processed. Analyzing telemetry...';
                const lowerMsg = userMsg.toLowerCase();
                if (lowerMsg.includes('diagnostic')) aiResponse = 'Diagnostic initiated for ST-900 Core. Health status: 94.2%. No critical overflows detected.';
                else if (lowerMsg.includes('cnc-04')) aiResponse = 'CNC-04 Overheat protocol active. Sarah Chen is on-site. Est. resolution: 12m.';
                else if (lowerMsg.includes('status')) aiResponse = 'Current sectors: G-4 Stable, Sector 7 Routine, CNC area warning flag detected.';
                setChatMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
            }, 800);
        }
    };

    const sendAlertEmail = async (order) => {
        try {
            // Pre-mapped mission dispatch hook (Requires EmailJS Setup)
            await emailjs.send(
                'service_jr2oq7c',
                'template_2kbwgok',
                {
                    to_name: order.technician,
                    to_email: order.technicianEmail || 'sdakhole18@gmail.com',
                    asset_id: order.id,
                    issue: order.title,
                    priority: order.priority,
                    load_metrics: order.progress + '%'
                },
                'o5ESZT7mf7oawZ_Pz'
            );
            alert(`DISPATCH SENT: Alert for ${order.title} dispatched to ${order.technician}`);
        } catch (error) {
            console.error('Email Dispatch Error:', error);
            alert('LINK DOWN: Please configure your EmailJS credentials.');
        }
    };

    const sendArchiveEmail = async (log) => {
        try {
            await emailjs.send(
                'service_jr2oq7c',
                'template_2kbwgok',
                {
                    technician: log.technician,
                    technician_email: log.technicianEmail || 'sdakhole18@gmail.com',
                    asset: log.assetName,
                    issue: log.issue,
                    level: log.protocolLevel,
                    date: new Date(log.date).toLocaleDateString()
                },
                'o5ESZT7mf7oawZ_Pz'
            );
            alert(`ARCHIVE REPORT DISPATCHED: Log for ${log.assetName} sent.`);
        } catch (error) {
            console.error('Archive Comms Error:', error);
            alert('LINK DOWN: Please configure EmailJS for Archive reports.');
        }
    };

    const exportToCSV = () => {
        const filtered = dbLogs.filter(log => filterType === 'ALL' || log.protocolLevel === filterType);
        const headers = ["Timestamp", "Asset", "Issue", "Protocol", "Technician", "Duration"];
        const rows = filtered.map(log => [
            new Date(log.date).toLocaleString(),
            log.assetName,
            log.issue.replace(/,/g, ';'), // Sanitize commas
            log.protocolLevel,
            log.technician,
            log.duration || '45m'
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `GearGuide_Archive_${new Date().toISOString().slice(0, 10)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    // --- RENDER HELPERS ---
    const getLevelColor = (level) => {
        switch (level) {
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
                    <NavItem icon={<Activity size={20} />} active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                    <NavItem icon={<Database size={20} />} active={activeTab === 'assets'} onClick={() => setActiveTab('assets')} />
                    <NavItem icon={<History size={20} />} active={activeTab === 'archive'} onClick={() => setActiveTab('archive')} />
                    <NavItem icon={<Wrench size={20} />} />
                    <NavItem icon={<Users size={20} />} />
                    <div className="mt-auto">
                        <NavItem icon={<MessageSquare size={20} />} />
                    </div>
                </aside>

                <main className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' && (
                            <motion.div
                                key="overview"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-6"
                            >
                                {/* --- KPI UNIT --- */}
                                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {KPIs.map((kpi, idx) => (
                                        <div
                                            key={idx}
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
                                        </div>
                                    ))}
                                </section>

                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                    {/* --- DISPATCH TERMINAL (3D) --- */}
                                    <section className="lg:col-span-8 bg-[#050A10] rounded-[3.5rem] border border-white/10 overflow-hidden relative min-h-[580px] shadow-[0_40px_100px_rgba(0,0,0,0.6)] group">
                                        <div className="absolute inset-0 opacity-20 z-0 pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, rgba(249, 115, 22, 0.15) 1px, transparent 0)`, backgroundSize: '24px 24px' }}></div>
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
                                                    <SensorWidget label="VIB State" value="Nominal" color="text-emerald-400" />
                                                </div>
                                            </div>
                                        </div>
                                        <div ref={canvasContainerRef} className="w-full h-full cursor-grab active:cursor-grabbing relative z-10 pt-20">
                                            <Canvas
                                                key="maintenance-portal-canvas"
                                                dpr={[1, 2]}
                                                gl={{
                                                    antialias: true,
                                                    alpha: true,
                                                    powerPreference: 'high-performance',
                                                    preserveDrawingBuffer: true
                                                }}
                                                eventSource={canvasContainerRef}
                                                camera={{ position: [6, 3, 10], fov: 45 }}
                                            >
                                                <Suspense fallback={null}>
                                                    <Environment preset="city" />
                                                    <group position={[0, 1.5, 0]}>
                                                        <GlossyAgent />
                                                    </group>
                                                    <ContactShadows opacity={0.5} scale={12} blur={2} far={10} color="#F97316" />
                                                </Suspense>
                                            </Canvas>
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
                                                {logs.map((log) => (
                                                    <div key={log.id} className="flex gap-3 leading-relaxed">
                                                        <span className="text-slate-600">[{log.time}]</span>
                                                        <span className={`font-black uppercase w-12 ${getLevelColor(log.level)}`}>{log.level}:</span>
                                                        <span className="text-slate-300">{log.msg}</span>
                                                    </div>
                                                ))}
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
                                            </div>
                                        </div>
                                    </section>
                                </div>
                                {/* --- FULL WIDTH MAINTENANCE ARCHIVE (DARK ORANGE COMBO) --- */}
                                <div className="bg-black border border-white/10 rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)]">
                                    {/* Section Header */}
                                    <div className="p-10 pb-8 flex flex-col md:flex-row justify-between items-center bg-zinc-950 border-b border-white/5 gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-900/20">
                                                <div className="w-8 h-6 border-[2.5px] border-white rounded-[4px] relative flex items-center justify-center">
                                                    <div className="w-1.5 h-3 bg-white absolute -bottom-3 left-1/2 -translate-x-1/2"></div>
                                                    <div className="w-4 h-0.5 bg-white/20"></div>
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black uppercase tracking-tighter text-white">Maintenance Archive</h3>
                                                <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mt-1">Audit Ledger v4.2 // Secure Neural Sync</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="flex bg-white/5 p-1.5 rounded-2xl items-center border border-white/5">
                                                {['ALL', 'CRITICAL', 'WARNING', 'ROUTINE'].map((filter) => (
                                                    <button
                                                        key={filter}
                                                        onClick={() => setFilterType(filter)}
                                                        className={`px-8 py-2 rounded-xl text-[10px] font-black transition-all ${filterType === filter ? 'bg-orange-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
                                                    >
                                                        {filter}
                                                    </button>
                                                ))}
                                            </div>
                                            <button
                                                onClick={exportToCSV}
                                                className="flex items-center gap-3 px-8 py-3.5 bg-orange-600 text-white rounded-[1.25rem] hover:bg-orange-500 transition-all shadow-lg text-[10px] font-black uppercase tracking-widest"
                                            >
                                                <Download size={16} /> Export .CSV
                                            </button>
                                        </div>
                                    </div>

                                    {/* Table Container */}
                                    <div className="bg-[#050A10] px-10 pb-10 overflow-x-auto min-h-[400px]">
                                        <table className="w-full text-left min-w-[1000px]">
                                            <thead>
                                                <tr className="border-b border-white/5">
                                                    <th className="py-8 text-[11px] font-black text-slate-500 uppercase tracking-widest">Timestamp</th>
                                                    <th className="py-8 text-[11px] font-black text-slate-500 uppercase tracking-widest">Asset Targeted</th>
                                                    <th className="py-8 text-[11px] font-black text-slate-500 uppercase tracking-widest">Incident Details</th>
                                                    <th className="py-8 text-[11px] font-black text-slate-500 uppercase tracking-widest text-center">Protocol Level</th>
                                                    <th className="py-8 text-[11px] font-black text-slate-500 uppercase tracking-widest">Technician</th>
                                                    <th className="py-8 text-[11px] font-black text-slate-500 uppercase tracking-widest text-right pr-6">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {dbLogs.filter(log => filterType === 'ALL' || log.protocolLevel === filterType).map((log, idx) => (
                                                    <motion.tr
                                                        key={log._id || idx}
                                                        initial={{ opacity: 0, y: 15 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: idx * 0.05 }}
                                                        className="group hover:bg-white/[0.02] transition-all duration-300"
                                                    >
                                                        <td className="py-8">
                                                            <span className="text-[13px] font-bold text-slate-400 font-mono">{new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                        </td>
                                                        <td className="py-8">
                                                            <span className="text-lg font-black text-white tracking-tight group-hover:text-orange-500 transition-colors">{log.machineId?.name || log.assetName}</span>
                                                        </td>
                                                        <td className="py-8 max-w-[300px]">
                                                            <div className="flex flex-col">
                                                                <span className="text-[13px] font-bold text-slate-400 leading-relaxed">{log.issue}</span>
                                                                <span className="text-[10px] font-black text-orange-500/60 uppercase tracking-widest mt-1">
                                                                    Duration: {log.duration || '45m'}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="py-8 text-center">
                                                            <span className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${log.protocolLevel === 'CRITICAL' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                                                                log.protocolLevel === 'MEDIUM' || log.protocolLevel === 'WARNING' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                                                                    'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                                                }`}>
                                                                {log.protocolLevel || 'ROUTINE'}
                                                            </span>
                                                        </td>
                                                        <td className="py-8">
                                                            <div className="flex items-center gap-4">
                                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${idx % 3 === 0 ? 'bg-orange-600/20 text-orange-500' :
                                                                    idx % 3 === 1 ? 'bg-emerald-600/20 text-emerald-500' :
                                                                        'bg-blue-600/20 text-blue-500'
                                                                    }`}>
                                                                    {log.technicianInitials || log.technician?.split(' ').map(n => n[0]).join('')}
                                                                </div>
                                                                <span className="text-[13px] font-black text-slate-300 uppercase tracking-tight">{log.technician}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-8 text-right pr-6">
                                                            <button className="w-10 h-10 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-orange-600 hover:border-orange-600 transition-all shadow-md mx-auto mr-0">
                                                                <ArrowRight size={16} />
                                                            </button>
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {dbLogs.length === 0 && (
                                            <div className="py-24 text-center space-y-4">
                                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto motion-safe:animate-pulse">
                                                    <Database className="text-orange-500" size={32} />
                                                </div>
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Establishing Neural Sync...</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* --- TECHNICIAN TRACKING & STORAGE HUB --- */}
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 pb-20">
                                    {/* Technician Activity */}
                                    <section className="lg:col-span-8 bg-black border border-white/10 rounded-[3.5rem] overflow-hidden shadow-2xl">
                                        <div className="p-10 pb-6 flex justify-between items-center border-b border-white/5 bg-zinc-950">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center">
                                                    <Users size={20} className="text-white" />
                                                </div>
                                                <h3 className="text-xl font-black uppercase tracking-tighter text-white">Technician Activity Tracking</h3>
                                            </div>
                                            <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Live Updates Enabled</span>
                                            </div>
                                        </div>

                                        <div className="p-10 overflow-x-auto min-h-[350px] bg-[#050A10]">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="border-b border-white/5">
                                                        <th className="pb-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Agent Name</th>
                                                        <th className="pb-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Active Deployment</th>
                                                        <th className="pb-6 text-[10px] font-black text-slate-500 uppercase tracking-widest px-10">Load Balancing</th>
                                                        <th className="pb-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {technicians.length > 0 ? technicians.map((tech, idx) => (
                                                        <motion.tr
                                                            key={tech._id || idx}
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: idx * 0.1 }}
                                                            className="group hover:bg-white/[0.02] transition-all"
                                                        >
                                                            <td className="py-6">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/10">
                                                                        <img src={tech.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${tech.name}`} alt="avatar" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-black text-white">{tech.name}</p>
                                                                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{tech.role}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="py-6">
                                                                <div className="flex items-center justify-center gap-3">
                                                                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${tech.activeDeployment?.level === 'CRITICAL' ? 'bg-rose-500/10 text-rose-500' :
                                                                        tech.activeDeployment?.level === 'WARNING' ? 'bg-orange-500/10 text-orange-500' :
                                                                            'bg-emerald-500/10 text-emerald-500'
                                                                        }`}>
                                                                        {tech.activeDeployment?.level}
                                                                    </span>
                                                                    <span className="text-xs font-black text-white uppercase">{tech.activeDeployment?.asset}</span>
                                                                </div>
                                                            </td>
                                                            <td className="py-6 px-10 min-w-[200px]">
                                                                <div className="flex flex-col gap-2">
                                                                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-500">
                                                                        <span>{tech.load}%</span>
                                                                        <span>EST FINISH: {tech.estFinish}</span>
                                                                    </div>
                                                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                                        <motion.div
                                                                            initial={{ width: 0 }}
                                                                            animate={{ width: `${tech.load}%` }}
                                                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                                                            className={`h-full ${tech.status === 'DONE' ? 'bg-emerald-500' : 'bg-orange-600'}`}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="py-6 text-right">
                                                                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${tech.status === 'ACTIVE' ? 'bg-orange-600/10 text-orange-500 border border-orange-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                                                    }`}>
                                                                    {tech.status}
                                                                </span>
                                                            </td>
                                                        </motion.tr>
                                                    )) : (
                                                        <tr>
                                                            <td colSpan="4" className="py-12 text-center text-[10px] font-black text-slate-600 uppercase tracking-widest">No active personnel</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </section>

                                    {/* Storage Hub */}
                                    <section className="lg:col-span-4 flex flex-col gap-6">
                                        <div className="flex-1 bg-black border border-white/10 rounded-[3.5rem] p-10 shadow-2xl flex flex-col">
                                            <div className="flex justify-between items-center mb-8">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                                                        <History size={20} className="text-orange-500 rotate-180" />
                                                    </div>
                                                    <h3 className="text-xl font-black uppercase tracking-tighter text-white">Storage Hub</h3>
                                                </div>
                                                <button className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white hover:bg-orange-500 transition-all shadow-lg">
                                                    <Plus size={18} />
                                                </button>
                                            </div>

                                            <div className="space-y-4 flex-1">
                                                {storage.length > 0 ? storage.map((file, idx) => (
                                                    <motion.div
                                                        key={file._id || idx}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: idx * 0.1 }}
                                                        className="flex items-center gap-4 p-5 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all group"
                                                    >
                                                        <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center border border-white/10 shadow-xl">
                                                            <Database size={20} className="text-orange-600" />
                                                        </div>
                                                        <div className="flex-1 overflow-hidden">
                                                            <p className="text-xs font-black text-white truncate">{file.filename}</p>
                                                            <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">{file.uploadTime} • {file.technician}</p>
                                                        </div>
                                                        <button className="p-2.5 text-slate-500 hover:text-white transition-colors group-hover:scale-110">
                                                            <Download size={18} />
                                                        </button>
                                                    </motion.div>
                                                )) : (
                                                    <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-20">
                                                        <Database size={40} className="mb-4" />
                                                        <p className="text-[10px] font-black uppercase tracking-widest">No Documents Inbound</p>
                                                    </div>
                                                )}

                                                <div
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className={`mt-8 p-8 border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center text-center transition-all cursor-pointer bg-white/[0.02] group ${isUploading ? 'border-orange-500 opacity-50 cursor-wait' : 'border-white/10 hover:border-orange-500/30'}`}
                                                >
                                                    <input
                                                        type="file"
                                                        ref={fileInputRef}
                                                        onChange={handleFileUpload}
                                                        className="hidden"
                                                        accept=".xlsx,.xls,.csv,.pdf"
                                                    />
                                                    <div className="w-12 h-12 bg-orange-600/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-600 group-hover:text-white transition-all">
                                                        {isUploading ? <Database size={20} className="animate-spin text-orange-500" /> : <Upload size={20} className="text-orange-500 group-hover:text-white" />}
                                                    </div>
                                                    <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">{isUploading ? 'Synchronizing File...' : 'Drop Audit Reports'}</p>
                                                    <p className="text-[8px] font-bold text-slate-600 uppercase tracking-[0.2em]">Max File Size: 250MB</p>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                {/* --- ACTIVE WORK ORDERS & DOWNTIME ANALYSIS --- */}
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 pb-20">
                                    {/* Active Work Orders */}
                                    <section className="lg:col-span-7 flex flex-col">
                                        <div className="flex-1 bg-black border border-white/10 rounded-[3.5rem] p-10 shadow-2xl">
                                            <div className="flex justify-between items-center mb-8">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <Zap size={22} className="text-orange-500" />
                                                        <h3 className="text-2xl font-black uppercase tracking-tighter text-white">Active Work Orders</h3>
                                                    </div>
                                                    <p className="text-[10px] font-bold text-orange-500/60 uppercase tracking-widest">{workOrders.length} INTERVENTIONS ACTIVE IN SECTOR G-4</p>
                                                </div>
                                            </div>

                                            <div className="space-y-8">
                                                {workOrders.length > 0 ? workOrders.map((order, idx) => (
                                                    <div key={order.id || idx} className="space-y-2 relative group-item">
                                                        <div className="flex justify-between items-end">
                                                            <div className="flex items-center gap-4">
                                                                <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${order.priority === 'P0' ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' :
                                                                    order.priority === 'P1' ? 'bg-orange-500/10 border-orange-500/30 text-orange-500' :
                                                                        'bg-slate-500/10 border-slate-500/30 text-slate-500'
                                                                    }`}>{order.priority}</span>
                                                                <h4 className="text-sm font-black text-white uppercase tracking-tight">{order.title}</h4>
                                                            </div>
                                                            <div className="text-right flex items-center gap-6">
                                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">TECH: {order.technician}</span>
                                                                <span className="text-xs font-black text-white">{order.progress}%</span>
                                                                <button
                                                                    onClick={() => sendAlertEmail(order)}
                                                                    className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black text-white hover:bg-orange-600 hover:border-orange-500 transition-all opacity-0 group-item-hover:opacity-100 uppercase"
                                                                >
                                                                    Dispatch
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${order.progress}%` }}
                                                                transition={{ duration: 1, delay: idx * 0.2 }}
                                                                className={`h-full rounded-full ${order.progress === 100 ? 'bg-orange-600 shadow-[0_0_15px_rgba(249,115,22,0.5)]' : 'bg-orange-500/50'
                                                                    }`}
                                                            />
                                                        </div>
                                                    </div>
                                                )) : (
                                                    <div className="py-12 text-center text-[10px] font-black text-slate-600 uppercase tracking-widest">No Active Work Orders</div>
                                                )}
                                            </div>
                                        </div>
                                    </section>

                                    {/* Downtime Analysis */}
                                    <section className="lg:col-span-5 flex flex-col">
                                        <div className="flex-1 bg-black border border-white/10 rounded-[3.5rem] p-10 shadow-2xl flex flex-col relative overflow-hidden">
                                            <div className="flex justify-between items-start mb-8 relative z-10">
                                                <div className="flex items-center gap-3">
                                                    <BarChart3 size={22} className="text-orange-500" />
                                                    <h3 className="text-2xl font-black uppercase tracking-tighter text-white">Downtime Analysis</h3>
                                                </div>
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Last 7 Days</span>
                                            </div>

                                            <div className="flex-1 min-h-[250px] relative z-10">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <AreaChart data={downtimeData}>
                                                        <defs>
                                                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#F97316" stopOpacity={0.8} />
                                                                <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                                                            </linearGradient>
                                                        </defs>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" vertical={false} />
                                                        <XAxis
                                                            dataKey="day"
                                                            axisLine={false}
                                                            tickLine={false}
                                                            tick={{ fill: '#4A5568', fontSize: 10, fontWeight: 'bold' }}
                                                        />
                                                        <YAxis
                                                            axisLine={false}
                                                            tickLine={false}
                                                            tick={{ fill: '#4A5568', fontSize: 10, fontWeight: 'bold' }}
                                                            unit="h"
                                                        />
                                                        <Tooltip
                                                            contentStyle={{ backgroundColor: '#000', border: '1px solid #F97316', borderRadius: '12px' }}
                                                            itemStyle={{ color: '#F97316', fontSize: '10px', fontWeight: 'bold' }}
                                                        />
                                                        <Area
                                                            type="monotone"
                                                            dataKey="value"
                                                            stroke="#F97316"
                                                            strokeWidth={4}
                                                            fillOpacity={1}
                                                            fill="url(#colorValue)"
                                                        />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>

                                            <div className="mt-8 pt-8 border-t border-white/5 text-center">
                                                <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                                                    Peak Downtime: <span className="text-rose-500 font-black">CNC-04 (4.2H)</span> • Sector 4 Efficiency: <span className="text-orange-500 font-bold"> 12.4%</span>
                                                </p>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'archive' && (
                            <motion.div
                                key="archive"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6 pb-20"
                            >
                                {/* MAINTENANCE ARCHIVE (Standalone Page View - Orange & Black) */}
                                <div className="bg-black border border-white/10 rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)]">
                                    {/* Section Header */}
                                    <div className="p-10 pb-8 flex flex-col md:flex-row justify-between items-center bg-zinc-950 border-b border-white/5 gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-900/20">
                                                <div className="w-8 h-6 border-[2.5px] border-white rounded-[4px] relative flex items-center justify-center">
                                                    <div className="w-1.5 h-3 bg-white absolute -bottom-3 left-1/2 -translate-x-1/2"></div>
                                                    <div className="w-4 h-0.5 bg-white/20"></div>
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-3xl font-black uppercase tracking-tighter text-white">Maintenance Archive</h3>
                                                <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mt-1">Audit Ledger v4.2 // Secure Neural Sync</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="flex bg-white/5 p-1.5 rounded-2xl items-center border border-white/5">
                                                {['ALL', 'CRITICAL', 'WARNING', 'ROUTINE'].map((filter) => (
                                                    <button
                                                        key={filter}
                                                        onClick={() => setFilterType(filter)}
                                                        className={`px-8 py-2 rounded-xl text-[10px] font-black transition-all ${filterType === filter ? 'bg-orange-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
                                                    >
                                                        {filter}
                                                    </button>
                                                ))}
                                            </div>
                                            <button
                                                onClick={exportToCSV}
                                                className="flex items-center gap-3 px-8 py-3.5 bg-orange-600 text-white rounded-[1.25rem] hover:bg-orange-500 transition-all shadow-lg text-[10px] font-black uppercase tracking-widest"
                                            >
                                                <Download size={16} /> Export .CSV
                                            </button>
                                        </div>
                                    </div>

                                    {/* Table Container */}
                                    <div className="bg-[#050A10] px-10 pb-10 overflow-x-auto min-h-[600px]">
                                        <table className="w-full text-left min-w-[1000px]">
                                            <thead>
                                                <tr className="border-b border-white/5">
                                                    <th className="py-8 text-[11px] font-black text-slate-500 uppercase tracking-widest">Digital Timestamp</th>
                                                    <th className="py-8 text-[11px] font-black text-slate-500 uppercase tracking-widest">Asset Targeted</th>
                                                    <th className="py-8 text-[11px] font-black text-slate-500 uppercase tracking-widest">Incident Details</th>
                                                    <th className="py-8 text-[11px] font-black text-slate-500 uppercase tracking-widest text-center">Protocol Level</th>
                                                    <th className="py-8 text-[11px] font-black text-slate-500 uppercase tracking-widest">Lead Technician</th>
                                                    <th className="py-8 text-[11px] font-black text-slate-500 uppercase tracking-widest text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {dbLogs.filter(log => filterType === 'ALL' || log.protocolLevel === filterType).map((log, idx) => (
                                                    <motion.tr
                                                        key={log._id || idx}
                                                        initial={{ opacity: 0, y: 15 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: idx * 0.05 }}
                                                        className="group hover:bg-white/[0.02] transition-all duration-300"
                                                    >
                                                        <td className="py-8">
                                                            <div className="flex flex-col">
                                                                <span className="text-[13px] font-black text-white">{new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                                <span className="text-[9px] font-bold text-slate-500 uppercase mt-0.5">{new Date(log.date).toLocaleDateString()}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-8">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-1.5 h-6 bg-orange-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                                <span className="text-base font-black text-white tracking-tight group-hover:text-orange-500 transition-colors">{log.machineId?.name || log.assetName}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-8 max-w-[300px]">
                                                            <div className="flex flex-col">
                                                                <span className="text-[13px] font-bold text-slate-400 leading-relaxed">{log.issue}</span>
                                                                <span className="text-[10px] font-black text-orange-500/60 uppercase tracking-widest mt-1 flex items-center gap-1.5">
                                                                    <Clock size={10} /> Duration: {log.duration || '45m'}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="py-8 text-center">
                                                            <span className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${log.protocolLevel === 'CRITICAL' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                                                                    log.protocolLevel === 'MEDIUM' || log.protocolLevel === 'WARNING' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                                                                        'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                                                }`}>
                                                                {log.protocolLevel || 'ROUTINE'}
                                                            </span>
                                                        </td>
                                                        <td className="py-8">
                                                            <div className="flex items-center gap-4">
                                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${idx % 3 === 0 ? 'bg-orange-600/20 text-orange-500' :
                                                                        idx % 3 === 1 ? 'bg-emerald-600/20 text-emerald-500' :
                                                                            'bg-blue-600/20 text-blue-500'
                                                                    }`}>
                                                                    {log.technicianInitials || log.technician?.split(' ').map(n => n[0]).join('')}
                                                                </div>
                                                                <span className="text-[13px] font-black text-slate-300 uppercase tracking-tight">{log.technician}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-8 text-right">
                                                            <button
                                                                onClick={() => sendArchiveEmail(log)}
                                                                className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white hover:bg-orange-600 hover:scale-110 transition-all shadow-xl ml-auto"
                                                            >
                                                                <Mail size={18} />
                                                            </button>
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {dbLogs.length === 0 && (
                                            <div className="py-32 text-center space-y-6">
                                                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto motion-safe:animate-pulse">
                                                    <Database className="text-slate-300" size={40} />
                                                </div>
                                                <p className="text-sm font-black text-slate-400 uppercase tracking-[0.4em]">Establishing Secure Neural Sync...</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
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
                            <div className="p-6 h-64 overflow-y-auto space-y-4 scrollbar-hide">
                                {chatMessages.map((msg, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: msg.role === 'ai' ? -10 : 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`${msg.role === 'ai' ? 'bg-slate-900/50 border-white/5 rounded-bl-none' : 'bg-orange-600/10 border-orange-500/20 rounded-br-none ml-auto text-right'} p-4 rounded-3xl border max-w-[85%]`}
                                    >
                                        <p className={`text-xs ${msg.role === 'ai' ? 'font-bold leading-relaxed text-slate-300' : 'font-black text-orange-400'}`}>
                                            {msg.text}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                            <div className="p-4 border-t border-white/5 bg-slate-950/50 flex gap-3">
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyDown={handleChatAction}
                                    placeholder="Direct technical directive..."
                                    className="flex-1 bg-slate-900 border border-white/5 rounded-2xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-orange-500 transition-colors"
                                />
                                <button
                                    onClick={() => handleChatAction({ key: 'Enter', target: { value: chatInput } })}
                                    className="p-3 bg-orange-600 rounded-2xl text-white hover:bg-orange-500 transition-colors shadow-lg"
                                >
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
