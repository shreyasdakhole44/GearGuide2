import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Download, PieChart, LineChart as LineChartIcon, FileText, Zap } from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart as RePieChart, Pie
} from 'recharts';

const ReportsPage = () => {
    const data = [
        { name: 'Uptime', value: 94, color: '#3B82F6' },
        { name: 'Downtime', value: 6, color: '#EF4444' },
    ];

    const efficiencyData = [
        { month: 'Jan', value: 82 },
        { month: 'Feb', value: 85 },
        { month: 'Mar', value: 88 },
        { month: 'Apr', value: 84 },
        { month: 'May', value: 92 },
        { month: 'Jun', value: 95 },
    ];

    return (
        <div className="min-h-screen bg-[#020617] p-8 lg:p-12 pb-32 space-y-12">
            <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 border-b border-white/5 pb-10">
                <div className="space-y-4">
                    <div className="inline-flex items-center bg-indigo-500/10 rounded-full px-4 py-1.5 border border-indigo-500/20">
                        <BarChart3 size={14} className="text-indigo-400 mr-2" />
                        <span className="text-[10px] font-black tracking-widest text-indigo-300 uppercase">Intelligence Reports</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">
                        Performance <span className="text-indigo-400">Analytics</span>
                    </h1>
                    <p className="text-sm font-bold text-gray-500 max-w-lg leading-relaxed">
                        Visualizing operational efficiency, MTBF (Mean Time Between Failures), and health metrics across your industrial network.
                    </p>
                </div>
                <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-500 shadow-[0_0_30px_rgba(79,70,229,0.3)] transition-all flex items-center space-x-3 group">
                    <Download size={18} />
                    <span>Export Full Audit</span>
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0A1118] border border-white/5 p-10 rounded-[2.5rem] flex flex-col justify-between"
                >
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-xl font-black text-white tracking-tight uppercase">System Uptime Ratio</h3>
                        <PieChart className="text-blue-400" size={24} />
                    </div>
                    <div className="h-[300px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <RePieChart>
                                <Pie
                                    data={data}
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }}
                                />
                            </RePieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-4xl font-black text-white tracking-tighter">94%</span>
                            <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest mt-1">Operational</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-[#0A1118] border border-white/5 p-10 rounded-[2.5rem]"
                >
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-xl font-black text-white tracking-tight uppercase">Efficiency Gain</h3>
                        <TrendingUp className="text-teal-400" size={24} />
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={efficiencyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" vertical={false} />
                                <XAxis dataKey="month" stroke="#4a5568" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                                <YAxis stroke="#4a5568" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }}
                                    cursor={{fill: 'rgba(255,255,255,0.02)'}}
                                />
                                <Bar dataKey="value" fill="#6366F1" radius={[8, 8, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: 'MTBF (Avg)', value: '1,420h', icon: <Zap />, color: 'blue' },
                    { label: 'Repair Speed', value: '42m', icon: <TrendingUp />, color: 'teal' },
                    { label: 'Energy Load', value: '1.2MW', icon: <FileText />, color: 'indigo' }
                ].map((stat, i) => (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        key={i} 
                        className="bg-[#0A1118] border border-white/5 p-8 rounded-[2rem] group hover:border-indigo-500/30 transition-all"
                    >
                        <div className={`p-4 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-400 w-fit mb-6`}>
                            {stat.icon}
                        </div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
                        <h4 className="text-3xl font-black text-white tracking-tighter uppercase">{stat.value}</h4>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ReportsPage;
