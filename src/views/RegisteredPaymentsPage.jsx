import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import { 
  Home, Users, AlertTriangle, FileText, Settings, 
  ChevronDown, HelpCircle, Bell, User, CheckCircle2, ChevronRight,
  Shield, Activity, Building, UserCheck, CreditCard, Search, ExternalLink
} from 'lucide-react';

const RegisteredPaymentsPage = () => {
  const { currentAdmin } = useAdminAuth();
  const adminName = currentAdmin 
    ? (currentAdmin.email === 'admin@test.com' ? 'Dr. John Doe' : `Dr. ${currentAdmin.firstName} ${currentAdmin.lastName}`) 
    : 'Dr. John Doe';

  // Mock Payments / Transactions List
  const [payments, setPayments] = useState([
    { id: 'TXN-9024', name: 'Dr. Sarah Yusuf', type: 'Starter Monthly Subscription', amount: '₦10,000.00', gateway: 'Paystack', status: 'Successful', date: '2026-06-10 11:45:12' },
    { id: 'TXN-8941', name: 'Dr. Emeka Okafor', type: 'Premium Annual Subscription', amount: '₦80,000.00', gateway: 'Paystack', status: 'Successful', date: '2026-06-09 15:23:40' },
    { id: 'TXN-7392', name: 'John Doe (Patient)', type: 'Teleconsultation Fee - Cardiology', amount: '₦7,500.00', gateway: 'Flutterwave', status: 'Successful', date: '2026-06-09 10:11:05' },
    { id: 'TXN-6204', name: 'Dr. Kunle Alabi', type: 'Basic Registration Listing', amount: '₦5,000.00', gateway: 'Paystack', status: 'Successful', date: '2026-06-08 17:34:50' },
    { id: 'TXN-5812', name: 'Aisha Bello (Patient)', type: 'Teleconsultation Fee - Emergency Med', amount: '₦5,000.00', gateway: 'Flutterwave', status: 'Successful', date: '2026-06-08 09:12:18' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredPayments = payments.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Registered Payments | Emergencycare360</title>
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
            <a href="/admin/payments" className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors bg-[#219653]/10 text-white hover:bg-white/5">
              <CreditCard className="w-4 h-4 text-[#219653]" />
              <span>Registered Payments</span>
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
              <h1 className="text-xl font-bold text-gray-800 tracking-tight">Registered Payments Overview</h1>
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
                  <h2 className="text-2xl font-bold text-gray-900">Platform Transaction Registry</h2>
                  <p className="text-sm text-gray-500 mt-1">Audit and review licensing subscriptions and patient teleconsultation transactions.</p>
                </div>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                  <input 
                    placeholder="Search transactions..." 
                    className="w-full text-sm rounded-lg border border-gray-200 p-2.5 pl-8 outline-none focus:border-[#219653] focus:ring-1 focus:ring-[#219653]"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Revenue</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">₦107,500.00</p>
                  <p className="text-[10px] text-[#219653] font-semibold mt-0.5">↑ 12% this week</p>
                </div>
                <div className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Doctor Subs</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">3 Completed</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">₦95,000.00 volume</p>
                </div>
                <div className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Consultations</p>
                  <p className="text-2xl font-bold text-[#219653] mt-1">2 Completed</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">₦12,500.00 volume</p>
                </div>
                <div className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Gateway</p>
                  <p className="text-2xl font-bold text-green-700 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-5 h-5 text-green-600" /> Paystack
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Live API connection</p>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="overflow-x-auto border border-gray-100 rounded-xl bg-white shadow-sm">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="p-3.5 font-semibold text-gray-600">Transaction ID</th>
                      <th className="p-3.5 font-semibold text-gray-600">Payer Name</th>
                      <th className="p-3.5 font-semibold text-gray-600">Transaction Type</th>
                      <th className="p-3.5 font-semibold text-gray-600">Amount</th>
                      <th className="p-3.5 font-semibold text-gray-600">Gateway</th>
                      <th className="p-3.5 font-semibold text-gray-600">Status</th>
                      <th className="p-3.5 font-semibold text-gray-600 text-right">Date Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-sans">
                    {filteredPayments.map((p, i) => (
                      <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-3.5 text-xs text-slate-800 font-mono whitespace-nowrap">{p.id}</td>
                        <td className="p-3.5 text-xs text-slate-800 font-semibold">{p.name}</td>
                        <td className="p-3.5 text-xs text-gray-500">{p.type}</td>
                        <td className="p-3.5 text-xs text-slate-850 font-bold font-mono">{p.amount}</td>
                        <td className="p-3.5 text-xs text-gray-500">{p.gateway}</td>
                        <td className="p-3.5">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800">
                            {p.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-xs text-gray-400 font-mono text-right whitespace-nowrap">{p.date}</td>
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
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Gateway Profile</span>
              <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded uppercase font-mono">Live</span>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              Payments are routed via secure payment channels utilizing Webhook callbacks. Dispatched transaction data is archived strictly under encrypted HIPAA transaction standards.
            </p>
          </div>

          <div className="bg-[#fafafa] border border-gray-100 rounded-lg p-4 space-y-2">
            <h5 className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Audit Compliance</h5>
            <p className="text-[10px] text-gray-400 leading-normal">
              Symmetric billing transactions are cryptographically logged as <code className="bg-gray-200 px-1 py-0.5 rounded text-[9px] font-mono">PAYMENT_SETTLED</code>.
            </p>
          </div>
        </aside>

      </div>
    </>
  );
};

export default RegisteredPaymentsPage;
