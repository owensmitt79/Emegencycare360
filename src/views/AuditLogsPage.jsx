import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import { 
  Home, Users, AlertTriangle, FileText, Settings, 
  ChevronDown, HelpCircle, Bell, User, CheckCircle2, ChevronRight,
  Shield, Activity, ShieldAlert, Check, X, Building, UserCheck, Search
} from 'lucide-react';

const AuditLogsPage = () => {
  const { currentAdmin } = useAdminAuth();
  const adminName = currentAdmin 
    ? (currentAdmin.email === 'admin@test.com' ? 'Dr. John Doe' : `Dr. ${currentAdmin.firstName} ${currentAdmin.lastName}`) 
    : 'Dr. John Doe';

  // Mock Audit Logs database records
  const [logs, setLogs] = useState([
    { id: 'LOG-3912a', timestamp: '2026-06-10 11:42:18', actor: 'admin@emergencycare360.com', action: 'LOGIN_SUCCESS', details: 'Admin console dashboard session established', ip: '192.168.1.101' },
    { id: 'LOG-3912b', timestamp: '2026-06-10 11:43:05', actor: 'admin@emergencycare360.com', action: 'READ_PHI', details: 'Decrypted patient health information for PAT-849', ip: '192.168.1.101' },
    { id: 'LOG-3912c', timestamp: '2026-06-10 11:45:12', actor: 'admin@emergencycare360.com', action: 'VERIFY_DOCTOR', details: 'Approved practice license credential MDCN/8942 for DOC-883', ip: '192.168.1.101' },
    { id: 'LOG-3912d', timestamp: '2026-06-10 11:48:30', actor: 'dr.sarah@emergencycare360.com', action: 'LOGIN_SUCCESS', details: 'Doctor portal session established', ip: '102.89.44.22' },
    { id: 'LOG-3912e', timestamp: '2026-06-10 11:50:01', actor: 'dr.sarah@emergencycare360.com', action: 'CREATE_CONSULTATION', details: 'Initiated video consultation room context for patient PAT-849', ip: '102.89.44.22' },
    { id: 'LOG-3912f', timestamp: '2026-06-10 11:51:19', actor: 'admin@emergencycare360.com', action: 'UPDATE_PHI', details: 'Assigned patient PAT-301 to consulting physician DOC-219', ip: '192.168.1.101' },
    { id: 'LOG-3912g', timestamp: '2026-06-10 11:53:40', actor: 'patient.john@gmail.com', action: 'LOGIN_SUCCESS', details: 'Patient mobile login successful', ip: '197.210.64.12' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>HIPAA Access Logs | Emergencycare360</title>
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
            <a href="/admin/audit-logs" className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors bg-[#219653]/10 text-white hover:bg-white/5">
              <FileText className="w-4 h-4 text-[#219653]" />
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
              <h1 className="text-xl font-bold text-gray-800 tracking-tight">HIPAA Access Audit Trail</h1>
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
            <div className="max-w-4xl mx-auto space-y-6">
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Access Activity Trail</h2>
                  <p className="text-sm text-gray-500 mt-1">Audit log tracking compliance events, logins, and PHI read/writes.</p>
                </div>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search logs..." 
                    className="pl-8 bg-background text-foreground text-sm border-gray-200"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Logs Table */}
              <div className="overflow-x-auto border border-gray-100 rounded-xl bg-white shadow-sm">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="p-3.5 font-semibold text-gray-600">Timestamp</th>
                      <th className="p-3.5 font-semibold text-gray-600">User / Actor</th>
                      <th className="p-3.5 font-semibold text-gray-600">Action Code</th>
                      <th className="p-3.5 font-semibold text-gray-600">Event Details</th>
                      <th className="p-3.5 font-semibold text-gray-600 text-right">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-sans">
                    {filteredLogs.map((log, i) => (
                      <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-3.5 text-xs text-gray-400 font-mono whitespace-nowrap">{log.timestamp}</td>
                        <td className="p-3.5 text-xs text-slate-800 font-semibold">{log.actor}</td>
                        <td className="p-3.5">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold font-mono
                            ${log.action === 'READ_PHI' ? 'bg-amber-100 text-amber-800' : 
                              log.action === 'UPDATE_PHI' ? 'bg-blue-100 text-blue-800' : 
                              log.action === 'VERIFY_DOCTOR' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="p-3.5 text-xs text-gray-600 leading-normal max-w-[280px]">{log.details}</td>
                        <td className="p-3.5 text-xs text-gray-400 font-mono text-right">{log.ip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </main>

        {/* ── Right Sidebar ── */}
        <aside className="w-[280px] bg-white border-l border-gray-100 hidden flex-col p-8 flex-shrink-0 z-10 xl:flex justify-between">
          <div>
            <div className="flex justify-between items-center mb-8">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Compliance Status</span>
              <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded uppercase font-mono">Passing</span>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              HIPAA Section 164.312(b) requires logs to record and examine activity in systems containing or using Protected Health Information (PHI).
            </p>
          </div>

          <div className="bg-[#fafafa] border border-gray-100 rounded-lg p-4 space-y-2">
            <h5 className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Audit Security</h5>
            <p className="text-[10px] text-gray-400 leading-normal">
              Audit logs are write-once and synchronized with database replication nodes on port 3306.
            </p>
          </div>
        </aside>

      </div>
    </>
  );
};

// Simple input component mockup for tailwind
const Input = ({ className, ...props }) => (
  <input 
    type="text" 
    className={`w-full rounded-lg border border-gray-200 p-2.5 outline-none focus:border-[#219653] focus:ring-1 focus:ring-[#219653] ${className}`}
    {...props} 
  />
);

export default AuditLogsPage;
