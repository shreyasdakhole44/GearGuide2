import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    FileText, 
    Activity, 
    Search, 
    Filter, 
    Calendar, 
    ArrowUpRight, 
    ShieldCheck, 
    AlertTriangle,
    Download,
    Cpu,
    Zap,
    History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LogsPage = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await axios.get('/api/logs', {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                setLogs(res.data);
            } catch (err) {
                // Mock
                setLogs([
                    { _id: '1', machineId: { name: 'CNC Lathe 04' }, maintenanceType: 'Predictive', description: 'Bearing replacement initiated based on vibration spike.', officer: 'Officer Peterson', createdAt: new Date().toISOString(), status: 'completed' },
                    { _id: '2', machineId: { name: 'Mill-A Center' }, maintenanceType: 'Routine', description: 'Monthly lubrication and sensor calibration.', officer: 'Officer Peterson', createdAt: new Date(Date.now() - 86400000).toISOString(), status: 'in-progress' },
                    { _id: '3', machineId: { name: 'Shaft Pump 02' }, maintenanceType: 'Emergency', description: 'Thermal seal failure shutdown.', officer: 'Officer Peterson', createdAt: new Date(Date.now() - 172800000).toISOString(), status: 'pending' }
                ]);
            }
            setLoading(false);
        };
        fetchLogs();
    }, []);

    const getStatusStyle = (status) => {
        switch(status?.toLowerCase()) {
            case 'completed': return 'text-teal-400 bg-teal-500/10 border-teal-500/20';
            case 'in-progress': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            case 'pending': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
            default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
        }
    };

    const filteredLogs = logs.filter(l => 
        l.machineId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.maintenanceType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#020617] p-8 lg:p-12 pb-32 space-y-12">
            {/* Header Area */}
            <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 border-b border-white/5 pb-10">
                <div className="space-y-4">
                    <div className="inline-flex items-center bg-orange-500/10 backdrop-blur-md rounded-full px-4 py-1.5 border border-orange-500/20">
                        <span className="w-2 h-2 rounded-full bg-orange-400 mr-2 animate-pulse"></span>
                        <span className="text-[10px] font-black tracking-widest text-orange-300 uppercase">Audit Ledger v1.02</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white leading-none tracking-tighter uppercase">
                        Maintenance <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                            Operational Logs
                        </span>
                    </h1>
                    <p className="text-sm font-bold text-gray-500 max-w-lg leading-relaxed">
                        Secure immutable records of all physical hardware interventions, automated repairs, and manual technician maintenance tasks.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-400 transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Find logs by machine or task..." 
                            className="bg-[#0A1118] border border-white/5 py-3.5 pl-12 pr-6 rounded-2xl text-xs font-bold text-white focus:outline-none focus:border-orange-500/50 w-full md:w-80 shadow-2xl transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="px-6 py-4 bg-[#0A1118] text-white border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-orange-500/50 transition-all flex items-center space-x-3">
                        <Download size={16} className="text-orange-400" />
                        <span>Export CSV</span>
                    </button>
                </div>
            </header>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-6">
                    <div className="w-16 h-16 border-4 border-orange-500/10 border-t-orange-500 rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Accessing_Audit_Vault...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-12">
                    {/* Log Timeline Table View */}
                    <div className="bg-[#0A1118] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#020617]/50 border-b border-white/5">
                                    <tr>
                                        <th className="p-8 text-[10px] font-black text-gray-500 uppercase tracking-widest">Digital Date</th>
                                        <th className="p-8 text-[10px] font-black text-gray-500 uppercase tracking-widest">Asset Target</th>
                                        <th className="p-8 text-[10px] font-black text-gray-500 uppercase tracking-widest">Protocol Type</th>
                                        <th className="p-8 text-[10px] font-black text-gray-500 uppercase tracking-widest">Operation Details</th>
                                        <th className="p-8 text-[10px] font-black text-gray-500 uppercase tracking-widest">Technician</th>
                                        <th className="p-8 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    <AnimatePresence>
                                        {filteredLogs.map((log, i) => (
                                            <motion.tr 
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                                key={log._id} 
                                                className="group hover:bg-white/[0.02] transition-colors"
                                            >
                                                <td className="p-8">
                                                    <div className="flex items-center space-x-3 text-gray-400">
                                                        <Calendar size={14} />
                                                        <span className="text-xs font-bold font-mono">{new Date(log.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mt-1 pl-6">{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                </td>
                                                <td className="p-8">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-2 h-2 rounded-full bg-orange-500/40"></div>
                                                        <span className="text-sm font-black text-white uppercase tracking-tight group-hover:text-orange-400 transition-colors cursor-pointer">
                                                            {log.machineId?.name || 'Unknown Asset'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-8">
                                                    <span className="px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-[9px] font-black text-gray-300 uppercase tracking-widest">
                                                        {log.maintenanceType}
                                                    </span>
                                                </td>
                                                <td className="p-8 max-w-md">
                                                    <p className="text-xs font-bold text-gray-400 leading-relaxed group-hover:text-gray-200 transition-colors">
                                                        {log.description}
                                                    </p>
                                                </td>
                                                <td className="p-8">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center font-black text-[10px] text-blue-400">JD</div>
                                                        <span className="text-xs font-black text-gray-300 uppercase tracking-tight">{log.officer || 'Admin'}</span>
                                                    </div>
                                                </td>
                                                <td className="p-8 text-right">
                                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-current ${getStatusStyle(log.status)}`}>
                                                        {log.status || 'LOGGED'}
                                                    </span>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                        {filteredLogs.length === 0 && (
                            <div className="py-24 text-center space-y-4">
                                <div className="p-6 bg-white/5 rounded-full w-20 h-20 mx-auto flex items-center justify-center text-gray-600">
                                    <FileText size={40} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-white uppercase tracking-tighter">No Audit Logs Found</h4>
                                    <p className="text-xs font-bold text-gray-600 uppercase tracking-[0.2em] mt-1">Refine your search parameters or check system sync</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Industrial Summary Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        <div className="bg-[#0A1118] border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group">
                             <div className="flex justify-between items-start mb-8">
                                <div className="p-4 bg-teal-500/10 text-teal-400 rounded-2xl border border-teal-500/20">
                                    <ShieldCheck size={24} />
                                </div>
                                <ArrowUpRight className="text-gray-600" size={18} />
                             </div>
                             <h4 className="text-sm font-black text-white uppercase tracking-tight mb-2">Compliance Rating</h4>
                             <p className="text-xs font-bold text-gray-500 leading-relaxed uppercase tracking-widest">Maintenance coverage across plant Alpha stands at 94%.</p>
                             <div className="mt-8 flex items-baseline space-x-2">
                                <span className="text-3xl font-black text-white tracking-tighter uppercase">AAA+</span>
                                <span className="text-[10px] font-black text-teal-400 uppercase tracking-[0.3em]">Verified</span>
                             </div>
                        </div>

                        <div className="bg-[#0A1118] border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group">
                             <div className="flex justify-between items-start mb-8">
                                <div className="p-4 bg-orange-500/10 text-orange-400 rounded-2xl border border-orange-500/20">
                                    <AlertTriangle size={24} />
                                </div>
                                <ArrowUpRight className="text-gray-600" size={18} />
                             </div>
                             <h4 className="text-sm font-black text-white uppercase tracking-tight mb-2">Pending Protocols</h4>
                             <p className="text-xs font-bold text-gray-500 leading-relaxed uppercase tracking-widest">3 critical maintenance windows require immediate assignment.</p>
                             <div className="mt-8 flex items-baseline space-x-2">
                                <span className="text-3xl font-black text-white tracking-tighter uppercase">03</span>
                                <span className="text-[10px] font-black text-orange-400 uppercase tracking-[0.3em]">Warning</span>
                             </div>
                        </div>

                         <div className="bg-orange-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-orange-900/40 col-span-1 md:col-span-2 xl:col-span-1">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center space-x-3">
                                    <Zap size={24} className="fill-current" />
                                    <h4 className="text-xl font-black uppercase tracking-tight">Express Ticketing</h4>
                                </div>
                                <p className="text-xs font-bold opacity-80 leading-relaxed uppercase tracking-widest mb-4">Digitally authorize emergency maintenance logs for onsite hardware teams instantly.</p>
                                <button className="w-full py-4 bg-[#020617] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:bg-black transition-all">
                                    Open Dispatch Terminal
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LogsPage;
