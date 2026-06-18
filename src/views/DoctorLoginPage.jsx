import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';
import { useDoctorAuth } from '@/contexts/DoctorAuthContext.jsx';
import { Stethoscope, Eye, EyeOff, ShieldCheck } from 'lucide-react';

const DoctorLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useDoctorAuth();
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
      toast.success('Welcome back, Doctor!', { description: 'Redirecting to your dashboard…' });
      navigate('/doctors/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      const msg = error?.message || '';
      if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
        toast.error('Cannot reach the server', {
          description: 'Make sure PocketBase is running at http://localhost:8090',
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
        <title>Doctor Portal Login | Emergencycare360</title>
        <meta name="description" content="Secure login portal for registered Emergencycare360 doctors." />
      </Helmet>

      <div className="min-h-screen bg-[#fdfdfd] flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
        
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
          
          <div className="w-full max-w-sm">
            <h1 className="text-[28px] font-bold text-gray-900 mb-2 tracking-tight">Doctor Portal</h1>
            <p className="text-gray-500 text-sm mb-8">Sign in to access your medical dashboard</p>



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
                disabled={isLoading}
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
    </>
  );
};

export default DoctorLoginPage;