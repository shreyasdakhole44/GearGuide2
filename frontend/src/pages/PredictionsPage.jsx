import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    BrainCircuit, 
    AlertCircle, 
    ShieldCheck, 
    Activity, 
    Zap, 
    Bot, 
    TrendingUp, 
    Database, 
    MoreVertical,
    ArrowRight,
    Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PredictionsPage = () => {
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPredictions = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/predictions', {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                setPredictions(res.data);
            } catch (err) {
                // Mock
                setPredictions([
                    { _id: '1', machineId: { name: 'CNC Lathe 04' }, riskScore: 85, predictedIssue: 'Possible bearing failure detected.', recommendation: 'Schedule immediate ultrasonic audit.', createdAt: new Date().toISOString() },
                    { _id: '2', machineId: { name: 'Mill-A Internal' }, riskScore: 24, predictedIssue: 'Anomalous vibration detected during peak shift.', recommendation: 'Monitor trend; no immediate action required.', createdAt: new Date(Date.now() - 3600000).toISOString() },
                    { _id: '3', machineId: { name: 'Shaft Pump 02' }, riskScore: 92, predictedIssue: 'High thermal signature detected in coolant loop.', recommendation: 'Replace thermal seal v3.', createdAt: new Date(Date.now() - 86400000).toISOString() }
                ]);
            }
            setLoading(false);
        };
        fetchPredictions();
    }, []);

    const getRiskLevel = (score) => {
        if (score >= 80) return { bg: 'bg-red-500', text: 'text-red-400', level: 'CRITICAL', icon: <AlertCircle size={24} />, border: 'border-red-500/30' };
        if (score >= 50) return { bg: 'bg-orange-500', text: 'text-orange-400', level: 'ELEVATED', icon: <Activity size={24} />, border: 'border-orange-500/30' };
        return { bg: 'bg-teal-500', text: 'text-teal-400', level: 'NOMINAL', icon: <ShieldCheck size={24} />, border: 'border-teal-500/30' };
    };

    return (
        <div className="min-h-screen bg-[#020617] p-8 lg:p-12 pb-32 space-y-12">
            {/* Header */}
            <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 border-b border-white/5 pb-10">
                <div className="space-y-4">
                    <div className="inline-flex items-center bg-purple-500/10 rounded-full px-4 py-1.5 border border-purple-500/20">
                        <Bot size={14} className="text-purple-400 mr-2" />
                        <span className="text-[10px] font-black tracking-widest text-purple-300 uppercase">Neural Diagnostics v2.4</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">
                        AI <span className="text-purple-400">Predictions</span>
                    </h1>
                    <p className="text-sm font-bold text-gray-500 max-w-lg leading-relaxed">
                        Deep-learning models analyzing historical telemetry and real-time vibration datasets to forecast infrastructure instability.
                    </p>
                </div>

                <div className="flex items-center space-x-6">
                    <div className="text-right">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Model Confidence</p>
                        <p className="text-2xl font-black text-white leading-none">98.4%</p>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-[#0A1118] border border-white/5 flex items-center justify-center">
                        <TrendingUp size={32} className="text-purple-400" />
                    </div>
                </div>
            </header>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-8">
                     <div className="relative">
                        <div className="w-24 h-24 border-4 border-purple-500/10 border-t-purple-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <BrainCircuit size={32} className="text-purple-400 animate-pulse" />
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-2">RUNNING_NEURAL_SYNAPSE_ANALYSIS...</p>
                        <p className="text-xs font-bold text-gray-600">Retrieving probability distributions across all plant nodes</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <AnimatePresence>
                        {predictions.map((pred, i) => {
                            const style = getRiskLevel(pred.riskScore);
                            return (
                                <motion.div 
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    key={pred._id} 
                                    className="bg-[#0A1118] border border-white/5 rounded-[2.5rem] relative overflow-hidden group hover:border-purple-500/30 transition-all shadow-2xl flex flex-col"
                                >
                                    {/* Risk Gradient Header */}
                                    <div className={`h-2 w-full ${style.bg} opacity-20 group-hover:opacity-100 transition-opacity`} />
                                    
                                    <div className="p-8 space-y-8">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center space-x-4">
                                                <div className={`p-4 rounded-2xl bg-[#020617] border border-white/5 ${style.text} shadow-inner`}>
                                                    {style.icon}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-black text-white tracking-tight uppercase truncate max-w-[140px]">
                                                        {pred.machineId?.name || 'Unknown Node'}
                                                    </h3>
                                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest opacity-60">
                                                        {new Date(pred.createdAt).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${style.border} ${style.text} bg-white/5`}>
                                                {style.level}
                                            </div>
                                        </div>

                                        <div className="bg-[#020617] border border-white/5 rounded-2xl p-6 relative group/info overflow-hidden">
                                             <div className="flex items-center space-x-2 mb-4">
                                                <Zap size={14} className="text-purple-400" />
                                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none">Diagnostics Output</p>
                                             </div>
                                             <p className="text-sm font-bold text-gray-200 leading-relaxed italic">
                                                "{pred.predictedIssue}"
                                             </p>
                                             {/* Abstract decoration */}
                                             <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover/info:bg-purple-500/10 transition-colors" />
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex items-end justify-between">
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-550 uppercase tracking-widest mb-1">Failure Probability</p>
                                                    <div className="flex items-baseline">
                                                        <h4 className={`text-5xl font-black tracking-tighter leading-none ${style.text}`}>
                                                            {pred.riskScore}
                                                        </h4>
                                                        <span className={`text-xl font-black ml-1 ${style.text}`}>%</span>
                                                    </div>
                                                </div>
                                                <div className="text-right pb-1">
                                                     <div className="flex -space-x-1.5">
                                                        {[1,2,3].map(dot => (
                                                            <div key={dot} className={`w-3 h-3 rounded-full border-2 border-[#0A1118] ${style.bg}`}></div>
                                                        ))}
                                                     </div>
                                                </div>
                                            </div>

                                            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${pred.riskScore}%` }}
                                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                                    className={`h-full ${style.bg} shadow-[0_0_20px_rgba(var(--color-pulse),0.5)]`}
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-8 border-t border-white/5 space-y-4">
                                             <div className="flex items-center justify-between">
                                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Recommended Action</p>
                                                <Search size={14} className="text-gray-600 hover:text-white cursor-pointer transition-colors" />
                                             </div>
                                             <div className="bg-purple-600/10 border border-purple-500/20 p-4 rounded-xl flex items-center justify-between group/action cursor-pointer hover:bg-purple-600/20 transition-all">
                                                 <span className="text-xs font-black text-white">{pred.recommendation}</span>
                                                 <ArrowRight size={14} className="text-purple-400 group-hover:translate-x-1 transition-transform" />
                                             </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    {/* Report Export Card */}
                    <div className="bg-gradient-to-br from-purple-900/40 to-[#0A1118] border border-purple-500/20 p-10 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-8 relative overflow-hidden group">
                         <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                         <div className="w-20 h-20 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-400 shadow-2xl relative z-10 group-hover:scale-110 transition-transform">
                            <Database size={40} />
                         </div>
                         <div className="relative z-10">
                            <h4 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Generate Risk Audit</h4>
                            <p className="text-xs font-bold text-gray-400 leading-relaxed uppercase tracking-widest">Export full prediction history as industrial PDF</p>
                         </div>
                         <button className="w-full py-4 bg-purple-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] relative z-10 hover:bg-purple-500 shadow-xl transition-all">
                            Dispatch Full Report
                         </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PredictionsPage;
