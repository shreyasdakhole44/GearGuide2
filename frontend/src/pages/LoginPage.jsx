import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, Zap, ArrowRight, Lock, Mail, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = ({ setAuth }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify({
        name: res.data.user?.name || 'Authorized Officer',
        company: res.data.user?.company || 'GearGuide Partner'
      }));
      setAuth(true);
      navigate('/dashboard');
    } catch (err) {
      console.error("Login Error Detail:", err);
      setError(err.response?.data?.message || err.message || 'Authentication Failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex font-inter selection:bg-cyan-500/30">

      {/* LEFT SIDE: BRANDING & SYSTEM INFO */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#0A1118] border-r border-white/5 flex-col p-16 justify-between">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-600/10 blur-[120px] rounded-full -mr-64 -mt-64"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -ml-64 -mb-64"></div>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #1E293B 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center space-x-4">
            <div className="bg-white text-[#0A1118] w-12 h-12 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              <span className="font-black text-xl tracking-tighter">GG</span>
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">GearGuide</h1>
              <p className="text-[10px] text-cyan-400 font-bold tracking-[0.3em] uppercase mt-1">Industrial Intelligence</p>
            </div>
          </Link>
        </div>

        <div className="relative z-10 space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <h2 className="text-5xl font-black text-white leading-tight tracking-tighter">
              The Central Hub for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Autonomous Operations.</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-lg font-medium leading-relaxed">
              Authenticate to access your fleet's neural telemetry, predictive maintenance logs, and real-time AI modeling.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <p className="text-2xl font-black text-white tracking-tighter">99.9%</p>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">System Uptime</p>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-black text-white tracking-tighter">24/7</p>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">AI Monitoring</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center space-x-6">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0A1118] bg-slate-800 flex items-center justify-center text-[10px] font-black">U{i}</div>
            ))}
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">+1.2k Active Officers Syncing</p>
        </div>
      </div>

      {/* RIGHT SIDE: LOGIN FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#020617] relative">
        <div className="absolute top-10 right-10 text-[10px] font-black text-slate-700 uppercase tracking-widest lg:hidden">
          GG_PORTAL_V4.0
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md space-y-10"
        >
          <div className="space-y-2">
            <h3 className="text-3xl font-black text-white tracking-tighter uppercase">Gateway Access</h3>
            <p className="text-slate-500 text-sm font-medium tracking-wide">Enter your credentials to synchronize with the neural core.</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-xs font-bold flex items-center gap-3"
            >
              <ShieldCheck size={18} /> {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-6">
              <div className="group space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block pl-1 group-focus-within:text-cyan-400 transition-colors">Digital Identity (Email)</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-400 transition-colors" size={18} />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="officer@plant-01.io"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-white placeholder:text-slate-700 focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 transition-all"
                  />
                </div>
              </div>

              <div className="group space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block pl-1 group-focus-within:text-cyan-400 transition-colors">Access Key (Password)</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-400 transition-colors" size={18} />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-white placeholder:text-slate-700 focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <div className="w-5 h-5 rounded-md border border-white/10 bg-white/5 flex items-center justify-center group-hover:border-cyan-500/50 transition-all">
                  <div className="w-2.5 h-2.5 bg-cyan-500 rounded-sm opacity-0 group-hover:opacity-10 transition-opacity"></div>
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Remember Terminal</span>
              </label>
              <a href="#" className="text-[10px] font-black text-cyan-400 uppercase tracking-widest hover:text-cyan-300 transition-colors">Reset Access Key?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-white text-[#0A1118] hover:bg-cyan-400 transition-all rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl flex items-center justify-center gap-4 group"
            >
              {loading ? 'Synchronizing...' : (
                <>
                  Initialize Link-up
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-slate-500 text-[10px] font-black uppercase tracking-widest pt-10 border-t border-white/5">
            Unauthorized access is logged via neural blockchain. <br />
            Need a new station? <Link to="/register" className="text-cyan-400 hover:text-white transition-colors">Register Facility</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
