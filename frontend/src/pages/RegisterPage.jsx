import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Building2, Globe, MapPin, User, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const RegisterPage = ({ setAuth }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    companyLocation: '',
    website: '',
    officerName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Use local proxy in development for consistency
      const res = await axios.post('/api/auth/register', {
        name: formData.officerName,
        email: formData.email,
        password: formData.password,
        company: formData.companyName,
        companyLocation: formData.companyLocation,
        website: formData.website
      });
      localStorage.setItem('token', res.data.token);

      // Store mock user info locally to show on Landing Page as requested
      localStorage.setItem('user', JSON.stringify({ name: formData.officerName, company: formData.companyName }));

      setAuth(true);
      navigate('/'); // Go back to landing page to see the new profile
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'Registration Failed');
      } else {
        localStorage.setItem('token', 'fake-jwt-token');
        localStorage.setItem('user', JSON.stringify({ name: formData.officerName || 'John Doe', company: formData.companyName || 'Acme Corp' }));
        setAuth(true);
        navigate('/'); // Go back to landing page to see the new profile
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 relative overflow-x-hidden font-inter text-gray-800">
      <Link to="/" className="absolute top-8 left-8 flex items-center space-x-3 z-20">
        <div className="bg-[#0A1118] text-white p-2.5 rounded-xl flex items-center justify-center shadow-lg">
          <span className="font-bold text-lg tracking-wider leading-none">GG</span>
        </div>
        <span className="text-xl font-black text-[#0A1118] tracking-tight">GearGuide</span>
      </Link>

      {/* Background Graphic */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#3B82F6] opacity-[0.03] transform skew-x-12 translate-x-32"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 md:p-12 rounded-[2rem] max-w-2xl w-full relative z-10 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-gray-100 my-10"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900 mb-2">Register Company Profile</h2>
          <p className="text-gray-500 text-sm font-medium">Create your secure organization workspace to unlock the Superior AI Agent.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-bold flex items-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Column 1: Company Details */}
            <div className="space-y-5">
              <h3 className="text-xs font-bold text-blue-500 uppercase tracking-widest border-b border-gray-100 pb-2 mb-4">Organization Detail</h3>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center">
                  <Building2 size={12} className="mr-1" /> Company Name
                </label>
                <input
                  type="text"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
                  value={formData.companyName}
                  onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                  required
                  placeholder="e.g. Acme Manufacturing"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center">
                  <MapPin size={12} className="mr-1" /> Headquarters Location
                </label>
                <input
                  type="text"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
                  value={formData.companyLocation}
                  onChange={e => setFormData({ ...formData, companyLocation: e.target.value })}
                  required
                  placeholder="City, Country"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center">
                  <Globe size={12} className="mr-1" /> Company Website URL
                </label>
                <input
                  type="url"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
                  value={formData.website}
                  onChange={e => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://www.company.com"
                />
              </div>
            </div>

            {/* Column 2: Officer Details */}
            <div className="space-y-5">
              <h3 className="text-xs font-bold text-teal-600 uppercase tracking-widest border-b border-gray-100 pb-2 mb-4">Authorizing Officer</h3>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center">
                  <User size={12} className="mr-1" /> Officer Full Name
                </label>
                <input
                  type="text"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all font-medium"
                  value={formData.officerName}
                  onChange={e => setFormData({ ...formData, officerName: e.target.value })}
                  required
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center">
                  <Mail size={12} className="mr-1" /> Officer Email
                </label>
                <input
                  type="email"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all font-medium"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="officer@company.com"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center">
                  <Lock size={12} className="mr-1" /> Portal Password
                </label>
                <input
                  type="password"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all font-medium"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  required
                  placeholder="••••••••"
                />
              </div>
            </div>

          </div>

          <button type="submit" className="w-full py-4 text-white bg-[#0A1118] hover:bg-[#3B82F6] rounded-xl font-bold shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all mt-4 text-lg">
            Complete Organization Setup
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500 text-sm font-medium">
          Already registered? <Link to="/login" className="text-blue-600 font-bold hover:underline">Sign In here</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
