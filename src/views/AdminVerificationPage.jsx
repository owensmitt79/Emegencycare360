import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import { 
  Home, Users, AlertTriangle, FileText, Settings, 
  ChevronDown, HelpCircle, Bell, User, CheckCircle2, ChevronRight,
  Shield, Activity, ShieldAlert, Check, X, Building, UserCheck
} from 'lucide-react';

const AdminVerificationPage = () => {
  const { currentAdmin } = useAdminAuth();
  const adminName = currentAdmin 
    ? (currentAdmin.email === 'admin@test.com' ? 'Dr. John Doe' : `Dr. ${currentAdmin.firstName} ${currentAdmin.lastName}`) 
    : 'Dr. John Doe';

  // Mock Pending Doctors Verification Queue
  const [pendingDoctors, setPendingDoctors] = useState([
    { id: 'DOC-883', name: 'Dr. Sarah Yusuf', specialization: 'Emergency Medicine', hospital: 'LASUTH, Lagos', license: 'MDCN/8942', experience: '8 Years' },
    { id: 'DOC-219', name: 'Dr. Emeka Okafor', specialization: 'Cardiology', hospital: 'National Hospital Abuja', license: 'MDCN/3156', experience: '12 Years' }
  ]);

  const handleVerifyDoctor = (id) => {
    setPendingDoctors(prev => prev.filter(doc => doc.id !== id));
  };

  const handleRejectDoctor = (id) => {
    setPendingDoctors(prev => prev.filter(doc => doc.id !== id));
  };

  return (
    <>
      <Helmet>
        <title>Doctor Verification | Emergencycare360</title>
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
            <a href="/admin/verification" className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors bg-[#219653]/10 text-white hover:bg-white/5">
              <div className="flex items-center gap-3">
                <UserCheck className="w-4 h-4 text-[#219653]" />
                <span>Verification Requests</span>
              </div>
              {pendingDoctors.length > 0 && (
                <span className="bg-[#e53e3e] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                  {pendingDoctors.length}
                </span>
              )}
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
            <a href="/admin/settings" className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-slate-300 hover:bg-white/5 hover:text-white">
              <Settings className="w-4 h-4" />
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
              <h1 className="text-xl font-bold text-gray-800 tracking-tight">Doctor Verification Requests</h1>
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

              {/* Actions & Alerts */}
              <button className="text-gray-400 hover:text-gray-600 transition-colors relative">
                <Bell className="w-5 h-5" />
                {pendingDoctors.length > 0 && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white" />
                )}
              </button>

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
            <div className="max-w-4xl mx-auto space-y-8">
              
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Credential Review & Verification Queue</h2>
                <p className="text-sm text-gray-500 mt-1">Review medical licenses and qualifications of doctors waiting to consult on the platform.</p>
              </div>

              {/* Pending Doctors Credentials Verification Section */}
              <div className="space-y-4">
                {pendingDoctors.length === 0 ? (
                  <div className="p-12 border border-dashed border-gray-200 rounded-xl text-center bg-white">
                    <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-gray-800">Verification Queue Empty</h3>
                    <p className="text-sm text-gray-400 mt-1 max-w-sm mx-auto">All doctor registrations and license credentials have been reviewed and verified.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pendingDoctors.map((doc) => (
                      <div key={doc.id} className="p-6 border border-gray-100 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-gray-900 text-base">{doc.name}</h4>
                              <p className="text-sm text-[#219653] font-semibold">{doc.specialization}</p>
                            </div>
                            <span className="text-xs font-mono bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded">
                              {doc.id}
                            </span>
                          </div>
                          <div className="mt-4 space-y-2 text-sm text-gray-500">
                            <div className="flex justify-between">
                              <span>Practice Facility:</span>
                              <span className="font-medium text-gray-800">{doc.hospital}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Medical License ID:</span>
                              <span className="font-mono font-medium text-gray-800">{doc.license}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Years of Experience:</span>
                              <span className="font-medium text-gray-800">{doc.experience}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 flex gap-2 border-t border-gray-100 pt-4">
                          <button 
                            onClick={() => handleVerifyDoctor(doc.id)}
                            className="flex-grow py-2 bg-[#219653] hover:bg-[#1e874b] text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Check className="w-4 h-4" /> Approve License
                          </button>
                          <button 
                            onClick={() => handleRejectDoctor(doc.id)}
                            className="py-2 px-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <X className="w-4 h-4" /> Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </main>

        {/* ── Right Sidebar ── */}
        <aside className="w-[280px] bg-white border-l border-gray-100 hidden flex-col p-8 flex-shrink-0 z-10 xl:flex justify-between">
          <div>
            <div className="flex justify-between items-center mb-8">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Verification Status</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded uppercase">Requires Action</span>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              Pursuant to medical board integration specifications, verification triggers email notifications and unlocks credentials for patients to request direct consultation rooms.
            </p>
          </div>

          <div className="bg-[#fafafa] border border-gray-100 rounded-lg p-4 space-y-2">
            <h5 className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">HIPAA Logging</h5>
            <p className="text-[10px] text-gray-400 leading-normal">
              Approve/reject decisions are logged to compliance trails as <code className="bg-gray-200 px-1 py-0.5 rounded text-[9px] font-mono">VERIFY_DOCTOR</code>.
            </p>
          </div>
        </aside>

      </div>
    </>
  );
};

export default AdminVerificationPage;
