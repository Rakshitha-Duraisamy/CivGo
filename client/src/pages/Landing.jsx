import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Hexagon, Mail, Lock, Eye, EyeOff, ArrowRight, User, ShieldCheck, Copy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Landing() {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [role, setRole] = useState('citizen'); // 'citizen' or 'admin'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleDemoFill = () => {
    if (role === 'admin') {
      setEmail('admin@civic.com');
      setPassword('admin123');
    } else {
      setEmail('priya.mehta@civgo.in');
      setPassword('password123');
    }
    toast.success('Demo credentials autofilled');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (activeTab === 'login') {
        const loggedInUser = await login(email, password);
        toast.success('Logged in successfully!');
        navigate(loggedInUser.role === 'admin' ? '/admin' : '/dashboard');
      } else {
        await register({ name, email, password, role: role });
        toast.success('Account created successfully!');
        // Login immediately after register if possible, or redirect
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${activeTab}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative min-h-screen flex flex-col lg:flex-row">
        
        {/* Left Side: Gradient Hero */}
        <div className="lg:w-[45%] w-full bg-gradient-to-br from-blue-600 to-cyan-500 flex flex-col justify-center px-8 lg:px-16 py-16 text-white relative overflow-hidden">
          {/* Logo */}
          <div className="absolute top-8 left-8 lg:left-12 flex items-center gap-3 z-20">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg border border-white/20">
              <Hexagon className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-white leading-none mb-1">Civgo</div>
              <div className="text-xs text-blue-100/80 font-medium tracking-wide">Smart Citizen Services</div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
          
          <div className="relative z-10 max-w-xl mt-12 lg:mt-0">
            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Your city, <br />
              your voice.
            </h1>
            <p className="text-lg text-blue-50 mb-10 leading-relaxed max-w-md">
              Report public infrastructure issues in seconds. Track resolutions in real time. Make your neighbourhood better — together.
            </p>

            <div className="flex gap-4 mb-10">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 flex-1 shadow-lg shadow-blue-900/10">
                <div className="text-2xl font-bold mb-1">48,200+</div>
                <div className="text-xs text-blue-100 font-medium">Complaints Filed</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 flex-1 shadow-lg shadow-blue-900/10">
                <div className="text-2xl font-bold mb-1">91%</div>
                <div className="text-xs text-blue-100 font-medium">Resolution Rate</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 flex-1 shadow-lg shadow-blue-900/10 hidden sm:block">
                <div className="text-2xl font-bold mb-1">3.2 days</div>
                <div className="text-xs text-blue-100 font-medium">Avg. Resolution</div>
              </div>
            </div>

            <div className="space-y-3.5">
              {[
                'GPS-tagged complaint submission',
                'Before & after image proof system',
                'Real-time status notifications',
                'Department assignment & tracking'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-blue-50 font-medium">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full border border-blue-300 flex items-center justify-center">
                    <Check className="h-3 w-3 text-blue-200" strokeWidth={3} />
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="lg:w-[55%] w-full bg-[#f8fafc] flex flex-col justify-center px-8 lg:px-24 py-12 relative overflow-y-auto">
          <div className="max-w-[420px] w-full mx-auto">
            
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                {activeTab === 'login' ? 'Sign in to your account' : 'Create your account'}
              </h2>
              <p className="text-slate-500 text-sm">
                {activeTab === 'login' ? 'Enter your credentials to access your dashboard.' : 'Sign up to start reporting and tracking issues.'}
              </p>
            </div>

            {/* Toggle Sign In / Register */}
            <div className="bg-slate-200/70 p-1.5 rounded-xl flex mb-8">
              <button 
                type="button"
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Sign In
              </button>
              <button 
                type="button"
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Register
              </button>
            </div>

            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div 
                onClick={() => setRole('citizen')}
                className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${role === 'citizen' ? 'border-blue-500 bg-blue-50/50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}
              >
                <div className="flex items-center gap-2.5 mb-1.5">
                  <User className={`w-5 h-5 ${role === 'citizen' ? 'text-blue-600' : 'text-slate-500'}`} />
                  <span className={`font-semibold text-sm ${role === 'citizen' ? 'text-blue-900' : 'text-slate-700'}`}>Citizen</span>
                </div>
                <div className="text-xs text-slate-500 ml-7">Report & track issues</div>
              </div>

              <div 
                onClick={() => setRole('admin')}
                className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${role === 'admin' ? 'border-blue-500 bg-blue-50/50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}
              >
                <div className="flex items-center gap-2.5 mb-1.5">
                  <ShieldCheck className={`w-5 h-5 ${role === 'admin' ? 'text-blue-600' : 'text-slate-500'}`} />
                  <span className={`font-semibold text-sm ${role === 'admin' ? 'text-blue-900' : 'text-slate-700'}`}>Admin</span>
                </div>
                <div className="text-xs text-slate-500 ml-7">Manage & resolve</div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {activeTab === 'register' && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input 
                      type="text" 
                      required 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-[#f1f5f9] border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-800 placeholder-slate-400"
                      placeholder="John Doe" 
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-[#f1f5f9] border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-800 placeholder-slate-400"
                    placeholder="you@example.com" 
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-semibold text-slate-700">Password</label>
                  {activeTab === 'login' && (
                    <Link to="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                      Forgot password?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3 bg-[#f1f5f9] border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-800 placeholder-slate-400"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {activeTab === 'login' && (
                <div className="flex items-center pt-1">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded cursor-pointer"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-slate-500 cursor-pointer">
                    Keep me signed in for 30 days
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0052cc] hover:bg-[#0047b3] text-white font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 transition-all shadow-md shadow-blue-600/20 mt-4"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>{activeTab === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight className="h-5 w-5" /></>
                )}
              </button>
            </form>

            {/* Demo Credentials Section */}
            {activeTab === 'login' && (
              <div className="mt-8 bg-[#f8fafc] border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <ShieldCheck className="w-4 h-4 text-blue-600" /> Demo Credentials
                  </div>
                  <div className="text-xs text-slate-400 font-medium">Click "Use" to autofill</div>
                </div>
                <div className="p-4 flex items-center justify-between bg-white">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">{role}</span>
                    </div>
                    <div className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      {role === 'admin' ? 'admin@civic.com' : 'priya.mehta@civgo.in'} 
                      <Copy className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-slate-600" onClick={() => {
                        navigator.clipboard.writeText(role === 'admin' ? 'admin@civic.com' : 'priya.mehta@civgo.in');
                        toast.success('Email copied');
                      }}/>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={handleDemoFill}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2 rounded-lg transition-colors shadow-sm shadow-blue-600/20"
                  >
                    Use
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>
    </div>
  );
}
