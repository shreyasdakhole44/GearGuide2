import React, { useState, useEffect, Suspense, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Environment, Float, OrbitControls, ContactShadows } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import { 
    Activity, Zap, Thermometer, Droplets, Waves, Radio, 
    ArrowLeft, Download, Database, RefreshCw, Table, LineChart,
    ShieldCheck, AlertTriangle, Cpu, HardDrive, Smartphone, Wifi, 
    MousePointer2, Bell, Box, Terminal, Layers, Info
} from 'lucide-react';
import { 
    LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar 
} from 'recharts';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import VajraHardware from '../components/VajraHardware';
import DataFlowDiagram from '../components/DataFlowDiagram';

const API_BASE = import.meta.env.VITE_API_URL || 'https://gearsentinel-backend.onrender.com';
const API_URL = (path) => `${API_BASE}${path}`;

const VajraNetPage = () => {
    const navigate = useNavigate();
    const [feeds, setFeeds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('vitals');
    const [alerts, setAlerts] = useState([]);
    const lastTempRef = useRef(null);

    const CHANNEL_ID = '3303886';
    const READ_KEY = '2XJVEFHM8WVFL66X';

    const addAlert = (type, message) => {
        const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        setAlerts(prev => [{ id, type, message, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 5));
    };

    const fetchData = async () => {
        try {
            const response = await fetch(`https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.json?api_key=${READ_KEY}&results=40`);
            const data = await response.json();
            const newFeeds = data.feeds.reverse();
            
            // Alert Logic
            if (newFeeds.length > 0) {
                const current = newFeeds[0];
                const temp = parseFloat(current.field1);
                const gas = parseFloat(current.field3);

                if (temp > 35) {
                    addAlert('hazard', 'CRITICAL OVERHEAT: Actual Motor Auto-Shutdown Active');
                }

                if (lastTempRef.current !== null && (temp - lastTempRef.current) > 2) {
                    addAlert('warning', 'PROACTIVE HALT: Sudden Temp Spike (Motor Protection Active)');
                }
                lastTempRef.current = temp;

                if (gas > 400) {
                    addAlert('hazard', 'GAS LEAK DETECTED: Evacuate Area Immediately');
                } else if (gas > 200) {
                    addAlert('warning', 'Elevated Gas Levels Detected');
                }
            }

            setFeeds(newFeeds);
            setIsLoading(false);
        } catch (error) {
            console.error("ThinkSpeak Error:", error);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    const latestData = feeds[0] || {};
    const isCrisis = parseFloat(latestData.field1) > 35;

    const generatePDF = () => {
        const doc = new jsPDF();
        
        // Safety check for autoTable
        if (typeof autoTable !== 'function') {
            console.error("PDF Error: autoTable library not initialized correctly");
            return;
        }

        // Header
        doc.setFillColor(2, 6, 23);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text("VAJRANET IIOT ANALYTICS", 15, 25);
        doc.setFontSize(10);
        doc.text(`GENERATED: ${new Date().toLocaleString().toUpperCase()}`, 15, 33);

        // Stats Summary
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.text("LATEST TELEMETRY SNAPSHOT", 15, 55);
        
        const summaryData = [
            ["PARAMETER", "VALUE", "STATUS"],
            ["TEMPERATURE", `${latestData.field1}°C`, parseFloat(latestData.field1) > 35 ? "CRITICAL" : "STABLE"],
            ["HUMIDITY", `${latestData.field2}%`, "NORMAL"],
            ["GAS CONCENTRATION", latestData.field3, parseFloat(latestData.field3) > 400 ? "HAZARD" : "SAFE"],
            ["VIBRATION STATE", latestData.field4 === '1' ? "ACTIVE" : "STRICT", "MONITORING"]
        ];

        autoTable(doc, {
            startY: 60,
            head: [summaryData[0]],
            body: summaryData.slice(1),
            theme: 'grid',
            headStyles: { fillColor: [6, 182, 212] }
        });

        // Full Logs Table
        const currentY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 100;
        doc.text("HISTORICAL TELEMETRY LOGS", 15, currentY + 15);
        
        const tableBody = feeds.map(f => {
            const dateObj = new Date(f.created_at);
            return [
                dateObj.toLocaleDateString().toUpperCase(),
                dateObj.toLocaleTimeString(),
                f.field1 + "°C",
                f.field2 + "%",
                f.field3 + " PPM",
                f.field4 === '1' ? 'ACTIVE' : 'STRICT'
            ];
        });

        autoTable(doc, {
            startY: currentY + 25,
            head: [['DATE', 'TIME', 'TEMPERATURE', 'HUMIDITY', 'GAS LEVEL', 'VIBRATION']],
            body: tableBody,
            styles: { fontSize: 7, cellPadding: 2 },
            headStyles: { fillColor: [2, 6, 23], textColor: [255, 255, 255] },
            alternateRowStyles: { fillColor: [245, 245, 245] }
        });

        doc.save(`VAJRANET_REPORT_${Date.now()}.pdf`);
    };

    const saveToDB = async () => {
        setIsSaving(true);
        try {
            const response = await fetch(API_URL('/api/vajranet/archive'), {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    temperature: parseFloat(latestData.field1),
                    humidity: parseFloat(latestData.field2),
                    gasLevel: parseFloat(latestData.field3),
                    vibration: latestData.field4
                })
            });
            if (response.ok) {
                addAlert('info', 'Telemetry Archived to Secure Database');
            }
        } catch (err) {
            console.error(err);
        }
        setTimeout(() => setIsSaving(false), 800);
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-300 font-inter selection:bg-cyan-500/30 flex flex-col overflow-hidden grid-bg">
            {/* --- CYBER HEADER --- */}
            <header className="h-20 bg-slate-900/60 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 z-50 sticky top-0">
                <div className="flex items-center gap-6">
                    <button onClick={() => navigate('/dashboard')} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 hover:border-cyan-500/30 group">
                        <ArrowLeft size={18} className="text-slate-400 group-hover:text-cyan-400 transition-colors" />
                    </button>
                    <div className="h-8 w-[1px] bg-white/10" />
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                             <span className="text-[9px] font-black text-cyan-400 uppercase tracking-[0.2em]">Link: Hardware_v1.0_PRO</span>
                        </div>
                        <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic">Vajra<span className="text-cyan-500 not-italic">Net</span></h1>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden lg:flex items-center gap-3 px-5 py-2.5 bg-slate-950/50 rounded-2xl border border-white/5 mr-4">
                        <Wifi size={14} className="text-cyan-400 animate-pulse" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Signal: Optimal</span>
                    </div>
                    
                    <button onClick={saveToDB} className="btn-premium-outline">
                         <Database size={14} className={isSaving ? 'animate-spin' : ''} />
                         Archive Data
                    </button>
                    
                    <button onClick={generatePDF} className="btn-premium">
                         <Download size={14} />
                         Export PDF
                    </button>
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden">
                {/* --- LEFT: 3D ENGINE & FLOW --- */}
                <div className="w-[50%] relative flex flex-col border-r border-white/5">

                    <div className="flex-1 relative">
                        <Canvas dpr={[1, 2]} camera={{ position: [0, 8, 16], fov: 32 }} shadows>
                            <Suspense fallback={null}>
                                <PerspectiveCamera makeDefault position={[0, 8, 16]} />
                                <OrbitControls enablePan={false} minDistance={8} maxDistance={22} autoRotate={false} />
                                <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
                                    <VajraHardware data={latestData} />
                                </Float>
                                <Environment preset="night" />
                                <ContactShadows position={[0, -2, 0]} opacity={0.6} scale={20} blur={2.5} far={4} color="#06b6d4" />
                            </Suspense>
                        </Canvas>

                        {/* Interactive UI Overlay */}
                        <div className="absolute bottom-10 left-10 right-10 grid grid-cols-3 gap-4">
                            <SmallHUDCard icon={<Cpu />} label="Core System" value="STABLE" status="ACTIVE" />
                            <SmallHUDCard icon={<Terminal />} label="Agent Link" value="SYNCED" status="OK" />
                            <SmallHUDCard icon={<Layers />} label="Data Stream" value="LIVE" status="10ms" />
                        </div>
                    </div>

                    {/* --- NEW: DATA FLOW DIAGRAM BELOW CANVAS --- */}
                    <div className="p-10 pt-0">
                        <DataFlowDiagram />
                    </div>
                </div>

                {/* --- RIGHT: MULTI-CHART ANALYTICS --- */}
                <div className="w-[50%] flex flex-col bg-slate-950/20 overflow-y-auto custom-scrollbar p-10 space-y-8">
                    <div className="flex items-center justify-between">
                         <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">Diagnostic <span className="text-cyan-500">Node Hub</span></h2>
                         <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl">
                            {['vitals', 'analytics', 'logs'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-500 hover:text-white'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'vitals' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <CyberStatCard icon={<Thermometer />} label="Thermal Index" value={`${latestData.field1 || '0'}°C`} color={isCrisis ? "text-rose-500" : "text-cyan-400"} crisis={isCrisis} />
                                    <CyberStatCard icon={<Droplets />} label="Saturation" value={`${latestData.field2 || '0'}%`} color="text-cyan-400" />
                                    <CyberStatCard icon={<ShieldCheck />} label="Gas Index" value={latestData.field3 || '0'} color={parseFloat(latestData.field3) > 400 ? "text-rose-500" : "text-emerald-400"} />
                                    <CyberStatCard icon={<Activity />} label="Vibration" value={latestData.field4 === '1' ? 'ACTIVE' : 'STRICT'} color="text-amber-400" />
                                </div>

                                <div className="glass-panel border-white/5 overflow-hidden p-6 h-[400px] flex flex-col">
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="p-2 bg-white/5 rounded-lg text-rose-400">
                                            <Bell size={14} />
                                        </div>
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active System Alerts</h4>
                                    </div>
                                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
                                        {alerts.length === 0 ? (
                                            <div className="h-full flex flex-col items-center justify-center opacity-40">
                                                <ShieldCheck size={32} className="mb-2" />
                                                <span className="text-[10px] uppercase font-black">All Systems Nominal</span>
                                            </div>
                                        ) : (
                                            alerts.map(alert => (
                                                <div key={alert.id} className={`p-4 rounded-xl border border-white/5 bg-white/5 flex items-center gap-4 transition-all hover:bg-white/10 ${
                                                    alert.type === 'hazard' ? 'border-l-4 border-l-rose-500' : 
                                                    alert.type === 'warning' ? 'border-l-4 border-l-amber-500' : 
                                                    'border-l-4 border-l-cyan-500'
                                                }`}>
                                                    <div className={`p-2 rounded-lg ${
                                                        alert.type === 'hazard' ? 'bg-rose-500/10 text-rose-500' : 
                                                        alert.type === 'warning' ? 'bg-amber-500/10 text-amber-500' : 
                                                        'bg-cyan-500/10 text-cyan-500'
                                                    }`}>
                                                        <AlertTriangle size={14} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[10px] font-black uppercase text-white truncate">{alert.message}</p>
                                                        <p className="text-[8px] font-bold text-slate-500">{alert.time}</p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'analytics' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <ChartContainer title="Thermal Flow Graph" icon={<Thermometer size={14} />}>
                                        <AreaChart data={feeds.slice().reverse()}>
                                            <defs>
                                                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor={isCrisis ? "#f43f5e" : "#06b6d4"} stopOpacity={0.2}/>
                                                    <stop offset="95%" stopColor={isCrisis ? "#f43f5e" : "#06b6d4"} stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <Tooltip content={<CustomTooltip />} />
                                            <Area type="monotone" dataKey="field1" stroke={isCrisis ? "#f43f5e" : "#06b6d4"} strokeWidth={3} fill="url(#colorTemp)" />
                                        </AreaChart>
                                    </ChartContainer>

                                    <ChartContainer title="Humidity Variance" icon={<Droplets size={14} />}>
                                        <AreaChart data={feeds.slice().reverse()}>
                                            <defs>
                                                <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <Tooltip content={<CustomTooltip />} />
                                            <Area type="monotone" dataKey="field2" stroke="#3b82f6" strokeWidth={3} fill="url(#colorHum)" />
                                        </AreaChart>
                                    </ChartContainer>

                                    <ChartContainer title="Gas Concentration Spectrum" icon={<Zap size={14} />}>
                                        <ReLineChart data={feeds.slice().reverse()}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Line type="stepAfter" dataKey="field3" stroke="#10b981" strokeWidth={3} dot={{ r: 3, fill: '#10b981' }} activeDot={{ r: 6 }} />
                                        </ReLineChart>
                                    </ChartContainer>

                                    <ChartContainer title="Frequency / Vibration Pulse" icon={<Activity size={14} />}>
                                        <BarChart data={feeds.slice().reverse()}>
                                            <Tooltip content={<CustomTooltip />} />
                                            <Bar dataKey="field4" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ChartContainer>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'logs' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <div className="glass-panel border-white/5 overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead className="bg-white/5">
                                            <tr className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">
                                                <th className="px-8 py-5">Index</th>
                                                <th className="px-8 py-5 text-cyan-400">Temp</th>
                                                <th className="px-8 py-5 text-blue-400">Gas</th>
                                                <th className="px-8 py-5">Timestamp</th>
                                            </tr>
                                        </thead>
                                        <tbody className="max-h-[400px] overflow-y-auto">
                                            {feeds.map((f, i) => (
                                                <tr key={i} className="border-t border-white/5 hover:bg-white/5 transition-colors group">
                                                    <td className="px-8 py-4 text-slate-500 font-mono text-[10px]">{f.entry_id}</td>
                                                    <td className="px-8 py-4 text-white font-black text-xs">{f.field1}°C</td>
                                                    <td className="px-8 py-4 text-white font-black text-xs">{f.field3}</td>
                                                    <td className="px-8 py-4 text-slate-500 text-[10px] italic">{new Date(f.created_at).toLocaleTimeString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-2xl">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Telemetry Value</p>
                <p className="text-sm font-black text-cyan-400">{payload[0].value}</p>
            </div>
        );
    }
    return null;
};

const ChartContainer = ({ title, icon, children }) => (
    <div className="glass-card p-6 flex flex-col h-[320px]">
        <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-white/5 rounded-lg text-cyan-400">
                {icon}
            </div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</h4>
        </div>
        <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
                {children}
            </ResponsiveContainer>
        </div>
    </div>
);

const CyberStatCard = ({ icon, label, value, color, crisis }) => (
    <div className={`glass-card p-6 group relative overflow-hidden ${crisis ? 'animate-cyber-pulse border-rose-500/30' : ''}`}>
        <div className="flex items-center gap-4 mb-3">
            <div className={`p-3 rounded-2xl bg-white/5 ${color} group-hover:scale-110 transition-transform shadow-xl`}>
                {icon}
            </div>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</span>
        </div>
        <p className={`text-3xl font-black tracking-tighter ${color}`}>{value}</p>
        <div className={`absolute bottom-0 left-0 h-[2px] bg-current transition-all duration-500 w-0 group-hover:w-full ${color}`} />
    </div>
);

const SmallHUDCard = ({ icon, label, value, status }) => (
    <div className="bg-slate-900/40 backdrop-blur-md p-4 rounded-2xl border border-white/5 flex items-center gap-4">
        <div className="p-2.5 bg-white/5 rounded-xl text-slate-400">
            {React.cloneElement(icon, { size: 16 })}
        </div>
        <div>
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
            <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white">{value}</span>
                <span className="text-[8px] font-bold text-cyan-400 opacity-60">[{status}]</span>
            </div>
        </div>
    </div>
);

export default VajraNetPage;
