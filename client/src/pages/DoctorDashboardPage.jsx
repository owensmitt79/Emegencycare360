import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import { useDoctorAuth } from '@/contexts/DoctorAuthContext.jsx';
import { toast } from 'sonner';
import apiClient from '@/lib/apiClient.js';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  LogOut, User, Calendar, Clock, Video, Phone, MessageCircle,
  Star, Activity, AlertCircle, Stethoscope, TrendingUp, Users,
  CheckCircle, XCircle, BarChart2, Bell, Settings, ChevronRight,
  Heart, Zap, Award, Shield, Plus, FileText, RefreshCw,
  CreditCard, Loader2, Lock
} from 'lucide-react';

// ── Helpers ──────────────────────────────────────────────────────────────────

const StatCard = ({ icon: Icon, label, value, sub, color = '#3b82f6', dark }) => (
  <div
    className="rounded-2xl p-5 flex flex-col gap-3 border transition-all duration-300 hover:scale-[1.02]"
    style={{
      background: dark
        ? `linear-gradient(135deg, ${color}22, ${color}11)`
        : 'rgba(255,255,255,0.04)',
      border: `1px solid ${color}30`,
      boxShadow: `0 0 0 0 ${color}00`,
    }}
  >
    <div className="flex items-center justify-between">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: `${color}22` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: `${color}bb` }}>
        {label}
      </span>
    </div>
    <div>
      <p className="text-3xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
    </div>
  </div>
);

const ToggleSwitch = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className="relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none"
    style={{ background: checked ? 'linear-gradient(90deg, #3b82f6, #06b6d4)' : 'rgba(255,255,255,0.1)' }}
  >
    <span
      className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300"
      style={{ transform: checked ? 'translateX(24px)' : 'translateX(0)' }}
    />
  </button>
);

const Badge = ({ children, color = '#10b981' }) => (
  <span
    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
    style={{ background: `${color}22`, color }}
  >
    {children}
  </span>
);

// Sample consultation requests for display
const SAMPLE_REQUESTS = [
  {
    id: 1,
    patient: 'Amaka O.',
    age: 34,
    type: 'Chat',
    urgency: 'High',
    symptoms: 'Chest pain, shortness of breath',
    time: '2 min ago',
    avatar: 'AO',
  },
  {
    id: 2,
    patient: 'Emeka N.',
    age: 28,
    type: 'Video',
    urgency: 'Medium',
    symptoms: 'Fever, body aches, headache',
    time: '8 min ago',
    avatar: 'EN',
  },
  {
    id: 3,
    patient: 'Fatima B.',
    age: 52,
    type: 'Voice',
    urgency: 'Low',
    symptoms: 'Persistent cough for 3 days',
    time: '15 min ago',
    avatar: 'FB',
  },
];

const urgencyColors = {
  High: '#ef4444',
  Medium: '#f59e0b',
  Low: '#10b981',
  Critical: '#8b5cf6',
};

const typeIcons = {
  Chat: MessageCircle,
  Video: Video,
  Voice: Phone,
};

