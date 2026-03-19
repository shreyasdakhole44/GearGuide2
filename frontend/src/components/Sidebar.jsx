import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Server,
    BrainCircuit,
    FileText,
    Bot,
    BarChart3,
    Settings,
    LogOut,
    Menu,
    X,
    Zap,
    ChevronRight,
    Activity,
    ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ onLogout }) => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    // Dynamic menu items based on current page
    const isSentinelPage = location.pathname === '/dashboard' || location.pathname === '/simulations';

    const menuItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={22} />, color: 'text-blue-400' },
        { name: 'Superior AI Agent', path: '/assistant', icon: <Bot size={22} />, color: 'text-cyan-400' },
        // Show these only IF NOT on assistant page (as per user request 2)
        ...(!isSentinelPage ? [
            { name: 'Inventory Machine', path: '/machines', icon: <Server size={22} />, color: 'text-emerald-400' },
            { name: 'Maintenance Logs', path: '/logs', icon: <FileText size={22} />, color: 'text-orange-400' },
        ] : []),
        { name: 'Neural Hub', path: '/simulations', icon: <BrainCircuit size={22} />, color: 'text-purple-400' },
        { name: 'Reports', path: '/reports', icon: <BarChart3 size={22} />, color: 'text-indigo-400' },
        { name: 'Settings', path: '/settings', icon: <Settings size={22} />, color: 'text-gray-400' },
    ];

    const getActiveClass = (path) => {
        return location.pathname === path;
    };

    return (
        <>
            {/* Mobile Toggle */}
            <button
                className="lg:hidden fixed top-6 left-6 z-[60] p-3 bg-[#0A1118] border border-white/10 rounded-2xl text-blue-400 shadow-2xl"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[50] lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Container */}
            <div className={`fixed inset-y-0 left-0 z-[55] w-72 bg-[#020617] border-r border-white/5 transform transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-8 pb-10">
                        <Link to="/" className="flex items-center space-x-3 group">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] group-hover:scale-110 transition-transform">
                                <span className="font-bold text-white text-lg">GG</span>
                            </div>
                            <span className="text-2xl font-black text-white tracking-tighter uppercase">
                                Gear<span className="text-blue-500">Guide</span>
                            </span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                        <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-4 mb-4 opacity-50">
                            {isSentinelPage ? 'Neural Intelligence' : 'Central Command'}
                        </div>
                        {menuItems.map((item) => {
                            const active = getActiveClass(item.path);
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`group flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 relative overflow-hidden ${active
                                            ? 'bg-blue-600/10 border border-blue-500/20 text-white'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                                        }`}
                                >
                                    {active && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-blue-600/5 z-0"
                                        />
                                    )}
                                    <div className="flex items-center space-x-3 relative z-10">
                                        <span className={`${active ? (item.color.replace('text-', 'text-')) : 'text-gray-500 group-hover:text-white'} transition-colors`}>
                                            {item.icon}
                                        </span>
                                        <span className="text-sm font-bold tracking-tight">{item.name}</span>
                                    </div>
                                    {active && <ChevronRight size={14} className="text-blue-500 relative z-10" />}
                                </Link>
                            );
                        })}
                        
                        {/* "Added something that is really needed" - AI Performance Metric in Sidebar */}
                        {isSentinelPage && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-8 px-4 pb-4"
                            >
                                <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-4">
                                     <div className="flex items-center gap-2 mb-2">
                                         <Zap size={12} className="text-blue-400" />
                                         <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Neural Load</span>
                                     </div>
                                     <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                         <motion.div className="h-full bg-blue-500" animate={{ width: ['20%', '80%', '60%'] }} transition={{ duration: 4, repeat: Infinity }} />
                                     </div>
                                </div>
                            </motion.div>
                        )}
                    </nav>

                    {/* Footer */}
                    <div className="p-6 border-t border-white/5 space-y-4">
                        <div className="bg-[#0A1118] rounded-2xl p-4 border border-white/5">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center">
                                    <ShieldCheck size={16} className="text-teal-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-white uppercase tracking-wider">Fleet Health</p>
                                    <p className="text-[9px] font-bold text-teal-400">98.4% NOMINAL</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                {[1,2,3,4,5,6,7,8].map(i => (
                                    <div key={i} className={`h-1 flex-1 rounded-full ${i < 7 ? 'bg-teal-500' : 'bg-gray-700'}`}></div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={onLogout}
                            className="w-full flex items-center justify-center space-x-2 py-4 rounded-2xl text-red-400 font-black text-xs uppercase tracking-widest hover:bg-red-500/10 hover:text-red-300 transition-all border border-transparent hover:border-red-500/20"
                        >
                            <LogOut size={18} />
                            <span>Exit Portal</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
