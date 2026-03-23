import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, Bot, Server, FileText, Zap, CheckCircle, ShieldAlert, Building2, Phone, Mail, MapPin, LogOut, User, Cpu, Activity, Database, Settings, Brain,
  Volume2, VolumeX, Mic, StopCircle, X, Send, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThreeWorkflow from '../components/ThreeWorkflow';
import ChatBot from '../components/ChatBot';

const LandingPage = () => {
  const [tickerOffset, setTickerOffset] = useState(0);
  const [isHoveringTicker, setIsHoveringTicker] = useState(false);
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  // Load user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Auto-scrolling ticker effect
  useEffect(() => {
    if (!isHoveringTicker) return;
    const interval = setInterval(() => {
      setTickerOffset((prev) => (prev > 100 ? 0 : prev + 0.015));
    }, 16);
    return () => clearInterval(interval);
  }, [isHoveringTicker]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans relative overflow-x-hidden font-inter text-gray-800">

      {/* 
        =================
        COMPANY PROFILE MODAL
        =================
      */}
      {showProfile && user && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-[#0A1118]/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.3)] max-w-lg w-full overflow-hidden border border-gray-100"
          >
            {/* Modal Header */}
            <div className="bg-[#0A1118] p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              <button
                onClick={() => setShowProfile(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
                title="Close"
              >
                <Zap size={20} className="rotate-90" />
              </button>

              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                  <Building2 size={32} className="text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight">{user.company}</h2>
                  <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mt-1">Industrial Enterprise Profile</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Company Officer</p>
                  <p className="text-sm font-black text-gray-900">{user.name}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">HQ Location</p>
                  <p className="text-sm font-black text-gray-900 italic flex items-center">
                    <MapPin size={12} className="mr-1 text-gray-400" /> New York, Global
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Connected Infrastructure</p>
                <div className="flex space-x-2">
                  <div className="px-3 py-1 bg-white rounded-full border border-gray-200 text-[10px] font-bold text-gray-700 shadow-sm flex items-center">
                    <Activity size={10} className="mr-1 text-teal-500" /> 12 Active Sensors
                  </div>
                  <div className="px-3 py-1 bg-white rounded-full border border-gray-200 text-[10px] font-bold text-gray-700 shadow-sm flex items-center">
                    <Server size={10} className="mr-1 text-blue-500" /> 3 Plant Clusters
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowProfile(false)}
                  className="flex-1 py-4 bg-[#0A1118] text-white font-bold rounded-2xl hover:bg-blue-600 transition-colors shadow-lg"
                >
                  Return to Portal
                </button>
                <button
                  className="px-6 py-4 bg-gray-100 text-gray-900 font-bold rounded-2xl hover:bg-gray-200 transition-colors"
                  title="Settings"
                >
                  <Settings size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      {/* 
        =================
        FLOATING WHITE NAVBAR (Horizontal Sidebar)
        =================
      */}
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <nav className="bg-white rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.08)] w-full max-w-6xl flex items-center justify-between px-6 py-3 border border-gray-100 backdrop-blur-md bg-white/90">

          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-[#0A1118] text-white p-2.5 rounded-xl flex items-center justify-center">
              <span className="font-bold text-lg tracking-wider leading-none">GG</span>
            </div>
            <div className="flex flex-col hidden sm:flex">
              <span className="text-lg font-black text-[#0A1118] tracking-tight leading-tight">GearGuide</span>
              <span className="text-[9px] text-blue-600 font-bold tracking-widest uppercase">Company Portal</span>
            </div>
          </div>

          {/* Center Links - The Three Core Pillars */}
          <div className="hidden lg:flex items-center space-x-10 px-6">
            <Link to="/dashboard" className="flex flex-col items-center group">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-[#3B82F6] transition-colors">Platform</span>
              <span className="text-sm font-black text-gray-900 group-hover:text-[#3B82F6] transition-colors">Superior AI Agent</span>
            </Link>
            <div className="w-px h-8 bg-gray-200"></div>
            <Link to="/inventory" className="flex flex-col items-center group">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-[#059669] transition-colors">Hardware</span>
              <span className="text-sm font-black text-gray-900 group-hover:text-[#059669] transition-colors">Inventory Machine</span>
            </Link>
            <div className="w-px h-8 bg-gray-200"></div>
            <Link to="/maintenance" className="flex flex-col items-center group">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-[#F59E0B] transition-colors">Tracking</span>
              <span className="text-sm font-black text-gray-900 group-hover:text-[#F59E0B] transition-colors">Maintenance Logs</span>
            </Link>
            {user && (
              <>
                <div className="w-px h-8 bg-gray-200"></div>
                <button onClick={() => setShowProfile(true)} className="flex flex-col items-center group">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-[#8B5CF6] transition-colors">Verified</span>
                  <span className="text-sm font-black text-gray-900 group-hover:text-[#8B5CF6] transition-colors">Profile</span>
                </button>
              </>
            )}
          </div>

          {/* Right Auth Section - Sign In / Sign Up OR User Profile */}
          <div className="flex items-center space-x-2 bg-gray-50/80 p-1.5 rounded-full border border-gray-200">
            {user ? (
              <div className="flex items-center space-x-4 pl-4 pr-2 py-1">
                <div className="flex flex-col text-right hidden md:flex">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none mb-1">{user.company}</span>
                  <span className="text-xs font-bold text-gray-900 leading-none">{user.name}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#0A1118] text-white flex items-center justify-center shadow-md">
                  <User size={16} />
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="px-5 py-2 text-xs font-bold text-gray-600 hover:text-black hover:bg-white rounded-full transition-all">
                    Sign In
                </Link>
                <Link to="/register" className="px-5 py-2 bg-[#0A1118] text-white text-xs font-bold rounded-full hover:bg-[#3B82F6] shadow-md transition-all flex items-center">
                  Register Company <ArrowRight size={14} className="ml-2" />
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>

      {/* 
        =================
        HERO SECTION WITH BUILDINGS & DIAGRAMS
        =================
      */}
      <section className="relative pt-44 pb-32 min-h-screen flex flex-col justify-start items-center bg-[#0A1118]">
        {/* Skyscraper / Buildings Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 mix-blend-luminosity transform scale-105"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop)' }}
          ></div>
          {/* Gradient to transition into the white section below */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A1118]/90 via-[#0A1118]/70 to-[#F8FAFC] z-10"></div>
          {/* Abstract Grid Lines */}
          <div className="absolute inset-0 opacity-10 z-10" style={{ backgroundImage: 'linear-gradient(#1E293B 1px, transparent 1px), linear-gradient(90deg, #1E293B 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        </div>

        <div className="relative z-20 max-w-6xl mx-auto px-6 text-center w-full mt-10">
          <div className="inline-flex items-center bg-blue-500/10 backdrop-blur-md rounded-full px-4 py-1.5 mb-8 border border-blue-500/20">
            <span className="w-2 h-2 rounded-full bg-blue-400 mr-2 animate-pulse"></span>
            <span className="text-[10px] font-bold tracking-widest text-blue-300 uppercase">Enterprise Company Register</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-[85px] font-black text-white leading-[0.95] tracking-tight mb-8 drop-shadow-2xl">
            The Future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
              Industrial Architecture
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto font-medium leading-relaxed mb-12 px-4 drop-shadow-md">
            Register your company on our secure portal to unlock the <strong className="text-white">Superior AI Agent</strong>. Visually manage your <strong className="text-white">Inventory Machines</strong> and track automated <strong className="text-white">Maintenance Logs</strong> inside one unified, beautiful interface.
          </p>



          {/* DIAGRAMS (3 Core Components Flow in Boxes) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative max-w-5xl mx-auto z-30">
            {/* Connecting dashed line behind the cards (Desktop Only) */}
            <div className="hidden md:block absolute top-1/2 left-10 right-10 h-0 bg-transparent -translate-y-1/2 z-0 border-t-2 border-dashed border-gray-400/30"></div>

            {/* Step 1: Inventory Machine */}
            <div id="inventory" className="bg-white/90 backdrop-blur-md rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative z-10 border border-white flex flex-col items-center text-center transform hover:-translate-y-2 transition-transform">
              <div className="w-20 h-20 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-6 shadow-inner border border-teal-100 relative">
                <Server size={36} />
                <div className="absolute -bottom-2 -right-2 bg-teal-500 w-6 h-6 rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm font-bold text-xs">1</div>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Inventory Machine</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">
                Seamlessly onboard your factory floor assets. Connect CNCs, Lathes, and Robotics directly to our isolated cloud architecture.
              </p>
              <Link to="/inventory" className="mt-auto w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl transition-colors text-sm shadow-[0_10px_20px_rgba(20,184,166,0.3)] flex justify-center items-center">
                Access Infrastructure <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>

            {/* Step 2: Superior AI Agent */}
            <div id="ai-agent" className="bg-[#0A1118] backdrop-blur-md rounded-[2rem] p-8 shadow-[0_30px_60px_rgba(59,130,246,0.3)] relative z-10 border border-blue-800 flex flex-col items-center text-center transform hover:-translate-y-2 transition-transform md:scale-105">
              <div className="absolute -top-4 right-8 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] border-4 border-[#0A1118]">
                <Zap size={18} className="animate-pulse" />
              </div>
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-900 to-black text-blue-400 flex items-center justify-center mb-6 shadow-xl border border-blue-800/80 relative">
                <Bot size={36} />
                <div className="absolute -bottom-2 -right-2 bg-blue-500 w-6 h-6 rounded-full flex items-center justify-center text-white border-2 border-[#0A1118] shadow-sm font-bold text-xs">2</div>
              </div>
              <h3 className="text-2xl font-black text-white mb-2">Superior AI Agent</h3>
              <p className="text-sm text-gray-400 font-medium leading-relaxed mb-6">
                Our proprietary neural network continuously analyzes incoming telemetry to predict anomalous behavior before hardware failures occur.
              </p>
              <Link to="/dashboard" className="mt-auto w-full py-3 bg-[#3B82F6] hover:bg-blue-400 text-white font-bold rounded-xl transition-colors text-sm shadow-[0_10px_20px_rgba(59,130,246,0.3)] flex justify-center items-center">
                Sentinel Portal <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>

            {/* Step 3: Maintenance Logs */}
            <div id="maintenance" className="bg-white/90 backdrop-blur-md rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative z-10 border border-white flex flex-col items-center text-center transform hover:-translate-y-2 transition-transform">
              <div className="w-20 h-20 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-6 shadow-inner border border-orange-100 relative">
                <FileText size={36} />
                <div className="absolute -bottom-2 -right-2 bg-orange-500 w-6 h-6 rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm font-bold text-xs">3</div>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Maintenance Logs</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">
                Automatically dispatch AI work orders. Keep comprehensive, immutable records of all operations and technician interventions.
              </p>
              <Link to="/maintenance" className="mt-auto w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl transition-colors text-sm shadow-[0_10px_20px_rgba(234,88,12,0.3)] flex justify-center items-center">
                View Maintenance Feed <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 
        =================
        SECURE COMPANY ONBOARDING SECTION
        =================
      */}
      {!user && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-[#0A1118] leading-tight mb-6">
                Ready to upgrade your <br /><span className="text-[#3B82F6]">Industrial Workflow?</span>
              </h2>
              <p className="text-lg text-gray-500 mb-8 font-medium">
                GearGuide is designed exclusively for verified companies. Creating an account gives your entire team access to our dashboard, where they can instantly map out the Inventory Machines and let the Superior AI Agent handle the rest.
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center text-gray-800 font-bold"><CheckCircle className="text-green-500 mr-3" size={20} /> Access to real-time predictive charting.</li>
                <li className="flex items-center text-gray-800 font-bold"><CheckCircle className="text-green-500 mr-3" size={20} /> Unlimited automated Maintenance Logs.</li>
                <li className="flex items-center text-gray-800 font-bold"><CheckCircle className="text-green-500 mr-3" size={20} /> Dedicated API for your existing sensor arrays.</li>
              </ul>

              <div className="flex space-x-4">
                <Link to="/register" className="px-8 py-4 bg-[#0A1118] text-white font-bold rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.15)] hover:bg-[#3B82F6] hover:-translate-y-1 transition-all">
                  Register Company Setup
                </Link>
              </div>
            </div>

            <div className="bg-[#F8FAFC] rounded-[3rem] p-10 border border-gray-100 relative shadow-2xl shadow-blue-900/5">
              <div className="absolute top-6 right-6 flex items-center bg-white px-3 py-1 rounded-full shadow-sm">
                <ShieldAlert className="text-blue-500 w-4 h-4 mr-2" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Enterprise Secure</span>
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 border-b border-gray-200 pb-2">Facility Connectivity Protocol</p>

              <div className="mt-8 space-y-4">
                <div className="bg-white p-4 rounded-2xl flex items-center shadow-sm border border-gray-50">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mr-4"><Building2 size={24} /></div>
                  <div>
                    <h4 className="font-bold text-gray-900">1. Setup Organization</h4>
                    <p className="text-xs text-gray-500 font-medium">Create your secure company profile space.</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-2xl flex items-center shadow-sm border border-gray-50">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mr-4"><Server size={24} /></div>
                  <div>
                    <h4 className="font-bold text-gray-900">2. Register Assets</h4>
                    <p className="text-xs text-gray-500 font-medium">Input your Inventory Machines into the grid.</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-2xl flex items-center shadow-sm border border-gray-50 outline outline-2 outline-blue-500 outline-offset-2">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mr-4"><Bot size={24} /></div>
                  <div>
                    <h4 className="font-bold text-gray-900">3. Activate AI Agent</h4>
                    <p className="text-xs text-blue-600 font-bold">Predictive maintenance begins instantly.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <ThreeWorkflow />

      {/* 
        =================
        FOOTER
        =================
      */}
      <footer className="bg-[#F4F6F9] pt-24 pb-24 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          {/* Top Footer: Ratings & Brands */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 pb-20 border-b border-gray-200 items-center">

            {/* Main Testimonial */}
            <div className="lg:col-span-7 space-y-8">
              <div className="flex items-center space-x-2 text-yellow-500">
                {[1, 2, 3, 4, 5].map((s) => <Zap key={s} size={20} fill="currentColor" />)}
                <span className="ml-4 text-3xl font-black text-gray-900 leading-none tracking-tight">4.9/5</span>
              </div>

              <div className="space-y-6">
                <h3 className="text-4xl md:text-5xl font-black text-[#0A1118] leading-tight tracking-tight">
                  Trusted by <br />
                  <span className="text-[#3B82F6]">Industry Leaders</span>
                </h3>
                <p className="text-xl text-gray-500 font-medium max-w-xl leading-relaxed italic">
                  "GearGuide transformed our factory floor. We've seen a 40% reduction in unplanned downtime in just six months of implementation."
                </p>
              </div>

              <div className="flex items-center space-x-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 w-fit">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop"
                  alt="Mark Thompson"
                  className="w-14 h-14 rounded-xl object-cover shadow-inner"
                />
                <div>
                  <p className="text-base font-black text-gray-900">Mark Thompson</p>
                  <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">VP Operations, GigaFab Systems</p>
                </div>
              </div>
            </div>

            {/* Side Rating Cards */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  label: "Plant Manager",
                  rate: "5.0",
                  text: "Excellent AI integration...",
                  img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=100&auto=format&fit=crop"
                },
                {
                  label: "Facilities Eng",
                  rate: "4.9",
                  text: "Best-in-class UI design",
                  img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
                },
                {
                  label: "CEO TechCorp",
                  rate: "5.0",
                  text: "Immense ROI for us",
                  img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=100&auto=format&fit=crop"
                },
                {
                  label: "Safety Lead",
                  rate: "5.0",
                  text: "Zero accidents reported",
                  img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop"
                }
              ].map((r, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-full"
                >
                  <div className="flex justify-between items-start mb-4">
                    <img src={r.img} alt={r.label} className="w-10 h-10 rounded-lg object-cover grayscale opacity-70" />
                    <div className="flex text-yellow-500"><Zap size={10} fill="currentColor" /><Zap size={10} fill="currentColor" /><Zap size={10} fill="currentColor" /></div>
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-gray-900 mb-1">{r.rate} Rating</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight mb-2">{r.label}</p>
                    <p className="text-xs font-medium text-gray-500 italic leading-tight">"{r.text}"</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Brand */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-[#0A1118] text-white p-3 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="font-bold tracking-wider leading-none">GG</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-black text-[#0A1118] leading-none">GearGuide</span>
                  <span className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">Industrial Platforms</span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-500 leading-relaxed max-w-sm">
                Empowering modern connected factories with best-in-class predictive AI. Stop reacting to machine failures, and start preventing them entirely.
              </p>
            </div>

            {/* Quick Nav */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest border-l-2 border-[#3B82F6] pl-3 mb-6">Portal Access</h4>
              <ul className="space-y-4 text-sm font-bold text-gray-600">
                <li><Link to="/dashboard" className="hover:text-blue-500 transition-colors">Portal Access</Link></li>
                <li><Link to="/register" className="hover:text-blue-500 transition-colors">Register Organization</Link></li>
                <li><a href="#ai-agent" className="hover:text-blue-500 transition-colors">View AI Features</a></li>
                <li><a href="#inventory" className="hover:text-blue-500 transition-colors">Supported Inventory</a></li>
              </ul>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest border-l-2 border-[#3B82F6] pl-3 mb-6">Help & Support</h4>
              <a href="#" className="flex items-start space-x-4 text-gray-900 hover:text-blue-500 transition-colors">
                <div className="bg-white shadow-sm p-2 rounded-lg text-gray-500"><Phone size={16} /></div>
                <span className="font-bold text-sm mt-1">1800 103 0222</span>
              </a>
              <a href="#" className="flex items-start space-x-4 text-gray-900 hover:text-blue-500 transition-colors">
                <div className="bg-white shadow-sm p-2 rounded-lg text-gray-500"><Mail size={16} /></div>
                <span className="font-bold text-sm mt-1">onboard@gearguide.ai</span>
              </a>
            </div>
          </div>

          {/* TEAM ARGUNA FOOTER */}
          <div className="mt-20 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center md:text-left">
              made by love with <span className="text-red-500">♥</span> team arguna
            </p>
            <p className="text-xs font-black text-gray-900 uppercase tracking-tighter">
              &copy; 2026 GearGuide. all copyrights are resrved.
            </p>
          </div>
        </div>
      </footer>

      {/* 
        =================
        BOTTOM TICKER BAR
        =================
      */}
      <div 
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-center h-12 z-50 overflow-hidden text-sm font-bold text-gray-700 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] cursor-help"
        onMouseEnter={() => setIsHoveringTicker(true)}
        onMouseLeave={() => setIsHoveringTicker(false)}
      >
        <div
          className="flex whitespace-nowrap"
          style={{ transform: `translateX(-${tickerOffset}%)` }}
        >
          {/* Duplicate ticker items */}
          {[1, 2, 3, 4, 5, 6].map((_, idx) => (
            <div key={idx} className="flex items-center space-x-12 px-6">
              <div className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-3"></span>
                <span className="text-gray-900 mr-2">System News:</span> Enhanced Superior AI Agent v3 loaded for all registered companies.
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-teal-500 mr-3"></span>
                <span className="text-gray-900 mr-2">Hardware Update:</span> Inventory Machine protocol now supports Series-X Lathes.
              </div>
            </div>
          ))}
        </div>
      </div>
      <IntegratedBot />
    </div>
  );
};

// --- INTEGRATED BOT COMPONENT ---

const IntegratedBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Welcome to the GearGuide Command Center. I am your generative assistant. How may I serve your mission protocols today?", isInitial: true }
  ]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const knowledgeBase = {
    "help": "I can help you navigate the GearGuide portal. You can register your company, access the AI Sentinel dashboard, manage inventory machines, or view real-time maintenance logs. Which sector shall we initialize?",
    "contact": "Our strategic support team is available at onboard@gearguide.ai or via our direct line: 1800 103 0222. Mission support is primary.",
    "portal": "The GearGuide portal is a unified industrial operating system. It synchronizes IoT hardware (Inventory Machines) with neural-link software (Superior AI Agent) to eliminate unplanned downtime.",
    "how_it_works": "GearGuide was engineered to solve the 'Black Box' problem in manufacturing. It works by ingesting raw telemetry (Torque, Heat, Vibration), processing it through our proprietary NN-Grok model, and delivering deterministic failure windows before they occur. This ensures 99.9% facility uptime."
  };

  const initialQuestions = [
    { id: 'help', label: 'Help' },
    { id: 'contact', label: 'Contact Us' },
    { id: 'portal', label: 'Portal Related Questions' },
    { id: 'how_it_works', label: 'Why this portal created and how it works', highlighted: true }
  ];

  const speak = (text) => {
    if (isMuted) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Select a smooth, high-quality voice
    const voices = window.speechSynthesis.getVoices();
    // Prioritize natural sounding voices: Google UK female, Google US, or similar
    const preferredVoice = voices.find(v => v.name.includes("Google UK English Female")) || 
                           voices.find(v => v.name.includes("Google US English")) || 
                           voices.find(v => v.name.includes("Natural")) ||
                           voices.find(v => v.lang === "en-GB") ||
                           voices[0];
    
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.rate = 1.05; // Slightly faster for modern crisp feeling
    utterance.pitch = 1.0; 
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleQuestionClick = (q) => {
    const answer = knowledgeBase[q.id];
    setMessages(prev => [...prev, 
      { role: 'user', text: q.label },
      { role: 'bot', text: answer }
    ]);
    speak(answer);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const userMsg = inputValue.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputValue('');
    
    // Simple response logic for custom queries
    setTimeout(() => {
      const response = "Processing request through Sentinel Core... Analyzing protocols. For specific data, please use our authenticated dashboard.";
      setMessages(prev => [...prev, { role: 'bot', text: response }]);
      speak(response);
    }, 600);
  };

  return (
    <div className="fixed bottom-20 right-8 z-[100] font-inter">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-[420px] bg-[#0A1118] border border-blue-900/50 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col"
          >
            {/* Bot Header */}
            <div className="p-6 bg-gradient-to-r from-blue-900 to-black flex justify-between items-center text-white border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-500/30">
                  <Bot size={24} className="text-blue-400" />
                </div>
                <div>
                  <h4 className="font-black uppercase tracking-widest text-[10px] text-blue-400">Generative Assistant</h4>
                  <p className="text-xl font-black tracking-tighter">GearGuide AI</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-2 rounded-lg transition-colors ${isMuted ? 'text-red-400 bg-red-400/10' : 'text-gray-400 hover:bg-white/5'}`}
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-6 h-[400px] overflow-y-auto space-y-6 scrollbar-hide">
              {messages.map((msg, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-[1.5rem] text-sm font-bold leading-relaxed shadow-lg ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-white/5 text-gray-200 border border-white/5 rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                  
                  {msg.isInitial && (
                    <div className="mt-6 w-full space-y-3">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Protocol Directives:</p>
                      <div className="grid grid-cols-1 gap-2">
                        {initialQuestions.map((q) => (
                          <button
                            key={q.id}
                            onClick={() => handleQuestionClick(q)}
                            className={`px-4 py-3 rounded-2xl text-left text-xs font-black transition-all hover:scale-[1.02] active:scale-95 border ${
                              q.highlighted 
                                ? 'bg-blue-600 text-white border-blue-400 shadow-[0_10px_20px_rgba(59,130,246,0.3)]' 
                                : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                            }`}
                          >
                            {q.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Speaking Hud */}
            {isSpeaking && (
               <div className="px-6 py-2 bg-blue-600 flex items-center justify-between text-white text-[10px] font-black uppercase tracking-widest">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      {[1,2,3,4].map(i => <div key={i} className="w-1 h-3 bg-white rounded-full animate-bounce" style={{animationDelay: `${i*0.1}s`}}></div>)}
                    </div>
                    Neural Voice Active...
                  </div>
                  <button onClick={stopSpeaking} className="flex items-center gap-1 bg-black/20 px-2 py-1 rounded-md hover:bg-black/40">
                    <StopCircle size={12} /> Close Speak
                  </button>
               </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-black/40 border-t border-white/5 flex gap-3">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Direct neural query..." 
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-600" 
              />
              <button 
                onClick={handleSend}
                className="p-3 bg-blue-600 rounded-2xl text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/40"
              >
                <Send size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger */}
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`h-16 w-16 rounded-[2rem] flex items-center justify-center shadow-2xl transition-all ${
          isOpen ? 'bg-red-500 rotate-90' : 'bg-blue-600'
        }`}
      >
        {isOpen ? <X size={28} className="text-white" /> : <MessageSquare size={28} className="text-white" />}
      </motion.button>
    </div>
  );
};

export default LandingPage;
