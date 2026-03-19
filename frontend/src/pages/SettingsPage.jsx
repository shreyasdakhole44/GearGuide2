import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Shield, Bell, User, Cpu, Database, Save, Zap } from 'lucide-react';

const SettingsPage = () => {
    return (
        <div className="min-h-screen bg-[#020617] p-8 lg:p-12 pb-32 space-y-12">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-white/5 pb-10">
                <div className="space-y-4">
                    <div className="inline-flex items-center bg-gray-500/10 rounded-full px-4 py-1.5 border border-gray-500/20">
                        <Settings size={14} className="text-gray-400 mr-2" />
                        <span className="text-[10px] font-black tracking-widest text-gray-300 uppercase">System Parameters</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">
                        GearGuide <span className="text-gray-400">Settings</span>
                    </h1>
                </div>
                <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all flex items-center space-x-3 group">
                    <Save size={18} />
                    <span>Apply Changes</span>
                </button>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
                {/* Navigation */}
                <aside className="space-y-4">
                    {[
                        { name: 'Profile Configuration', icon: <User size={18} />, active: true },
                        { name: 'Security & Access', icon: <Shield size={18} /> },
                        { name: 'Neural Notifications', icon: <Bell size={18} /> },
                        { name: 'Telemetry Integration', icon: <Cpu size={18} /> },
                        { name: 'Data Management', icon: <Database size={18} /> }
                    ].map((item, i) => (
                        <button 
                            key={i}
                            className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${
                                item.active ? 'bg-blue-600/10 text-white border border-blue-500/20 shadow-xl' : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent'
                            }`}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </button>
                    ))}
                </aside>

                {/* Main Settings Panel */}
                <main className="xl:col-span-3 space-y-10">
                    <div className="bg-[#0A1118] border border-white/5 p-10 rounded-[2.5rem] space-y-10">
                        <div>
                            <h3 className="text-xl font-black text-white tracking-tight uppercase mb-8">Industrial Identity</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Company Officer</label>
                                    <input type="text" defaultValue="John Doe" className="w-full bg-[#020617] border border-white/5 py-4 px-6 rounded-2xl text-sm font-bold text-white focus:border-blue-500/50 outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Plant Code</label>
                                    <input type="text" defaultValue="UNIT-ALPHA-01" className="w-full bg-[#020617] border border-white/5 py-4 px-6 rounded-2xl text-sm font-bold text-white focus:border-blue-500/50 outline-none" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-10 border-t border-white/5">
                            <h3 className="text-xl font-black text-white tracking-tight uppercase mb-8">AI Agent Sensitivity</h3>
                            <div className="space-y-8">
                                <div className="flex justify-between items-center bg-[#020617] p-6 rounded-2xl border border-white/5">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                                            <Zap size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-white uppercase tracking-tight">Express Diagnostic Mode</p>
                                            <p className="text-xs font-bold text-gray-550">Runs neural models every 500ms instead of 5s.</p>
                                        </div>
                                    </div>
                                    <button className="w-12 h-6 bg-blue-600 rounded-full relative">
                                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                                    </button>
                                </div>

                                <div className="flex justify-between items-center bg-[#020617] p-6 rounded-2xl border border-white/5">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 bg-red-500/10 text-red-400 rounded-xl">
                                            <Shield size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-white uppercase tracking-tight">Auto-Shutdown Protocol</p>
                                            <p className="text-xs font-bold text-gray-550">Triggers safe shutoff when risk score exceeds 95%.</p>
                                        </div>
                                    </div>
                                    <button className="w-12 h-6 bg-white/10 rounded-full relative">
                                        <div className="absolute left-1 top-1 w-4 h-4 bg-gray-600 rounded-full"></div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SettingsPage;
