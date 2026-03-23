import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Hash, Activity, ShieldCheck } from 'lucide-react';

const IdentificationKernelPanel = ({ onMetadataChange }) => {
    const [metadata, setMetadata] = useState({
        machine_model: "ST-900 INDUSTRIAL CORE",
        machine_id: "SN-XR-88229",
        machine_type: "ROBOTIC ARM UNIT"
    });

    useEffect(() => {
        if (onMetadataChange) {
            onMetadataChange(metadata);
        }
    }, [metadata, onMetadataChange]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMetadata(prev => ({ ...prev, [name]: value }));
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/40 backdrop-blur-md border border-slate-700/50 p-6 rounded-xl shadow-2xl relative overflow-hidden group"
        >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[50px] rounded-full -mr-16 -mt-16 group-hover:bg-orange-500/20 transition-all duration-700" />
            
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                    <ShieldCheck className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                    <h3 className="text-white font-bold tracking-tight uppercase text-sm">Identification Kernel</h3>
                    <p className="text-slate-400 text-[10px] tracking-widest uppercase">Machine Registry Protocol v2.4</p>
                </div>
            </div>

            <div className="space-y-4">
                {/* Machine Model */}
                <div className="relative">
                    <label className="text-slate-500 text-[10px] uppercase tracking-widest font-black mb-1 block">Machine Model</label>
                    <div className="flex items-center bg-black/40 border border-slate-800 rounded-lg p-3 group-focus-within:border-orange-500/50 transition-colors">
                        <Cpu className="w-4 h-4 text-slate-500 mr-3" />
                        <input 
                            name="machine_model"
                            value={metadata.machine_model}
                            onChange={handleChange}
                            className="bg-transparent border-none outline-none text-orange-500 font-mono text-sm w-full"
                            placeholder="MODEL ID"
                        />
                    </div>
                </div>

                {/* Serial Number */}
                <div className="relative">
                    <label className="text-slate-500 text-[10px] uppercase tracking-widest font-black mb-1 block">Serial Number / Machine ID</label>
                    <div className="flex items-center bg-black/40 border border-slate-800 rounded-lg p-3 group-focus-within:border-orange-500/50 transition-colors">
                        <Hash className="w-4 h-4 text-slate-500 mr-3" />
                        <input 
                            name="machine_id"
                            value={metadata.machine_id}
                            onChange={handleChange}
                            className="bg-transparent border-none outline-none text-slate-200 font-mono text-sm w-full"
                            placeholder="SERIAL NUMBER"
                        />
                    </div>
                </div>

                {/* Machine Type */}
                <div className="relative">
                    <label className="text-slate-500 text-[10px] uppercase tracking-widest font-black mb-1 block">Machine Type</label>
                    <div className="flex items-center bg-black/40 border border-slate-800 rounded-lg p-3 group-focus-within:border-orange-500/50 transition-colors">
                        <Activity className="w-4 h-4 text-slate-500 mr-3" />
                        <input 
                            name="machine_type"
                            value={metadata.machine_type}
                            onChange={handleChange}
                            className="bg-transparent border-none outline-none text-slate-200 font-mono text-sm w-full"
                            placeholder="UNIT TYPE"
                        />
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/50">
                <div className="flex justify-between items-center text-[10px] font-black text-slate-600 uppercase tracking-widest">
                    <span>Identity Status</span>
                    <span className="text-emerald-500 flex items-center gap-1">
                        <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                        Verified
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default IdentificationKernelPanel;
