import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('admin@test.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome, Admin!', { description: 'Redirecting to dashboard…' });
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      const msg = error?.message || '';
      if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
        toast.error('Cannot reach the server', {
          description: 'Make sure the Express server is running on port 3001',
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

  return (
    <>
      <Helmet>
        <title>Admin Login | Emergencycare360</title>
        <meta name="description" content="Admin login portal for Emergencycare360 system management." />
      </Helmet>

      <div className="min-h-[calc(100vh-4rem)] relative flex items-center justify-center py-12 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a0a2e 0%, #2d1854 50%, #16213e 100%)' }}>

        {/* Decorative background */}
        <div className="absolute top-[-80px] left-[-80px] w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />
        <div className="absolute bottom-[-60px] right-[-60px] w-80 h-80 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #a855f7, transparent)' }} />

        <div className="relative z-10 w-full max-w-md">

          {/* Logo header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #a855f7)', boxShadow: '0 0 40px rgba(139,92,246,0.4)' }}>
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-1">Admin Portal</h1>
            <p className="text-slate-400 text-sm">System management & oversight</p>
          </div>

          {/* Glass card */}
          <div className="rounded-2xl p-8 border border-white/10 shadow-2xl backdrop-blur-xl"
            style={{ background: 'rgba(255,255,255,0.06)' }}>

            {/* Demo credentials */}
            <div className="mb-6 rounded-xl p-3 border border-purple-400/20 flex items-start gap-3"
              style={{ background: 'rgba(139,92,246,0.1)' }}>
              <ShieldCheck className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-purple-300 text-xs font-semibold uppercase tracking-wide">Demo Credentials Pre-filled</p>
                <p className="text-slate-400 text-xs mt-0.5">
                  Email: <span className="text-white font-mono">admin@test.com</span> &nbsp;|&nbsp;
                  Password: <span className="text-white font-mono">admin123</span>
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="admin-email">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="admin-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm outline-none transition-all focus:ring-2 focus:ring-purple-500/50"
                    style={{
                      background: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.12)',
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-slate-300" htmlFor="admin-password">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 rounded-xl text-white placeholder-slate-500 text-sm outline-none transition-all focus:ring-2 focus:ring-purple-500/50"
                    style={{
                      background: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.12)',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                id="admin-login-btn"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white text-sm transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                style={{
                  background: isLoading
                    ? 'rgba(139,92,246,0.5)'
                    : 'linear-gradient(135deg, #8b5cf6, #a855f7)',
                  boxShadow: isLoading ? 'none' : '0 0 24px rgba(139,92,246,0.4)',
                }}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign In to Admin
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Footer links */}
            <div className="mt-6 pt-6 border-t border-white/10 text-center space-y-3">
              <p className="text-xs text-slate-500">
                Are you a doctor?{' '}
                <Link to="/doctors/login" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Doctor Portal →
                </Link>
              </p>
              <p className="text-xs text-slate-500">
                Are you a patient?{' '}
                <Link to="/login" className="text-slate-400 hover:text-slate-200 transition-colors">
                  Patient Login →
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-slate-600 mt-6">
            © 2026 Emergencycare360. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
};

export default AdminLoginPage;
