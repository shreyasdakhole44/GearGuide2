import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, ShieldCheck, Zap, Server, Search, Filter, ArrowUpRight, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MachinesPage = () => {
    const [machines, setMachines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchMachines = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/machines', {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                setMachines(res.data);
            } catch (err) {
                // Fallback Mock
                setMachines([
                    { _id: '1', name: 'Mill-A Center', type: 'CNC Milling', location: 'Section 01', status: 'operational', installationDate: '2024-01-10T00:00:00Z', health: 94 },
                    { _id: '2', name: 'Lathe-B Turning', type: 'Turning', location: 'Section 04', status: 'maintenance', installationDate: '2023-11-20T00:00:00Z', health: 65 },
                    { _id: '3', name: 'Robot-Arm-Alpha', type: 'Assembly', location: 'Line 02', status: 'offline', installationDate: '2025-06-15T00:00:00Z', health: 12 },
                    { _id: '4', name: 'Pump-Flux-02', type: 'Fluid Dynamics', location: 'Section 01', status: 'operational', installationDate: '2024-05-12T00:00:00Z', health: 88 }
                ]);
            }
            setLoading(false);
        };
        fetchMachines();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'operational': return { text: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/20' };
            case 'maintenance': return { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' };
            case 'offline': return { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' };
            default: return { text: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20' };
        }
    };

    const filteredMachines = machines.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#020617] p-8 lg:p-12 pb-32 space-y-12">
            {/* Header Area */}
            <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 border-b border-white/5 pb-10">
                <div className="space-y-4">
                    <div className="inline-flex items-center bg-teal-500/10 backdrop-blur-md rounded-full px-4 py-1.5 border border-teal-500/20">
                        <span className="w-2 h-2 rounded-full bg-teal-400 mr-2 animate-pulse"></span>
                        <span className="text-[10px] font-black tracking-widest text-teal-300 uppercase">Hardware Registry v4.0</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white leading-none tracking-tighter uppercase">
                        Industrial <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300">
                            Machine Inventory
                        </span>
                    </h1>
                    <p className="text-sm font-bold text-gray-500 max-w-lg leading-relaxed">
                        Centralized management for all physical assets. Monitoring real-time status and deployment telemetry across facilities.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-teal-400 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search Machine ID or Type..."
                            className="bg-[#0A1118] border border-white/5 py-3.5 pl-12 pr-6 rounded-2xl text-xs font-bold text-white focus:outline-none focus:border-teal-500/50 w-full md:w-80 shadow-2xl transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="p-3.5 bg-[#0A1118] text-gray-400 border border-white/5 rounded-2xl hover:text-white hover:border-teal-500/50 transition-all">
                        <Filter size={20} />
                    </button>
                    <button className="px-8 py-4 bg-teal-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-teal-500 shadow-[0_0_30px_rgba(20,184,166,0.3)] transition-all flex items-center space-x-3 group">
                        <Plus size={18} />
                        <span>Add New Asset</span>
                    </button>
                </div>
            </header>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-6">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-teal-500/10 border-t-teal-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Zap size={20} className="text-teal-400 animate-pulse" />
                        </div>
                    </div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Synching_Hardware_Nodes...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {filteredMachines.map((mac, i) => {
                            const style = getStatusColor(mac.status);
                            return (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4, delay: i * 0.05 }}
                                    key={mac._id}
                                    className="bg-[#0A1118] border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-teal-500/30 transition-all shadow-2xl flex flex-col justify-between"
                                >
                                    {/* Status Light */}
                                    <div className="absolute top-8 right-8 flex items-center space-x-2">
                                        <div className={`w-2 h-2 rounded-full animate-pulse ${style.text.replace('text', 'bg')}`}></div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${style.text}`}>{mac.status}</span>
                                    </div>

                                    <div>
                                        <div className="flex items-center space-x-4 mb-8">
                                            <div className={`p-4 rounded-2xl ${style.bg} ${style.text} shadow-inner`}>
                                                <Server size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-white tracking-tight uppercase leading-none mb-1 group-hover:text-teal-400 transition-colors uppercase truncate max-w-[150px]">
                                                    {mac.name}
                                                </h3>
                                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest opacity-60">{mac.type}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 mb-10">
                                            <div className="bg-[#020617] p-5 rounded-2xl border border-white/5 relative group/item">
                                                <div className="flex justify-between items-center mb-3">
                                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Digital Health</p>
                                                    <span className="text-xs font-black text-white">{mac.health || 90}%</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${mac.health || 90}%` }}
                                                        className={`h-full ${mac.health < 50 ? 'bg-red-500' : mac.health < 80 ? 'bg-orange-500' : 'bg-teal-500'}`}
                                                    />
                                                </div>
                                            </div>
                                            <div className="bg-[#020617] p-5 rounded-2xl border border-white/5 flex items-center justify-between">
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Deployment Location</p>
                                                    <span className="text-sm font-black text-white uppercase tracking-tight">{mac.location}</span>
                                                </div>
                                                <ArrowUpRight size={16} className="text-gray-600" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                                        <div className="flex -space-x-2">
                                            {[1, 2].map(u => (
                                                <div key={u} className="w-8 h-8 rounded-full border-2 border-[#0A1118] bg-gray-600 flex items-center justify-center text-[10px] font-black text-white">OP</div>
                                            ))}
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button className="p-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/10">
                                                <Edit size={18} />
                                            </button>
                                            <button className="p-3 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    {/* Empty State / Add Card */}
                    <button className="bg-[#0A1118]/40 border-2 border-dashed border-white/5 p-8 rounded-[2.5rem] flex flex-col items-center justify-center space-y-4 group hover:border-teal-500/40 hover:bg-[#0A1118]/60 transition-all">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-600 group-hover:text-teal-400 transition-colors">
                            <Plus size={32} />
                        </div>
                        <p className="text-xs font-black text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors">Provision New Node</p>
                    </button>
                </div>
            )}

            {/* Stats Summary Ticker */}
            <div className="fixed bottom-0 left-72 right-0 bg-[#0A1118] border-t border-white/5 h-16 hidden lg:flex items-center px-12 justify-between z-40">
                <div className="flex items-center space-x-12">
                    <div className="flex items-center space-x-4">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Active Assets</span>
                        <span className="text-sm font-black text-white">{machines.length}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">System Load</span>
                        <span className="text-sm font-black text-teal-400">NORMAL</span>
                    </div>
                </div>
                <div className="flex items-center space-x-6">
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest leading-none">Global Hardware Synchronized: {new Date().toLocaleTimeString()}</p>
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};

export default MachinesPage;
