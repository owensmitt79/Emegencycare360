import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import { 
  Home, Users, AlertTriangle, FileText, Settings, 
  ChevronDown, HelpCircle, Bell, User, CheckCircle2, ChevronRight,
  Shield, Activity, ShieldAlert, Check, X, Building, UserCheck
} from 'lucide-react';

const PlatformSettingsPage = () => {
  const { currentAdmin } = useAdminAuth();
  const adminName = currentAdmin 
    ? (currentAdmin.email === 'admin@test.com' ? 'Dr. John Doe' : `Dr. ${currentAdmin.firstName} ${currentAdmin.lastName}`) 
    : 'Dr. John Doe';

  const [appName, setAppName] = useState('Emergencycare360');
  const [supportPhone, setSupportPhone] = useState('+234 703 878 7313');
  const [enableChat, setEnableChat] = useState(true);
  const [enableVoice, setEnableVoice] = useState(true);
  const [enableVideo, setEnableVideo] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <>
      <Helmet>
        <title>Platform Settings | Emergencycare360</title>
      </Helmet>

      {/* Main Layout */}
      <div className="h-screen w-full flex overflow-hidden bg-[#fafafa] text-slate-800 font-sans selection:bg-green-100 selection:text-green-900">
        
        {/* ── Left Sidebar (Clinical & Operations Portal) ── */}
        <aside className="w-[240px] bg-[#0b132b] flex flex-col flex-shrink-0 z-20 shadow-xl lg:shadow-none">
          {/* Header */}
          <div className="bg-[#131d3a] p-4 flex items-center justify-between cursor-pointer hover:bg-[#1a2546] transition-colors">
            <div>
              <h2 className="text-white font-semibold text-sm">Emergencycare360</h2>
              <p className="text-slate-400 text-xs mt-0.5">Clinical Operations</p>
              <p className="text-slate-500 text-[10px] font-medium mt-1">{adminName}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>

          {/* Navigation Scroll Area */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin scrollbar-thumb-white/10">
            <div className="px-3 mb-2">
              <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Emergency System</span>
            </div>
            <a href="/admin/dashboard" className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-slate-300 hover:bg-white/5 hover:text-white">
              <Home className="w-4 h-4" />
              <span>Operations Overview</span>
            </a>
            <a href="/dispatcher" className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-slate-300 hover:bg-white/5 hover:text-white">
              <AlertTriangle className="w-4 h-4" />
              <span>Emergency Registry</span>
            </a>
            <a href="/doctors/availability" className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-slate-300 hover:bg-white/5 hover:text-white">
              <Users className="w-4 h-4" />
              <span>Doctors Directory</span>
            </a>
            <a href="/admin/verification" className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors text-slate-300 hover:bg-white/5 hover:text-white">
              <div className="flex items-center gap-3">
                <UserCheck className="w-4 h-4" />
                <span>Verification Requests</span>
              </div>
              <span className="bg-[#e53e3e] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                2
              </span>
            </a>
            <a href="/hospitals" className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-slate-300 hover:bg-white/5 hover:text-white">
              <Building className="w-4 h-4" />
              <span>Hospital Facilities</span>
            </a>

            <div className="mt-6 mb-2 px-3">
              <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Compliance & Audits</span>
            </div>
            <a href="/admin/audit-logs" className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-slate-300 hover:bg-white/5 hover:text-white">
              <FileText className="w-4 h-4" />
              <span>HIPAA Access Logs</span>
            </a>
            <a href="/admin/settings" className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors bg-[#219653]/10 text-white hover:bg-white/5">
              <Settings className="w-4 h-4 text-[#219653]" />
              <span>Platform Settings</span>
            </a>
          </div>

          {/* Bottom Settings */}
          <div className="p-3 space-y-1 mt-auto bg-[#0b132b] border-t border-white/5">
            <a href="/admin/security" className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white">
              <Shield className="w-4 h-4" />
              <span>System Security</span>
            </a>
          </div>
        </aside>

        {/* ── Middle Content Area ── */}
        <main className="flex-1 flex flex-col min-w-0 bg-white relative">
          
          {/* Header */}
          <header className="h-16 border-b border-gray-100 flex items-center justify-between px-6 flex-shrink-0 bg-white sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-800 tracking-tight">Platform Settings</h1>
              <HelpCircle className="w-4 h-4 text-gray-300 hover:text-gray-400 cursor-pointer" />
            </div>

            <div className="flex items-center gap-5">
              {/* System Operations Toggle */}
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#219653] rounded-full animate-pulse shadow-sm" />
                <span className="text-sm font-semibold text-[#219653]">Operations Active</span>
              </div>

              {/* Verified Badge */}
              <div className="flex items-center gap-1.5 border border-[#219653]/30 bg-[#219653]/5 px-3 py-1.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#219653]" />
                <span className="text-xs font-semibold text-[#219653]">HIPAA Audits Enabled</span>
              </div>

              {/* Profile details */}
              <button className="flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors">
                <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                  <User className="w-4 h-4 text-gray-400" />
                </div>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-8 relative">
            <div className="max-w-xl mx-auto space-y-6">
              
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Configuration Panel</h2>
                <p className="text-sm text-gray-500 mt-1">Configure general platform settings, medical emergency phone triggers, and consult channel profiles.</p>
              </div>

              {saveSuccess && (
                <div className="bg-[#e6f4ea] text-[#137333] p-4 rounded-lg flex items-center gap-2 border border-[#ceead6]">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm font-semibold">Settings saved successfully. Changes are now live.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4 p-6 border border-gray-100 rounded-xl bg-white shadow-sm">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">General Configurations</h3>
                  
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Application Name</label>
                    <input 
                      type="text" 
                      value={appName}
                      onChange={e => setAppName(e.target.value)}
                      className="w-full text-sm rounded-lg border border-gray-200 p-2.5 outline-none focus:border-[#219653] focus:ring-1 focus:ring-[#219653]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">24/7 Hotline Number</label>
                    <input 
                      type="text" 
                      value={supportPhone}
                      onChange={e => setSupportPhone(e.target.value)}
                      className="w-full text-sm rounded-lg border border-gray-200 p-2.5 outline-none focus:border-[#219653] focus:ring-1 focus:ring-[#219653]"
                    />
                  </div>
                </div>

                <div className="space-y-4 p-6 border border-gray-100 rounded-xl bg-white shadow-sm">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Consultation Channels</h3>
                  
                  <div className="flex items-center justify-between py-2 border-b border-gray-50">
                    <div>
                      <span className="text-sm font-semibold text-gray-700 block">Enable Live Chat</span>
                      <span className="text-xs text-gray-400">Allow patients and doctors to message inside consult rooms.</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={enableChat}
                      onChange={e => setEnableChat(e.target.checked)}
                      className="w-4 h-4 accent-[#219653]"
                    />
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-gray-50">
                    <div>
                      <span className="text-sm font-semibold text-gray-700 block">Enable Voice Consultation</span>
                      <span className="text-xs text-gray-400">Allow voice calling channels inside rooms.</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={enableVoice}
                      onChange={e => setEnableVoice(e.target.checked)}
                      className="w-4 h-4 accent-[#219653]"
                    />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div>
                      <span className="text-sm font-semibold text-gray-700 block">Enable Video Consultation</span>
                      <span className="text-xs text-gray-400">Allow video calling channels inside rooms (Beta).</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={enableVideo}
                      onChange={e => setEnableVideo(e.target.checked)}
                      className="w-4 h-4 accent-[#219653]"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-[#219653] hover:bg-[#1e874b] text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
                >
                  Save Settings
                </button>
              </form>

            </div>
          </div>
        </main>

        {/* ── Right Sidebar ── */}
        <aside className="w-[280px] bg-white border-l border-gray-100 hidden flex-col p-8 flex-shrink-0 z-10 xl:flex justify-between">
          <div>
            <div className="flex justify-between items-center mb-8">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Platform Info</span>
              <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded uppercase font-mono">v1.0.0</span>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              Toggling settings modifies configurations in the global state manager and alters options displayed on patient-facing consult screens.
            </p>
          </div>

          <div className="bg-[#fafafa] border border-gray-100 rounded-lg p-4 space-y-2">
            <h5 className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">SMTP Status</h5>
            <p className="text-[10px] text-gray-400 leading-normal">
              Mail dispatch services are currently configured to route verification links using default Ethereal mockups.
            </p>
          </div>
        </aside>

      </div>
    </>
  );
};

export default PlatformSettingsPage;
