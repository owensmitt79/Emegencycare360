import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';
import { useDoctorAuth } from '@/contexts/DoctorAuthContext.jsx';
import { Stethoscope, Eye, EyeOff, Chrome, Sparkles, Loader2, ArrowRight, X } from 'lucide-react';
import apiClient from '@/lib/apiClient.js';

const DoctorLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, oneTapLogin } = useDoctorAuth();
  const navigate = useNavigate();

  const [showAccountDrawer, setShowAccountDrawer] = useState(false);
  const [isProcessingQuickAuth, setIsProcessingQuickAuth] = useState(false);
  const [liveAccounts, setLiveAccounts] = useState([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await apiClient.getLiveAccounts();
        if (response.success && response.accounts) {
          const doctorAccounts = response.accounts
            .filter(acc => acc.role === 'doctor')
            .map(acc => {
              const nameParts = acc.full_name.split(' ');
              const initial = nameParts[0] ? nameParts[0][0].toUpperCase() : 'D';
              const colors = ['bg-blue-600', 'bg-indigo-600', 'bg-violet-600', 'bg-purple-600'];
              const charCodeSum = acc.email.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
              const avatarColor = colors[charCodeSum % colors.length];

              return {
                fullName: acc.full_name,
                email: acc.email,
                avatarColor,
                initial,
                phone: acc.phone || ''
              };
            });
          setLiveAccounts(doctorAccounts);
        }
      } catch (err) {
        console.error('Failed to load live accounts:', err);
      }
    };
    fetchAccounts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back, Doctor!', { description: 'Redirecting to your dashboard…' });
      navigate('/doctors/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      const msg = error?.message || '';
      if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
        toast.error('Cannot reach the server', {
          description: 'Make sure the database is running and connected.',
        });
      } else {
        toast.error('Invalid email or password', {
          description: 'Please check your credentials and try again.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (account) => {
    setShowAccountDrawer(false);
    setIsProcessingQuickAuth(true);
    const toastId = toast.loading(`Connecting doctor session for ${account.email}...`);
    
    try {
      const result = await oneTapLogin(account.email, account.fullName, account.phone);
      if (result.success) {
        toast.success('Welcome back, Doctor!', {
          id: toastId,
          description: `Logged in as ${account.fullName}. Redirecting...`
        });
        navigate('/doctors/dashboard');
      } else {
        toast.error(result.error || 'Failed to authenticate.', { id: toastId });
      }
    } catch (err) {
      toast.error('Quick login encountered an error.', { id: toastId });
      console.error(err);
    } finally {
      setIsProcessingQuickAuth(false);
    }
  };

  const handleGenerateTestAccounts = async () => {
    const toastId = toast.loading('Generating fresh test accounts in database...');
    try {
      const response = await apiClient.generateTestAccounts();
      if (response.success) {
        toast.success(response.message, { id: toastId });
        const fetchResponse = await apiClient.getLiveAccounts();
        if (fetchResponse.success && fetchResponse.accounts) {
          const doctorAccounts = fetchResponse.accounts
            .filter(acc => acc.role === 'doctor')
            .map(acc => {
              const nameParts = acc.full_name.split(' ');
              const initial = nameParts[0] ? nameParts[0][0].toUpperCase() : 'D';
              const colors = ['bg-blue-600', 'bg-indigo-600', 'bg-violet-600', 'bg-purple-600'];
              const charCodeSum = acc.email.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
              const avatarColor = colors[charCodeSum % colors.length];

              return {
                fullName: acc.full_name,
                email: acc.email,
                avatarColor,
                initial,
                phone: acc.phone || ''
              };
            });
          setLiveAccounts(doctorAccounts);
        }
      } else {
        toast.error(response.error || 'Failed to generate accounts.', { id: toastId });
      }
    } catch (err) {
      toast.error('Encountered an error generating test accounts.', { id: toastId });
      console.error(err);
    }
  };

  return (
    <>
      <Helmet>
        <title>Doctor Portal Login | Emergencycare360</title>
        <meta name="description" content="Secure login portal for registered Emergencycare360 doctors." />
      </Helmet>

      <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
        
        {/* Simple Header */}
        <div className="w-full px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-[#2563eb]" />
            <span className="font-bold text-gray-900 text-lg tracking-tight">Emergencycare360</span>
          </div>
          <Link to="/" className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
            Back to Home
          </Link>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col items-center pt-16 px-4">
          
          <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
            <h1 className="text-[28px] font-bold text-gray-900 mb-2 tracking-tight">Doctor Portal</h1>
            <p className="text-gray-500 text-sm mb-8 font-medium">Sign in to access your medical dashboard</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="doctor-email">
                  Email address
                </label>
                <input
                  id="doctor-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@example.com"
                  className="w-full px-4 py-3 rounded-md bg-white border border-gray-200 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-semibold text-gray-700" htmlFor="doctor-password">
                    Password
                  </label>
                  <a href="#" className="text-sm font-medium text-[#2563eb] hover:text-[#1d4ed8] transition-colors">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="doctor-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-4 pr-12 py-3 rounded-md bg-white border border-gray-200 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading || isProcessingQuickAuth}
                id="doctor-login-btn"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-md font-bold text-white text-sm bg-[#2563eb] hover:bg-[#1d4ed8] transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Sign in to Dashboard'
                )}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-400 font-medium">Or connect instantly</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-md font-bold text-gray-700 text-sm bg-white border border-gray-200 hover:bg-gray-50 active:scale-95 transition-all shadow-sm duration-100"
              onClick={() => setShowAccountDrawer(true)}
              disabled={isLoading || isProcessingQuickAuth}
            >
              {isProcessingQuickAuth ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#2563eb] mr-1" />
              ) : (
                <Chrome className="w-4 h-4 text-gray-500 mr-1" />
              )}
              {isProcessingQuickAuth ? 'Connecting...' : 'Choose Saved Email from Phone'}
            </button>

            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center justify-center gap-3 text-sm text-gray-500 font-medium">
              <div>
                Not registered yet?{' '}
                <Link to="/doctors/register" className="text-[#2563eb] hover:text-[#1d4ed8] transition-colors">
                  Apply to join
                </Link>
              </div>
              <div className="text-gray-400">
                Are you an admin?{' '}
                <Link to="/admin/login" className="text-gray-500 hover:text-gray-700 transition-colors">
                  Admin Portal
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Google-Style Saved Email Centered Modal */}
      {showAccountDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-300 animate-fade-in">
          <div className="absolute inset-0" onClick={() => setShowAccountDrawer(false)} />
          
          <div className="relative w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-2xl p-6 pb-8 transform transition-all duration-300 animate-in fade-in zoom-in-95 flex flex-col z-10 font-sans">
            {/* Close Button */}
            <button 
              onClick={() => setShowAccountDrawer(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-lg hover:bg-gray-50 active:scale-95 duration-100"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6 pr-8">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                <Chrome className="w-5 h-5 text-[#2563eb]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-1.5">
                  Choose an account <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                </h3>
                <p className="text-xs text-gray-500">to continue to Emergencycare360 Doctor Portal</p>
              </div>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {liveAccounts.map((account, index) => (
                <button
                  key={index}
                  type="button"
                  className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-gray-50 active:bg-gray-100 border border-transparent hover:border-gray-100 transition-all duration-200 text-left group"
                  onClick={() => handleQuickLogin(account)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-inner transition-transform group-hover:scale-105 duration-200 ${account.avatarColor}`}>
                      {account.initial}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900 group-hover:text-[#2563eb] transition-colors duration-200">
                        {account.fullName}
                      </p>
                      <p className="text-xs text-gray-500 font-mono">
                        {account.email}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#2563eb] transition-all group-hover:translate-x-1 duration-200" />
                </button>
              ))}
              {liveAccounts.length === 0 && (
                <p className="text-center text-sm text-gray-500 py-4">No saved doctor accounts found in database.</p>
              )}
            </div>

            <div className="mt-4 border-t border-gray-100 pt-4">
              <button
                type="button"
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-left transition-colors"
                onClick={() => {
                  setShowAccountDrawer(false);
                  toast.info("Standard form is ready for manual credentials.");
                }}
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                  +
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">Use another account</p>
                  <p className="text-xs text-gray-500">Sign in with email and password</p>
                </div>
              </button>

              <button
                type="button"
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-left transition-colors group mt-2"
                onClick={handleGenerateTestAccounts}
              >
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#2563eb] font-bold group-hover:scale-105 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900 group-hover:text-[#2563eb] transition-colors">Generate Fresh Test Accounts</p>
                  <p className="text-xs text-gray-500">Auto-create new Patient, Doctor & Dispatcher</p>
                </div>
              </button>
            </div>

            <p className="text-[10px] text-gray-400 mt-6 text-center leading-relaxed px-4">
              To proceed automatically, Google or your Device Manager will share your name, email address, language preference, and profile picture with Emergencycare360. Review our <a href="#" className="underline text-[#2563eb] hover:text-[#1d4ed8]">Privacy Policy</a>.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default DoctorLoginPage;