import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserCircle, Chrome, Sparkles, Loader2, ArrowRight, X } from 'lucide-react';
import apiClient from '@/lib/apiClient.js';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, oneTapLoginRegister, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showAccountDrawer, setShowAccountDrawer] = useState(false);
  const [isProcessingQuickAuth, setIsProcessingQuickAuth] = useState(false);
  const [liveAccounts, setLiveAccounts] = useState([]);

  // If user came from a protected route, redirect back; otherwise go to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await apiClient.getLiveAccounts();
        if (response.success && response.accounts) {
          const patientAccounts = response.accounts
            .filter(acc => acc.role === 'patient' || acc.role === 'user' || acc.role === 'dispatcher')
            .map(acc => {
              const nameParts = acc.full_name.split(' ');
              const initial = nameParts[0] ? nameParts[0][0].toUpperCase() : 'U';
              const colors = ['bg-purple-600', 'bg-emerald-600', 'bg-sky-600', 'bg-amber-600', 'bg-rose-600'];
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
          setLiveAccounts(patientAccounts);
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

    const result = await login(email, password);
    if (result.success) {
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } else {
      toast.error(result.error);
    }
  };

  const handleQuickLogin = async (account) => {
    setShowAccountDrawer(false);
    setIsProcessingQuickAuth(true);
    const toastId = toast.loading(`Connecting secure session for ${account.email}...`);
    
    try {
      const result = await oneTapLoginRegister(account.email, account.fullName, account.phone);
      if (result.success) {
        toast.success('Successfully logged in!', {
          id: toastId,
          description: `Welcome back, ${account.fullName}! Redirecting to dashboard...`
        });
        navigate(from, { replace: true });
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
          const patientAccounts = fetchResponse.accounts
            .filter(acc => acc.role === 'patient' || acc.role === 'user' || acc.role === 'dispatcher')
            .map(acc => {
              const nameParts = acc.full_name.split(' ');
              const initial = nameParts[0] ? nameParts[0][0].toUpperCase() : 'U';
              const colors = ['bg-purple-600', 'bg-emerald-600', 'bg-sky-600', 'bg-amber-600', 'bg-rose-600'];
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
          setLiveAccounts(patientAccounts);
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
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-[#f8fafc] py-16 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Login | Emergencycare360</title>
      </Helmet>
      
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center mb-5">
            <UserCircle className="h-6 w-6 text-[#2563eb]" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Sign in to access your medical profile and emergency history
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-slate-700">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-3 rounded-md bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</Label>
                <a href="#" className="text-sm font-semibold text-[#2563eb] hover:text-[#1d4ed8] hover:underline transition-all">
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-md bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full py-3.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold rounded-lg transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed text-sm"
            disabled={loading || isProcessingQuickAuth}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-100" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">Or connect instantly</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center gap-2 py-3.5 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-bold rounded-lg transition-all shadow-sm active:scale-98 text-sm"
          onClick={() => setShowAccountDrawer(true)}
          disabled={loading || isProcessingQuickAuth}
        >
          {isProcessingQuickAuth ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#2563eb] mr-1" />
          ) : (
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.37 0 3.393 2.68 1.488 6.59l3.778 3.175z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.275c0-.825-.075-1.62-.213-2.388H12v4.513h6.45a5.52 5.52 0 0 1-2.396 3.619v3.01h3.877c2.269-2.09 3.559-5.166 3.559-8.754z"
              />
              <path
                fill="#FBBC05"
                d="M5.266 14.235A7.054 7.054 0 0 1 4.909 12c0-.79.13-1.554.357-2.265L1.488 6.59A11.968 11.968 0 0 0 0 12c0 1.92.455 3.73 1.258 5.345l4.008-3.11z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.955-1.077 7.94-2.915l-3.877-3.01c-1.077.72-2.455 1.15-4.063 1.15-3.13 0-5.782-2.118-6.728-4.968L1.258 17.37A11.966 11.966 0 0 0 12 24z"
              />
            </svg>
          )}
          {isProcessingQuickAuth ? 'Connecting...' : 'Choose Saved Email from Phone'}
        </Button>

        <div className="mt-8 border-t border-slate-100 pt-6 text-center space-y-3">
          <p className="text-sm text-slate-500 font-medium">
            Don't have an account?{' '}
            <Link to="/signup" className="font-bold text-[#2563eb] hover:text-[#1d4ed8] hover:underline transition-all">
              Create an account
            </Link>
          </p>
          
          <p className="text-xs text-slate-400 font-medium">
            Are you a medical professional?{' '}
            <Link to="/doctors/login" className="font-bold text-[#2563eb] hover:text-[#1d4ed8] hover:underline transition-all">
              Doctor Portal
            </Link>
          </p>
        </div>
      </div>

      {/* Google-Style Saved Email Centered Modal */}
      {showAccountDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-300 animate-fade-in">
          {/* Backdrop click to close */}
          <div className="absolute inset-0" onClick={() => setShowAccountDrawer(false)} />
          
          <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-2xl p-6 pb-8 transform transition-all duration-300 animate-in fade-in zoom-in-95 flex flex-col z-10 font-sans">
            {/* Close Button */}
            <button 
              onClick={() => setShowAccountDrawer(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-lg hover:bg-slate-50 active:scale-95 duration-100"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6 pr-8">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                <Chrome className="w-5 h-5 text-[#2563eb]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                  Choose an account <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                </h3>
                <p className="text-xs text-slate-500">to continue to Emergencycare360</p>
              </div>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {liveAccounts.map((account, index) => (
                <button
                  key={index}
                  type="button"
                  className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-slate-50 active:bg-slate-100 border border-transparent hover:border-slate-100 transition-all duration-200 text-left group"
                  onClick={() => handleQuickLogin(account)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-inner transition-transform group-hover:scale-105 duration-200 ${account.avatarColor}`}>
                      {account.initial}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-900 group-hover:text-[#2563eb] transition-colors duration-200">
                        {account.fullName}
                      </p>
                      <p className="text-xs text-slate-500 font-mono">
                        {account.email}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#2563eb] transition-all group-hover:translate-x-1 duration-200" />
                </button>
              ))}
              {liveAccounts.length === 0 && (
                <p className="text-center text-sm text-slate-500 py-4">No saved accounts found in database.</p>
              )}
            </div>

            <div className="mt-4 border-t border-slate-100 pt-4">
              <button
                type="button"
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-left transition-colors"
                onClick={() => {
                  setShowAccountDrawer(false);
                  toast.info("Standard form is ready for manual credentials below.");
                }}
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                  +
                </div>
                <div>
                  <p className="font-semibold text-sm text-slate-900">Use another account</p>
                  <p className="text-xs text-slate-500">Sign in with email and password</p>
                </div>
              </button>

              <button
                type="button"
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-left transition-colors group mt-2"
                onClick={handleGenerateTestAccounts}
              >
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#2563eb] font-bold group-hover:scale-105 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-slate-900 group-hover:text-[#2563eb] transition-colors">Generate Fresh Test Accounts</p>
                  <p className="text-xs text-slate-500">Auto-create new Patient, Doctor & Dispatcher</p>
                </div>
              </button>
            </div>

            <p className="text-[10px] text-slate-400 mt-6 text-center leading-relaxed px-4">
              To proceed automatically, Google or your Device Manager will share your name, email address, language preference, and profile picture with Emergencycare360. Review our <a href="#" className="underline text-[#2563eb] hover:text-[#1d4ed8]">Privacy Policy</a>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
