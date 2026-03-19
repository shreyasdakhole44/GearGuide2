import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Wifi, Laptop, ShieldCheck, ArrowRight } from 'lucide-react';

const DataFlowDiagram = () => {
    return (
        <div className="w-full py-10 px-6 bg-slate-900/40 backdrop-blur-md rounded-[2.5rem] border border-white/5 mt-8">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-10 text-center italic">Hyper-Link Connectivity Protocol</h3>
            
            <div className="flex items-center justify-between max-w-4xl mx-auto relative px-10">
                {/* Connecting Lines (Background) */}
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent -translate-y-1/2 -z-10" />

                {/* Node 1: Sensor Hardware */}
                <FlowNode 
                    icon={<Cpu size={24} />} 
                    label="Vajra Sensor Node" 
                    sublabel="ESP8266 Core"
                    active
                />

                <FlowArrow />

                {/* Node 2: WiFi Link */}
                <FlowNode 
                    icon={<Wifi size={24} />} 
                    label="WiFi Gateway" 
                    sublabel="TCP/IP Protocol"
                    delay={0.5}
                />

                <FlowArrow />

                {/* Node 3: Laptop/Local processing */}
                <FlowNode 
                    icon={<Laptop size={24} />} 
                    label="Control Hub" 
                    sublabel="Vite Terminal"
                    delay={1}
                />

                <FlowArrow />

                {/* Node 4: AI Agent */}
                <FlowNode 
                    icon={<ShieldCheck size={24} />} 
                    label="Sentinel Agent" 
                    sublabel="Neural link"
                    delay={1.5}
                    highlight
                />
            </div>

            {/* Path Labels */}
            <div className="grid grid-cols-3 mt-4 text-[8px] font-black text-slate-600 uppercase tracking-widest text-center">
                <span>Direct Telemetry</span>
                <span>Wireless Handshake</span>
                <span>Agent Dispatch</span>
            </div>
        </div>
    );
};

const FlowNode = ({ icon, label, sublabel, delay = 0, active = false, highlight = false }) => (
    <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay, duration: 0.8 }}
        className="flex flex-col items-center gap-4 group"
    >
        <div className={`p-5 rounded-2xl border transition-all duration-500 relative ${
            highlight ? 'bg-cyan-600 border-cyan-400 text-white shadow-[0_0_30px_rgba(6,182,212,0.4)]' : 
            'bg-slate-950 border-white/5 text-slate-400 group-hover:border-cyan-500/40 group-hover:text-cyan-400'
        }`}>
            {icon}
            {active && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            )}
        </div>
        <div className="text-center">
            <p className="text-[10px] font-black text-white italic tracking-tight">{label}</p>
            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{sublabel}</p>
        </div>
    </motion.div>
);

const FlowArrow = () => (
    <div className="flex flex-col items-center justify-center flex-1 mx-4">
        <motion.div 
            animate={{ x: [0, 10, 0], opacity: [0.2, 1, 0.2] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-cyan-500/40"
        >
            <ArrowRight size={20} />
        </motion.div>
    </div>
);

export default DataFlowDiagram;
