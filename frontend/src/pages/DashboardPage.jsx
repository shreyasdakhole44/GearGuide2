import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
    Activity,
    Settings,
    Zap,
    AlertTriangle,
    ShieldCheck,
    TrendingUp,
    Database,
    Cpu,
    ArrowUpRight,
    ArrowDownRight,
    MoreVertical
} from 'lucide-react';

const COLOR_MAP = {
    blue: { icon: 'text-blue-400', bg: 'bg-blue-500/10', bar: 'bg-blue-500', shadow: 'shadow-blue-500/50' },
    teal: { icon: 'text-teal-400', bg: 'bg-teal-500/10', bar: 'bg-teal-500', shadow: 'shadow-teal-500/50' },
    red: { icon: 'text-red-400', bg: 'bg-red-500/10', bar: 'bg-red-500', shadow: 'shadow-red-500/50' },
    orange: { icon: 'text-orange-400', bg: 'bg-orange-500/10', bar: 'bg-orange-500', shadow: 'shadow-orange-500/50' }
};

// --- MOCK DATA ---
const KPI_DATA = [
    { title: 'Total Machines', value: 124, icon: <Settings />, color: 'blue', change: '+2', trend: 'up' },
    { title: 'Healthy Machines', value: 118, icon: <ShieldCheck />, color: 'teal', change: '95%', trend: 'up' },
    { title: 'Machines at Risk', value: 4, icon: <AlertTriangle />, color: 'red', change: '+1', trend: 'down' },
    { title: 'Scheduled Maint.', value: 2, icon: <Activity />, color: 'orange', change: 'Active', trend: 'flat' }
];

const HEALTH_TREND = [
    { time: '00:00', score: 92, temp: 42, vib: 1.2 },
    { time: '04:00', score: 94, temp: 40, vib: 1.1 },
    { time: '08:00', score: 88, temp: 45, vib: 1.5 },
    { time: '12:00', score: 85, temp: 48, vib: 1.8 },
    { time: '16:00', score: 82, temp: 52, vib: 2.2 },
    { time: '20:00', score: 90, temp: 44, vib: 1.4 },
    { time: '23:59', score: 89, temp: 43, vib: 1.3 }
];

const FAILURE_RISK = [
    { name: 'Mill-A', risk: 12 },
    { name: 'Lathe-B', risk: 65 },
    { name: 'CNC-04', risk: 88 },
    { name: 'Pump-02', risk: 24 },
    { name: 'Drill-X', risk: 5 }
];

const MACHINE_DATA = [
    { id: 'M01', name: 'CNC Lathe 04', temp: 52, vib: 2.2, press: 4.5, health: 82, risk: 'Medium', color: 'orange' },
    { id: 'M02', name: 'Mill-A Internal', temp: 42, vib: 1.1, press: 3.2, health: 94, risk: 'Low', color: 'teal' },
    { id: 'M03', name: 'Shaft Pump 02', temp: 85, vib: 4.8, press: 6.7, health: 45, risk: 'Critical', color: 'red' },
    { id: 'M04', name: 'Assembly-X Arm', temp: 38, vib: 0.8, press: 2.9, health: 98, risk: 'Low', color: 'teal' }
];

const RECOMMENDATIONS = [
    { machine: 'CNC Lathe 04', risk: 'High', reason: 'High vibration detected', action: 'Inspect bearing and lubricate shaft' },
    { machine: 'Shaft Pump 02', risk: 'Critical', reason: 'Thermal threshold exceeded', action: 'Immediate shutdown and seal replacement' }
];

// --- COMPONENTS ---

