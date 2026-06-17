import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from '@/components/Logo.jsx';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAdminAuth();
  const router = useRouter();

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
      router.push('/admin/dashboard');
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

      <div className="relative min-h-screen flex flex-col font-sans selection:bg-green-100 selection:text-green-900 bg-[#0f172a]">
        
        {/* Animated Background Effect */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-[#219653] to-blue-600 blur-[120px] mix-blend-screen"
          />
          <motion.div 
            animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-[30%] -right-[10%] w-[50%] h-[60%] rounded-full bg-gradient-to-tl from-blue-600 to-[#219653] blur-[120px] mix-blend-screen"
          />
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px]"></div>
        </div>

        {/* Simple Header */}
        <div className="relative z-10 w-full px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo className="w-14 h-14" />
            <span className="font-bold text-white text-xl tracking-tight">Emergencycare<span className="text-gray-300">360</span></span>
          </div>
          <Link href="/" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors bg-white/10 px-5 py-2.5 rounded-full backdrop-blur-md border border-white/10 hover:bg-white/20">
            Back to Home
          </Link>
        </div>

        {/* Main Content Area */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md bg-white rounded-[24px] shadow-2xl p-8 md:p-10 border border-gray-100"
          >
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mx-auto mb-6">
                <Logo className="w-28 h-28" />
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Admin Portal</h1>
              <p className="text-gray-500 font-medium">Sign in to manage your system</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5" htmlFor="admin-email">
                  Email address
                </label>
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-[#219653] focus:ring-2 focus:ring-[#219653]/20 transition-all focus:bg-white"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-bold text-gray-700" htmlFor="admin-password">
                    Password
                  </label>
                  <a href="#" className="text-sm font-bold text-[#219653] hover:text-[#1e874b] transition-colors">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-4 pr-12 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-[#219653] focus:ring-2 focus:ring-[#219653]/20 transition-all focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                id="admin-login-btn"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white text-sm bg-[#219653] hover:bg-[#1e874b] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-6 shadow-lg shadow-green-600/20 hover:shadow-green-600/40 hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Login to your account'
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-sm text-gray-500 font-medium">
              Are you a doctor? 
              <Link href="/doctors/login" className="text-[#219653] font-bold hover:text-[#1e874b] transition-colors">
                Doctor Portal
              </Link>
            </div>

          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AdminLoginPage;
