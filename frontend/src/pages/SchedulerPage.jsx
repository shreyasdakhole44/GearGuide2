import { useState } from 'react';
import { CalendarClock, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const SchedulerPage = () => {
    const [tasks, setTasks] = useState([
        { id: 1, machine: 'Mill-A', task: 'Replace spindle bearing', date: '2026-03-20', status: 'pending', priority: 'high' },
        { id: 2, machine: 'Lathe-B', task: 'Coolant flush', date: '2026-03-22', status: 'completed', priority: 'low' },
        { id: 3, machine: 'Robot-Arm-X', task: 'Calibrate servos', date: '2026-03-25', status: 'pending', priority: 'medium' },
    ]);

    const getPriorityColor = (priority) => {
        switch(priority) {
            case 'high': return 'text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/30';
            case 'medium': return 'text-[#F59E0B] bg-[#F59E0B]/10 border border-[#F59E0B]/30';
            case 'low': return 'text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/30';
            default: return 'text-[#94A3B8] bg-[#020617] border border-white/5';
        }
    };

    return (
        <div className="pb-20 text-[#F8FAFC]">
            <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/5 pb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-semibold heading-display flex items-center">
                        <CalendarClock className="w-8 h-8 text-[#06B6D4] mr-3" />
                        Maintenance Scheduler
                    </h1>
                    <p className="text-[#94A3B8] mt-1 text-sm">Automated work order assignments and planning.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {tasks.map((task, i) => (
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={task.id} 
                        className="glass-card p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-[#0F172A]"
                    >
                        <div>
                            <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-semibold text-xl text-white heading-display">{task.machine}</h3>
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${getPriorityColor(task.priority)}`}>
                                    {task.priority} Priority
                                </span>
                            </div>
                            <p className="text-[#94A3B8] font-medium mb-3">{task.task}</p>
                            <div className="flex items-center space-x-2 text-sm text-[#94A3B8] bg-[#020617] w-fit px-3 py-1.5 rounded-lg border border-white/5">
                                <Clock size={14} className="text-[#06B6D4]" />
                                <span className="font-mono">{task.date}</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center sm:self-center self-start mt-4 sm:mt-0">
                            {task.status === 'completed' ? (
                                <span className="flex items-center bg-[#22C55E]/10 text-[#22C55E] px-4 py-2 rounded-lg text-sm font-semibold border border-[#22C55E]/20">
                                    <CheckCircle size={18} className="mr-2" /> Resolved
                                </span>
                            ) : (
                                <button className="btn-primary flex items-center whitespace-nowrap text-sm px-6 shadow-[0_0_15px_#06b6d44d]">
                                   Mark Complete
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default SchedulerPage;
