import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import { toast } from 'sonner';
import {
  LogOut, Users, Shield, Activity, AlertCircle, TrendingUp,
  Stethoscope, Building2, ChevronRight, Bell, BarChart2,
  UserCheck, UserX, CheckCircle, Clock, Zap, MapPin, Phone,
  Settings, Eye, RefreshCw
} from 'lucide-react';

// ── Stat Card ─────────────────────────────────────────────────────────────

const StatCard = ({ icon: Icon, label, value, sub, color = '#8b5cf6' }) => (
  <div
    className="rounded-2xl p-5 flex flex-col gap-3 border transition-all duration-300 hover:scale-[1.02]"
    style={{
      background: `linear-gradient(135deg, ${color}15, ${color}08)`,
      border: `1px solid ${color}30`,
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

// ── Sample Data ───────────────────────────────────────────────────────────

const SAMPLE_DOCTORS = [
  { id: 1, name: 'Dr. Test Doctor', email: 'doctor@test.com', specialization: 'Emergency Medicine', status: 'verified', available: true },
  { id: 2, name: 'Dr. Amara Obi', email: 'amara@hospital.com', specialization: 'Pediatrics', status: 'pending', available: false },
  { id: 3, name: 'Dr. Chukwu Emeka', email: 'chukwu@hospital.com', specialization: 'Surgery', status: 'verified', available: true },
];

const SAMPLE_REQUESTS = [
  { id: 1, patient: 'Ngozi A.', type: 'medical', urgency: 'Critical', status: 'pending', time: '3 min ago' },
  { id: 2, patient: 'Ade B.', type: 'trauma', urgency: 'High', status: 'dispatched', time: '12 min ago' },
  { id: 3, patient: 'Fatima C.', type: 'pediatric', urgency: 'Medium', status: 'resolved', time: '1 hour ago' },
];

const urgencyColors = { Critical: '#8b5cf6', High: '#ef4444', Medium: '#f59e0b', Low: '#10b981' };
const statusColors = { pending: '#f59e0b', dispatched: '#3b82f6', resolved: '#10b981', cancelled: '#64748b' };

// ── Main Component ─────────────────────────────────────────────────────────

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { currentAdmin, isAuthenticated, isLoading: authLoading, logout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState(5);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  // Loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #1a0a2e, #16213e)' }}>
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading admin dashboard…</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!currentAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #1a0a2e, #16213e)' }}>
        <div className="text-center max-w-md px-4">
          <AlertCircle className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Admin Login Required</h2>
          <p className="text-slate-400 mb-6">Please log in to access the admin dashboard.</p>
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white transition-all"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #a855f7)' }}
          >
            Go to Admin Login <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Emergencycare360</title>
        <meta name="description" content="Admin dashboard for system management and oversight." />
      </Helmet>

      <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #1a0a2e 0%, #16213e 60%, #0f172a 100%)' }}>

        {/* ── Top Nav ─────────────────────────────────────────────────── */}
        <div className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl"
          style={{ background: 'rgba(26,10,46,0.85)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #a855f7)' }}>
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-sm hidden sm:block">Emergencycare360</span>
              <span className="text-slate-600 hidden sm:block">|</span>
              <span className="text-slate-400 text-sm hidden sm:block">Admin Portal</span>
            </div>

            {/* Tabs */}
            <div className="hidden md:flex items-center gap-1 rounded-xl p-1" style={{ background: 'rgba(255,255,255,0.05)' }}>
              {[
                { id: 'overview', label: 'Overview', icon: BarChart2 },
                { id: 'doctors', label: 'Doctors', icon: Stethoscope },
                { id: 'emergencies', label: 'Emergencies', icon: Activity },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    background: activeTab === id ? 'linear-gradient(135deg, #8b5cf6, #a855f7)' : 'transparent',
                    color: activeTab === id ? 'white' : '#94a3b8',
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              <button
                className="relative p-2 rounded-xl text-slate-400 hover:text-white transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)' }}
                onClick={() => { setNotifications(0); toast.info('No new notifications'); }}
              >
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                    {notifications}
                  </span>
                )}
              </button>

              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border"
                style={{ background: 'rgba(139,92,246,0.1)', borderColor: '#8b5cf633' }}>
                <Shield className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-xs font-semibold text-purple-400">Admin</span>
              </div>

              <button onClick={handleLogout} id="admin-logout-btn"
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white transition-all"
                style={{ background: 'rgba(255,255,255,0.05)' }}>
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:block">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Hero Banner ────────────────────────────────────────────── */}
        <div className="relative overflow-hidden border-b border-white/5"
          style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(168,85,247,0.08))' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">
                  Welcome, {currentAdmin.full_name || 'Admin'}
                </h1>
                <p className="text-slate-400 text-sm">{currentAdmin.email} · System Administrator</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => toast.info('System settings coming soon!')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Settings className="w-4 h-4" /> Settings
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Content ────────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Mobile tabs */}
          <div className="flex md:hidden gap-1 mb-6 rounded-xl p-1" style={{ background: 'rgba(255,255,255,0.05)' }}>
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'doctors', label: 'Doctors' },
              { id: 'emergencies', label: 'Emergencies' },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: activeTab === id ? 'linear-gradient(135deg, #8b5cf6, #a855f7)' : 'transparent',
                  color: activeTab === id ? 'white' : '#94a3b8',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ── OVERVIEW ──────────────────────────────────────────────── */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Stethoscope} label="Doctors" value={SAMPLE_DOCTORS.length} sub="Registered" color="#8b5cf6" />
                <StatCard icon={Users} label="Patients" value="0" sub="Active users" color="#3b82f6" />
                <StatCard icon={Activity} label="Emergencies" value={SAMPLE_REQUESTS.length} sub="Total requests" color="#ef4444" />
                <StatCard icon={TrendingUp} label="Response" value="—" sub="Avg response time" color="#10b981" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Emergency Requests */}
                <div className="rounded-2xl border border-white/8 overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between">
                    <h3 className="font-bold text-white flex items-center gap-2">
                      <Activity className="w-5 h-5 text-red-400" />
                      Recent Emergencies
                    </h3>
                    <button onClick={() => setActiveTab('emergencies')}
                      className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
                      View all <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="divide-y divide-white/5">
                    {SAMPLE_REQUESTS.map(req => (
                      <div key={req.id} className="px-6 py-3.5 flex items-center gap-3 hover:bg-white/[0.02] transition-colors">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: urgencyColors[req.urgency] }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-white">{req.patient}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                              style={{ background: `${urgencyColors[req.urgency]}22`, color: urgencyColors[req.urgency] }}>
                              {req.urgency}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{req.type} · {req.time}</p>
                        </div>
                        <span className="text-xs px-2.5 py-1 rounded-full font-semibold capitalize"
                          style={{ background: `${statusColors[req.status]}22`, color: statusColors[req.status] }}>
                          {req.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Doctor Overview */}
                <div className="rounded-2xl border border-white/8 overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between">
                    <h3 className="font-bold text-white flex items-center gap-2">
                      <Stethoscope className="w-5 h-5 text-purple-400" />
                      Registered Doctors
                    </h3>
                    <button onClick={() => setActiveTab('doctors')}
                      className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
                      Manage <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="divide-y divide-white/5">
                    {SAMPLE_DOCTORS.map(doc => (
                      <div key={doc.id} className="px-6 py-3.5 flex items-center gap-3 hover:bg-white/[0.02] transition-colors">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0"
                          style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}>
                          {doc.name.split(' ').slice(1).map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-semibold text-white block">{doc.name}</span>
                          <span className="text-xs text-slate-500">{doc.specialization}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ background: doc.available ? '#10b981' : '#64748b' }} />
                          <span className="text-xs px-2 py-0.5 rounded-full font-semibold capitalize"
                            style={{
                              background: doc.status === 'verified' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                              color: doc.status === 'verified' ? '#10b981' : '#f59e0b',
                            }}>
                            {doc.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* System status banner */}
              <div className="rounded-2xl p-6 border border-purple-500/20 flex items-start gap-4"
                style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(99,102,241,0.04))' }}>
                <Zap className="w-8 h-8 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">System Status: All Services Running</h4>
                  <p className="text-slate-400 text-sm">
                    Frontend server on port 3000 ✅ · API server on port 3001 ✅ · 
                    Auth system active ✅ · {SAMPLE_DOCTORS.length} doctors registered · {SAMPLE_REQUESTS.length} emergency requests on file.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── DOCTORS TAB ───────────────────────────────────────────── */}
          {activeTab === 'doctors' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Stethoscope className="w-6 h-6 text-purple-400" />
                  Doctor Management
                </h2>
                <button onClick={() => toast.info('Refreshed')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <RefreshCw className="w-4 h-4" /> Refresh
                </button>
              </div>

              {SAMPLE_DOCTORS.map(doc => (
                <div key={doc.id}
                  className="rounded-2xl border border-white/8 p-6 flex flex-col sm:flex-row gap-4 hover:border-purple-500/20 transition-all"
                  style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold text-white shrink-0"
                      style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}>
                      {doc.name.split(' ').slice(1).map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-base font-bold text-white">{doc.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold capitalize"
                          style={{
                            background: doc.status === 'verified' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                            color: doc.status === 'verified' ? '#10b981' : '#f59e0b',
                          }}>
                          {doc.status}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm">{doc.specialization}</p>
                      <p className="text-slate-600 text-xs font-mono mt-0.5">{doc.email}</p>
                    </div>
                  </div>
                  <div className="flex sm:flex-col gap-2 sm:w-32 shrink-0">
                    {doc.status === 'pending' ? (
                      <>
                        <button onClick={() => toast.success(`Approved ${doc.name}`)}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white transition-all"
                          style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                          <UserCheck className="w-4 h-4" /> Approve
                        </button>
                        <button onClick={() => toast.error(`Rejected ${doc.name}`)}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-300 border border-white/10"
                          style={{ background: 'rgba(239,68,68,0.08)' }}>
                          <UserX className="w-4 h-4 text-red-400" /> Reject
                        </button>
                      </>
                    ) : (
                      <button onClick={() => toast.info(`Viewing ${doc.name}'s profile`)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-300 border border-white/10"
                        style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <Eye className="w-4 h-4" /> View
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── EMERGENCIES TAB ──────────────────────────────────────── */}
          {activeTab === 'emergencies' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Activity className="w-6 h-6 text-red-400" />
                  Emergency Requests
                </h2>
                <button onClick={() => toast.info('Refreshed')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <RefreshCw className="w-4 h-4" /> Refresh
                </button>
              </div>

              {SAMPLE_REQUESTS.map(req => (
                <div key={req.id}
                  className="rounded-2xl border border-white/8 p-6 flex flex-col sm:flex-row gap-4 hover:border-purple-500/20 transition-all"
                  style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-3 h-3 rounded-full shrink-0 mt-1.5" style={{ background: urgencyColors[req.urgency] }} />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-base font-bold text-white">{req.patient}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{ background: `${urgencyColors[req.urgency]}22`, color: urgencyColors[req.urgency] }}>
                          {req.urgency}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold capitalize"
                          style={{ background: `${statusColors[req.status]}22`, color: statusColors[req.status] }}>
                          {req.status}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm capitalize">{req.type} emergency</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {req.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 sm:w-32 shrink-0">
                    <button onClick={() => toast.info(`Viewing details for ${req.patient}`)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-300 border border-white/10"
                      style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <Eye className="w-4 h-4" /> Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboardPage;