const KpiCard = ({ item, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-[#0A1118] border border-white/5 p-6 rounded-[2rem] relative overflow-hidden group hover:border-blue-500/30 transition-all"
    >
        <div className={`p-4 rounded-2xl ${COLOR_MAP[item.color]?.bg || 'bg-gray-500/10'} ${COLOR_MAP[item.color]?.icon || 'text-gray-400'} w-fit mb-6 shadow-inner`}>
            {React.cloneElement(item.icon, { size: 24 })}
        </div>
        <div className="flex justify-between items-end">
            <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">{item.title}</p>
                <h3 className="text-4xl font-black text-white tracking-tighter">
                    {item.value}
                </h3>
            </div>
            <div className={`flex items-center space-x-1 mb-1 ${item.trend === 'up' ? 'text-teal-400' : 'text-red-400'}`}>
                <span className="text-[10px] font-black">{item.change}</span>
                {item.trend === 'up' ? <ArrowUpRight size={14} /> : item.trend === 'down' ? <ArrowDownRight size={14} /> : null}
            </div>
        </div>
        {/* Abstract Background Decoration */}
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
    </motion.div>
);

const HealthTable = () => (
    <div className="bg-[#0A1118] border border-white/5 rounded-[2.5rem] overflow-hidden">
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-xl font-black text-white tracking-tight flex items-center">
                <Database className="mr-3 text-blue-500" size={20} /> Machine Health Overview
            </h3>
            <button className="text-gray-500 hover:text-white transition-colors"><MoreVertical size={20} /></button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-white/5 bg-[#020617]/50">
                        <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Machine Name</th>
                        <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Temp</th>
                        <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Vibration</th>
                        <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Pressure</th>
                        <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Health Score</th>
                        <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Failure Risk</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {MACHINE_DATA.map((mac, i) => (
                        <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="p-6">
                                <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{mac.name}</span>
                                <p className="text-[10px] text-gray-500 font-bold mt-1">ID: {mac.id}</p>
                            </td>
                            <td className="p-6 font-mono text-xs text-gray-300">{mac.temp}°C</td>
                            <td className="p-6 font-mono text-xs text-gray-300">{mac.vib}mm/s</td>
                            <td className="p-6 font-mono text-xs text-gray-300">{mac.press} Bar</td>
                            <td className="p-6">
                                <div className="flex items-center space-x-3 w-32">
                                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${mac.health}%` }}
                                            delay={i * 0.1}
                                            className={`h-full ${COLOR_MAP[mac.color]?.bar || 'bg-gray-500'}`}
                                        />
                                    </div>
                                    <span className="text-xs font-bold text-gray-400">{mac.health}%</span>
                                </div>
                            </td>
                            <td className="p-6 text-right">
                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-current bg-current opacity-20 ${COLOR_MAP[mac.color]?.icon || 'text-gray-400'}`}>
                                    {mac.risk}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const DashboardPage = () => {
    return (
        <div className="min-h-screen bg-[#020617] p-8 lg:p-12 space-y-12 pb-32">
            {/* Header */}
            <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 border-b border-white/5 pb-10">
                <div className="space-y-4">
                    <div className="inline-flex items-center bg-blue-500/10 backdrop-blur-md rounded-full px-4 py-1.5 border border-blue-500/20">
                        <span className="w-2 h-2 rounded-full bg-blue-400 mr-2 animate-pulse"></span>
                        <span className="text-[10px] font-black tracking-widest text-blue-300 uppercase">System Intelligence Active</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white leading-none tracking-tighter uppercase">
                        AI Machine <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
                            Monitoring Dashboard
                        </span>
                    </h1>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <button className="px-8 py-4 bg-[#0A1118] text-white border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:border-blue-500/50 transition-all flex items-center space-x-3 group">
                        <TrendingUp size={18} className="text-blue-400 group-hover:scale-110 transition-transform" />
                        <span>Analysis Mode</span>
                    </button>
                    <button className="px-8 py-4 bg-[#3B82F6] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-400 shadow-[0_20px_40px_rgba(59,130,246,0.3)] transition-all flex items-center space-x-3 group">
                        <Zap size={18} className="group-hover:animate-pulse" />
                        <span>Sync Global Nodes</span>
                    </button>
                </div>
            </header>

            {/* KPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {KPI_DATA.map((item, i) => (
                    <KpiCard key={i} item={item} index={i} />
                ))}
            </div>

            {/* Main Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Health Trend Chart */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-[#0A1118] border border-white/5 p-8 rounded-[2.5rem]"
                >
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="text-xl font-black text-white tracking-tight">Machine Health Trend</h3>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">24-Hour Telemetry Aggregation</p>
                        </div>
                        <Activity className="text-blue-500" size={24} />
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={HEALTH_TREND}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" vertical={false} />
                                <XAxis dataKey="time" stroke="#4a5568" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                                <YAxis stroke="#4a5568" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }}
                                    itemStyle={{ color: '#fff', fontSize: '12px' }}
                                />
                                <Area type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Failure Probability Chart */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-[#0A1118] border border-white/5 p-8 rounded-[2.5rem]"
                >
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="text-xl font-black text-white tracking-tight">Failure Probability</h3>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">AI Risk Distribution</p>
                        </div>
                        <AlertTriangle className="text-red-500" size={24} />
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={FAILURE_RISK}>
                                <XAxis dataKey="name" stroke="#4a5568" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                                <YAxis stroke="#4a5568" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                />
                                <Bar dataKey="risk" fill="#EF4444" radius={[8, 8, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Recommendations & Health Overview */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                <div className="xl:col-span-2">
                    <HealthTable />
                </div>
                <div className="space-y-8">
                    <h3 className="text-xl font-black text-white tracking-tight flex items-center px-2">
                        <Cpu className="mr-3 text-teal-400" size={20} /> AI Recommendations
                    </h3>
                    <div className="grid grid-cols-1 gap-6">
                        {RECOMMENDATIONS.map((rec, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                                className="bg-[#0A1118] border border-white/5 p-6 rounded-[2rem] relative overflow-hidden group shadow-2xl"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-black text-white uppercase tracking-tight">{rec.machine}</h4>
                                        <span className={`inline-block px-3 py-1 bg-red-500/10 text-red-500 text-[9px] font-black uppercase tracking-widest rounded-full border border-red-500/20`}>
                                            Risk: {rec.risk}
                                        </span>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-blue-400 transition-colors">
                                        <Zap size={20} />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Observation</p>
                                        <p className="text-xs font-bold text-gray-300 leading-relaxed">{rec.reason}</p>
                                    </div>
                                    <div className="bg-blue-600/10 border border-blue-500/20 p-4 rounded-2xl">
                                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Recommended Action</p>
                                        <p className="text-xs font-black text-white leading-relaxed">{rec.action}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Alerts Panel Widget */}
                    <div className="bg-red-600 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-red-900/40">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                        <h4 className="text-lg font-black uppercase tracking-tight mb-2">Critical Alerts</h4>
                        <p className="text-xs font-bold opacity-80 leading-relaxed mb-6">Immediate onsite inspection required for Unit Alpha-03.</p>
                        <button className="w-full py-4 bg-white text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-transform">
                            Dispatch Technician
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