// ── Doctor Payment Gate Component ─────────────────────────────────────────────
const DoctorPaymentGate = ({ doctor, onSuccess, onLogout }) => {
  const [processing, setProcessing] = useState(false);
  const [cardData, setCardData] = useState({
    name: '',
    number: '',
    expiry: '',
    cvv: '',
  });

  const formatCard = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const handlePay = async (e) => {
    e.preventDefault();
    if (!cardData.name || !cardData.number || !cardData.expiry || !cardData.cvv) {
      toast.error('Please fill in all card details.');
      return;
    }

    setProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const response = await apiClient.payDoctorRegistrationFee();
      onSuccess(response.record);
    } catch (err) {
      toast.error(err.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" 
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #0c1a30 100%)' }}>
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl" />

        <div className="text-center mb-8 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
            <CreditCard className="w-6 h-6 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Registration Fee Required</h2>
          <p className="text-slate-400 text-sm">
            To activate your doctor profile and begin consulting, please make a one-time network registration payment of ₦5,000.
          </p>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 mb-6 relative z-10">
          <div className="flex justify-between items-center text-sm mb-2 text-slate-400">
            <span>Provider Verification Fee</span>
            <span className="font-semibold text-white">₦5,000.00</span>
          </div>
          <div className="flex justify-between items-center text-xs text-slate-500">
            <span>Status</span>
            <span className="text-amber-500 font-semibold">Payment Pending</span>
          </div>
        </div>

        <form onSubmit={handlePay} className="space-y-4 relative z-10">
          <div>
            <Label htmlFor="cardName" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Cardholder Name</Label>
            <Input
              id="cardName"
              placeholder="Dr. Jane Doe"
              value={cardData.name}
              onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
              className="mt-1 text-white bg-slate-950 border-slate-800 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <Label htmlFor="cardNumber" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Card Number</Label>
            <div className="relative mt-1">
              <Input
                id="cardNumber"
                placeholder="4242 4242 4242 4242"
                value={cardData.number}
                onChange={(e) => setCardData({ ...cardData, number: formatCard(e.target.value) })}
                className="pr-10 text-white bg-slate-950 border-slate-800 focus:border-blue-500 focus:ring-blue-500/20 font-mono"
                maxLength={19}
              />
              <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiry" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Expiry Date</Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                value={cardData.expiry}
                onChange={(e) => setCardData({ ...cardData, expiry: formatExpiry(e.target.value) })}
                className="mt-1 text-white bg-slate-950 border-slate-800 focus:border-blue-500 focus:ring-blue-500/20 font-mono"
                maxLength={5}
              />
            </div>
            <div>
              <Label htmlFor="cvv" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">CVV</Label>
              <Input
                id="cvv"
                placeholder="123"
                value={cardData.cvv}
                onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                className="mt-1 text-white bg-slate-950 border-slate-800 focus:border-blue-500 focus:ring-blue-500/20 font-mono"
                maxLength={4}
                type="password"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onLogout}
              className="flex-1 h-12 bg-slate-800 text-slate-300 font-semibold rounded-xl hover:bg-slate-700 hover:text-white transition-all text-sm"
              disabled={processing}
            >
              Sign Out
            </button>
            <button
              type="submit"
              className="flex-1 h-12 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 text-sm"
              disabled={processing}
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Pay ₦5,000
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────

const DoctorDashboardPage = () => {
  const navigate = useNavigate();
  const { currentDoctor, isAuthenticated, isLoading: authLoading, logout } = useDoctorAuth();

  const [localDoctor, setLocalDoctor] = useState(currentDoctor);
  const [availability, setAvailability] = useState({ chat: true, voice: false, video: false });
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState(3);

  // Keep localDoctor in sync
  useEffect(() => {
    setLocalDoctor(currentDoctor);
  }, [currentDoctor]);

  // Sync availability from doctor record
  useEffect(() => {
    if (localDoctor) {
      const doctorProfile = localDoctor.doctor || {};
      setAvailability({
        chat: doctorProfile.availableForChat ?? true,
        voice: doctorProfile.availableForVoiceCalls ?? false,
        video: false,
      });
    }
  }, [localDoctor]);

  // Redirect to doctor login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/doctors/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  const handleAvailabilityToggle = (type, val) => {
    setAvailability(prev => ({ ...prev, [type]: val }));
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} availability ${val ? 'enabled' : 'disabled'}`);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/doctors/login');
  };

  const handleAccept = (req) => {
    toast.success(`Accepted ${req.type} consultation with ${req.patient}`);
  };
  const handleDecline = (req) => {
    toast.error(`Declined request from ${req.patient}`);
  };

  const handlePaymentSuccess = (updatedUserRecord) => {
    const storedAuth = localStorage.getItem('doctorAuth');
    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth);
        parsed.record = updatedUserRecord;
        localStorage.setItem('doctorAuth', JSON.stringify(parsed));
      } catch (e) {
        console.error(e);
      }
    }
    setLocalDoctor(updatedUserRecord);
    toast.success('Registration fee of ₦5,000 paid successfully! Welcome to the network.');
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)' }}>
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  // ── Not logged in ─────────────────────────────────────────────────────────
  if (!localDoctor) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)' }}>
        <div className="text-center max-w-md px-4">
          <AlertCircle className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Doctor Login Required</h2>
          <p className="text-slate-400 mb-6">Please log in via the Doctor Portal to access your dashboard.</p>
          <Link
            to="/doctors/login"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white transition-all"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}
          >
            Go to Doctor Login <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const doctorProfile = localDoctor.doctor || {};
  const doctorName = localDoctor.full_name || 'Doctor';
  const specialization = doctorProfile.specialization || 'Specialist';
  const isVerified = doctorProfile.verificationStatus === 'Verified';
  const isFeePaid = doctorProfile.registrationFeePaid ?? false;

  // ── Registration Fee Payment Screen ─────────────────────────────────────────
  if (!isFeePaid) {
    return (
      <DoctorPaymentGate 
        doctor={localDoctor} 
        onSuccess={handlePaymentSuccess} 
        onLogout={handleLogout} 
      />
    );
  }

  const rating = doctorProfile.rating ?? 5;
  const initials = doctorName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const isOnline = availability.chat || availability.voice || availability.video;

  return (
    <>
      <Helmet>
        <title>Doctor Dashboard | Emergencycare360</title>
        <meta name="description" content="Doctor dashboard for managing consultations and availability." />
      </Helmet>

      <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #0f172a 0%, #0f2340 60%, #111827 100%)' }}>

        {/* ── Top Navigation Bar ─────────────────────────────────────────── */}
        <div
          className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl"
          style={{ background: 'rgba(15,23,42,0.85)' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}>
                <Stethoscope className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-sm hidden sm:block">Emergencycare360</span>
              <span className="text-slate-600 hidden sm:block">|</span>
              <span className="text-slate-400 text-sm hidden sm:block">Doctor Portal</span>
            </div>

            {/* Nav tabs */}
            <div className="hidden md:flex items-center gap-1 rounded-xl p-1" style={{ background: 'rgba(255,255,255,0.05)' }}>
              {[
                { id: 'overview', label: 'Overview', icon: BarChart2 },
                { id: 'requests', label: 'Requests', icon: Calendar },
                { id: 'profile', label: 'Profile', icon: User },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    background: activeTab === id ? 'linear-gradient(135deg, #3b82f6, #06b6d4)' : 'transparent',
                    color: activeTab === id ? 'white' : '#94a3b8',
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                  {id === 'requests' && <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white">{SAMPLE_REQUESTS.length}</span>}
                </button>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              {/* Notification bell */}
              <button
                className="relative p-2 rounded-xl text-slate-400 hover:text-white transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)' }}
                onClick={() => { setNotifications(0); toast.info('No new notifications'); }}
              >
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                    {notifications}
                  </span>
                )}
              </button>

              {/* Online status indicator */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border"
                style={{
                  background: isOnline ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                  borderColor: isOnline ? '#10b98133' : '#ef444433',
                }}>
                <span className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: isOnline ? '#10b981' : '#ef4444' }} />
                <span className="text-xs font-semibold" style={{ color: isOnline ? '#10b981' : '#ef4444' }}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                id="doctor-logout-btn"
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white transition-all"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:block">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Hero Profile Banner ────────────────────────────────────────── */}
        <div className="relative overflow-hidden border-b border-white/5"
          style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(6,182,212,0.08))' }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 opacity-5"
              style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-2xl"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}>
                  {initials}
                </div>
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-900"
                  style={{ background: isOnline ? '#10b981' : '#64748b' }} />
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-white">Dr. {doctorName.replace(/^Dr\.?\s*/i, '')}</h1>
                  {isVerified && (
                    <Badge color="#10b981">
                      <ShieldCheckIcon /> Verified
                    </Badge>
                  )}
                  <Badge color="#f59e0b">
                    <Star className="w-3 h-3" /> {rating}.0
                  </Badge>
                </div>
                <p className="text-slate-400 text-sm mb-1">{specialization}</p>
                <p className="text-slate-600 text-xs font-mono">{currentDoctor.email}</p>
                {currentDoctor.hospital && (
                  <p className="text-slate-500 text-xs mt-0.5">🏥 {currentDoctor.hospital}</p>
                )}
              </div>

              {/* Quick stats */}
              <div className="flex gap-6 text-center">
                {[
                  { label: 'Experience', value: `${currentDoctor.years_experience ?? 10}yr` },
                  { label: 'Patients', value: '0' },
                  { label: 'Rating', value: `${rating}/5` },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xl font-bold text-white">{value}</p>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Content ───────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Mobile tab bar */}
          <div className="flex md:hidden gap-1 mb-6 rounded-xl p-1" style={{ background: 'rgba(255,255,255,0.05)' }}>
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'requests', label: `Requests (${SAMPLE_REQUESTS.length})` },
              { id: 'profile', label: 'Profile' },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: activeTab === id ? 'linear-gradient(135deg, #3b82f6, #06b6d4)' : 'transparent',
                  color: activeTab === id ? 'white' : '#94a3b8',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ── OVERVIEW TAB ─────────────────────────────────────────────── */}
          {activeTab === 'overview' && (
            <div className="space-y-8">

              {/* Stat cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Activity} label="Consultations" value="0" sub="This month" color="#3b82f6" />
                <StatCard icon={Users} label="Patients" value="0" sub="Total served" color="#8b5cf6" />
                <StatCard icon={Star} label="Rating" value={`${rating}.0`} sub="Out of 5.0" color="#f59e0b" />
                <StatCard icon={TrendingUp} label="Earnings" value="₦0" sub="Activates after first session" color="#10b981" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Availability panel */}
                <div className="rounded-2xl border border-white/8 p-6"
                  style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-white flex items-center gap-2">
                      <Zap className="w-5 h-5 text-blue-400" />
                      Availability
                    </h3>
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                      style={{
                        background: isOnline ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                        color: isOnline ? '#10b981' : '#ef4444',
                      }}>
                      {isOnline ? '● Online' : '● Offline'}
                    </span>
                  </div>
                  <div className="space-y-5">
                    {[
                      { key: 'chat', icon: MessageCircle, label: 'Chat Consultations', color: '#3b82f6' },
                      { key: 'voice', icon: Phone, label: 'Voice Calls', color: '#10b981' },
                      { key: 'video', icon: Video, label: 'Video Calls', color: '#8b5cf6' },
                    ].map(({ key, icon: Icon, label, color }) => (
                      <div key={key} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ background: `${color}22` }}>
                            <Icon className="w-4 h-4" style={{ color }} />
                          </div>
                          <span className="text-sm text-slate-300 font-medium">{label}</span>
                        </div>
                        <ToggleSwitch
                          checked={availability[key]}
                          onChange={(val) => handleAvailabilityToggle(key, val)}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Quick actions */}
                  <div className="mt-6 pt-5 border-t border-white/8 space-y-2">
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-3">Quick Actions</p>
                    {[
                      { icon: MessageCircle, label: 'Start Chat Session', color: '#3b82f6' },
                      { icon: Video, label: 'Start Video Call', color: '#8b5cf6' },
                      { icon: FileText, label: 'Write Prescription', color: '#f59e0b' },
                    ].map(({ icon: Icon, label, color }) => (
                      <button
                        key={label}
                        onClick={() => toast.info(`${label} coming soon!`)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-all"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                      >
                        <Icon className="w-4 h-4" style={{ color }} />
                        {label}
                        <ChevronRight className="w-3.5 h-3.5 ml-auto text-slate-600" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Consultation requests preview */}
                <div className="lg:col-span-2 rounded-2xl border border-white/8 overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between">
                    <h3 className="font-bold text-white flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-400" />
                      Incoming Requests
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                        {SAMPLE_REQUESTS.length} Pending
                      </span>
                      <button onClick={() => setActiveTab('requests')}
                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                        View all <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="divide-y divide-white/5">
                    {SAMPLE_REQUESTS.slice(0, 2).map(req => {
                      const TypeIcon = typeIcons[req.type];
                      return (
                        <div key={req.id} className="px-6 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
                            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
                            {req.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-sm font-semibold text-white">{req.patient}</span>
                              <span className="text-xs text-slate-600">Age {req.age}</span>
                              <Badge color={urgencyColors[req.urgency]}>{req.urgency}</Badge>
                            </div>
                            <p className="text-xs text-slate-500 truncate">{req.symptoms}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                              style={{ background: 'rgba(59,130,246,0.15)' }}>
                              <TypeIcon className="w-3.5 h-3.5 text-blue-400" />
                            </div>
                            <button onClick={() => handleAccept(req)}
                              className="p-1.5 rounded-lg text-emerald-400 hover:text-emerald-300 transition-colors"
                              style={{ background: 'rgba(16,185,129,0.1)' }}>
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDecline(req)}
                              className="p-1.5 rounded-lg text-red-400 hover:text-red-300 transition-colors"
                              style={{ background: 'rgba(239,68,68,0.1)' }}>
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Empty / CTA */}
                  <div className="px-6 py-4 border-t border-white/5">
                    <button
                      onClick={() => setActiveTab('requests')}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                      style={{ background: 'rgba(59,130,246,0.07)', border: '1px dashed rgba(59,130,246,0.3)' }}
                    >
                      <Plus className="w-4 h-4" /> View all {SAMPLE_REQUESTS.length} requests
                    </button>
                  </div>
                </div>
              </div>

              {/* Info banner */}
              <div className="rounded-2xl p-6 border border-blue-500/20 flex items-start gap-4"
                style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(6,182,212,0.04))' }}>
                <Award className="w-8 h-8 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Your profile is active and visible to patients</h4>
                  <p className="text-slate-400 text-sm">
                    Make sure to keep your availability toggles updated so patients can reach you for chat, voice, or video consultations.
                    Your medical license <span className="text-white font-mono font-semibold">
                      {currentDoctor.medical_license || 'MED-TEST-1234'}</span> is on file.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── REQUESTS TAB ─────────────────────────────────────────────── */}
          {activeTab === 'requests' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-blue-400" />
                  Consultation Requests
                </h2>
                <button
                  onClick={() => toast.info('Refreshed')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  <RefreshCw className="w-4 h-4" /> Refresh
                </button>
              </div>

              {SAMPLE_REQUESTS.map(req => {
                const TypeIcon = typeIcons[req.type];
                return (
                  <div
                    key={req.id}
                    className="rounded-2xl border border-white/8 p-6 flex flex-col sm:flex-row gap-4 hover:border-blue-500/20 transition-all"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                  >
                    {/* Avatar + basic info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold text-white shrink-0"
                        style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
                        {req.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-base font-bold text-white">{req.patient}</span>
                          <span className="text-xs text-slate-500">· Age {req.age}</span>
                          <Badge color={urgencyColors[req.urgency]}>{req.urgency} Urgency</Badge>
                        </div>
                        <p className="text-slate-400 text-sm mb-2">{req.symptoms}</p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <TypeIcon className="w-3.5 h-3.5 text-blue-400" /> {req.type} Consultation
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-600" /> {req.time}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex sm:flex-col gap-2 sm:w-32 shrink-0">
                      <button
                        onClick={() => handleAccept(req)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                        style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                      >
                        <CheckCircle className="w-4 h-4" /> Accept
                      </button>
                      <button
                        onClick={() => handleDecline(req)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-300 hover:text-white transition-all border border-white/10 hover:border-red-500/30"
                        style={{ background: 'rgba(239,68,68,0.08)' }}
                      >
                        <XCircle className="w-4 h-4 text-red-400" /> Decline
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── PROFILE TAB ──────────────────────────────────────────────── */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                <User className="w-6 h-6 text-blue-400" />
                Profile Details
              </h2>

              <div className="rounded-2xl border border-white/8 overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.03)' }}>
                {[
                  { label: 'Full Name', value: currentDoctor.full_name || '—', icon: User },
                  { label: 'Email', value: currentDoctor.email || '—', icon: Mail2 },
                  { label: 'Specialization', value: currentDoctor.specialization || '—', icon: Stethoscope },
                  { label: 'Medical License', value: currentDoctor.medical_license || '—', icon: Shield },
                  { label: 'Years of Experience', value: currentDoctor.years_experience != null ? `${currentDoctor.years_experience} years` : '—', icon: Award },
                  { label: 'Hospital / Clinic', value: currentDoctor.hospital || '—', icon: Heart },
                  { label: 'Verification Status', value: isVerified ? 'Verified ✓' : 'Pending Verification', icon: ShieldCheckIcon2, accent: isVerified ? '#10b981' : '#f59e0b' },
                  { label: 'Average Rating', value: `${rating} / 5`, icon: Star },
                ].map(({ label, value, icon: Icon, accent }) => (
                  <div key={label} className="flex items-center gap-4 px-6 py-4 border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-colors">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(59,130,246,0.12)' }}>
                      {Icon && <Icon className="w-4 h-4 text-blue-400" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">{label}</p>
                      <p className="text-sm font-medium mt-0.5" style={{ color: accent || '#e2e8f0' }}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => toast.info('Profile editing coming soon!')}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all text-sm"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', boxShadow: '0 0 20px rgba(59,130,246,0.3)' }}
              >
                <Settings className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Inline icon helpers (avoid import conflicts)
const ShieldCheckIcon = () => <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
const ShieldCheckIcon2 = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
const Mail2 = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;

export default DoctorDashboardPage;