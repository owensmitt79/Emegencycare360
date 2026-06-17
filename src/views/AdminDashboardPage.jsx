import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import { 
  Home, Users, AlertTriangle, FileText, Settings, 
  ChevronDown, HelpCircle, Bell, User, CheckCircle2, ChevronRight,
  Shield, Activity, Crosshair, ShieldAlert, Check, X, Building,
  UserPlus, Plus, Trash2, UserCheck
} from 'lucide-react';

const AdminDashboardPage = () => {
  const { currentAdmin } = useAdminAuth();
  const adminName = currentAdmin 
    ? (currentAdmin.email === 'admin@test.com' ? 'Dr. John Doe' : `Dr. ${currentAdmin.firstName} ${currentAdmin.lastName}`) 
    : 'Dr. John Doe';

  // Mock Registered Patient & Doctor Counts
  const [totalPatients, setTotalPatients] = useState(142);
  const [totalDoctors, setTotalDoctors] = useState(52);

  // Mock Active Emergency Requests
  const [emergencies, setEmergencies] = useState([
    { id: 'EMG-8492', type: 'Trauma / Accident', priority: 'Critical', address: '12 Herbert Macaulay Way, Yaba, Lagos', responder: 'Ambulance 04', status: 'Dispatched' },
    { id: 'EMG-3901', type: 'Cardiac Distress', priority: 'Critical', address: 'Plot 42, Garki Area 11, Abuja', responder: 'Unassigned', status: 'Pending' },
    { id: 'EMG-5812', type: 'Severe Burn', priority: 'High', address: 'Block C, University Road, Akoka', responder: 'Ambulance 09', status: 'En Route' },
    { id: 'EMG-9021', type: 'Respiratory Arrest', priority: 'Critical', address: '67 Toyin Street, Ikeja, Lagos', responder: 'Unassigned', status: 'Pending' }
  ]);

  // Mock Pending Doctors Verification Queue
  const [pendingDoctors, setPendingDoctors] = useState([
    { id: 'DOC-883', name: 'Dr. Sarah Yusuf', specialization: 'Emergency Medicine', hospital: 'LASUTH, Lagos', license: 'MDCN/8942', experience: '8 Years' },
    { id: 'DOC-219', name: 'Dr. Emeka Okafor', specialization: 'Cardiology', hospital: 'National Hospital Abuja', license: 'MDCN/3156', experience: '12 Years' }
  ]);

  // Mock Patients List for Assignments
  const [patients, setPatients] = useState([
    { id: 'PAT-849', name: 'John Doe', age: 34, condition: 'Severe Trauma Care' },
    { id: 'PAT-301', name: 'Aisha Bello', age: 29, condition: 'Cardiology Follow-up' },
    { id: 'PAT-512', name: 'Chinedu Okafor', age: 47, condition: 'Hypertension Monitoring' },
    { id: 'PAT-902', name: 'Fatima Umar', age: 23, condition: 'General Medicine Consultation' }
  ]);

  // Doctors list for assignments
  const [availableDoctorsForAssignment, setAvailableDoctorsForAssignment] = useState([
    { id: 'DOC-883', name: 'Dr. Sarah Yusuf', specialization: 'Emergency Medicine' },
    { id: 'DOC-219', name: 'Dr. Emeka Okafor', specialization: 'Cardiology' },
    { id: 'DOC-905', name: 'Dr. Kunle Alabi', specialization: 'General Practice' }
  ]);

  // Current Assignments
  const [assignments, setAssignments] = useState([
    { id: 'ASG-101', patientId: 'PAT-849', patientName: 'John Doe', doctorId: 'DOC-883', doctorName: 'Dr. Sarah Yusuf', date: '2026-06-10' },
    { id: 'ASG-102', patientId: 'PAT-301', patientName: 'Aisha Bello', doctorId: 'DOC-219', doctorName: 'Dr. Emeka Okafor', date: '2026-06-10' }
  ]);

  // Form selections
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');

  const handleVerifyDoctor = (id) => {
    setPendingDoctors(prev => prev.filter(doc => doc.id !== id));
  };

  const handleRejectDoctor = (id) => {
    setPendingDoctors(prev => prev.filter(doc => doc.id !== id));
  };

  const handleAssign = (e) => {
    e.preventDefault();
    if (!selectedPatientId || !selectedDoctorId) {
      alert("Please select both a patient and a doctor.");
      return;
    }
    const patient = patients.find(p => p.id === selectedPatientId);
    const doctor = availableDoctorsForAssignment.find(d => d.id === selectedDoctorId);
    
    if (patient && doctor) {
      // Check if already assigned
      if (assignments.some(a => a.patientId === patient.id && a.doctorId === doctor.id)) {
        alert("This patient is already assigned to this doctor.");
        return;
      }
      
      const newAssignment = {
        id: `ASG-${Date.now()}`,
        patientId: patient.id,
        patientName: patient.name,
        doctorId: doctor.id,
        doctorName: doctor.name,
        date: new Date().toISOString().split('T')[0]
      };
      setAssignments(prev => [newAssignment, ...prev]);
      setSelectedPatientId('');
      setSelectedDoctorId('');
    }
  };

  const handleUnassign = (id) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
  };

  return (
    <>
      <Helmet>
        <title>Operations Admin | Emergencycare360</title>
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
            <a href="/admin/dashboard" className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors bg-[#219653]/10 text-white hover:bg-white/5">
              <Home className="w-4 h-4 text-[#219653]" />
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
          
          {/* Top Alert Banner */}
          <div className="bg-[#fff5f5] text-[#e53e3e] px-4 py-2.5 text-xs font-medium flex items-center justify-center gap-2 border-b border-[#fed7d7]">
            <ShieldAlert className="w-4 h-4" />
            <span>Alert: {pendingDoctors.length} doctors are pending credential verification. Access will remain locked until verified.</span>
          </div>

          {/* Header */}
          <header className="h-16 border-b border-gray-100 flex items-center justify-between px-6 flex-shrink-0 bg-white sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-800 tracking-tight">Clinical Operations Dashboard</h1>
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
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white" />
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
            <div className="max-w-4xl mx-auto space-y-10">
              
              {/* Operational Banner */}
              <div className="rounded-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row bg-white shadow-sm hover:shadow-md transition-shadow">
                {/* Left Visual Area */}
                <div className="w-full md:w-[40%] relative bg-[#0b1b14] overflow-hidden min-h-[200px] flex items-center justify-center">
                  <div className="absolute inset-0 opacity-80" 
                    style={{ background: 'radial-gradient(circle at top left, #0d8c47 0%, transparent 70%)' }} />
                  
                  <div className="z-10 text-center space-y-2">
                    <Crosshair className="w-12 h-12 text-[#219653] mx-auto animate-pulse" />
                    <div className="text-white font-mono text-sm font-semibold tracking-wider">Active GPS Tracking</div>
                    <div className="text-slate-400 text-xs font-mono">12 Responders Integrated</div>
                  </div>
                </div>

                {/* Right Text Area */}
                <div className="w-full md:w-[60%] p-8 flex flex-col justify-center">
                  <span className="text-[10px] font-bold text-blue-600 tracking-widest uppercase mb-3">Incident Management</span>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Emergencycare360 Control Center</h3>
                  <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                    Verify healthcare licenses, dispatch mobile medical response fleets, and manage patient consultation channels in strict adherence to HIPAA patient record security guidelines.
                  </p>
                  <div className="flex gap-2">
                    <a href="/dispatcher" className="bg-[#219653] hover:bg-[#1e874b] text-white px-5 py-2.5 rounded text-sm font-semibold transition-colors">
                      Open Dispatch Portal
                    </a>
                  </div>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Emergencies</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">{emergencies.filter(e => e.status === 'Pending').length} Pending</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">12 Dispatched</p>
                </div>
                <div className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Registered Patients</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">{totalPatients}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Across healthcare network</p>
                </div>
                <div className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Registered Doctors</p>
                  <p className="text-2xl font-bold text-[#219653] mt-1">{totalDoctors}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">48 Verified • 4 Pending</p>
                </div>
                <div className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">HIPAA Audit Logs</p>
                  <p className="text-2xl font-bold text-green-700 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-5 h-5 text-green-600" /> Active
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">100% compliant logging</p>
                </div>
              </div>

              {/* Emergency Requests Registry Table */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-gray-900">Active Incident Dispatch Queue</h3>
                  <span className="text-xs text-gray-400 font-medium">Realtime sync active</span>
                </div>
                
                <div className="overflow-x-auto border border-gray-100 rounded-xl bg-white shadow-sm">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="p-3 font-semibold text-gray-600">Incident ID</th>
                        <th className="p-3 font-semibold text-gray-600">Emergency Type</th>
                        <th className="p-3 font-semibold text-gray-600">Priority</th>
                        <th className="p-3 font-semibold text-gray-600">Address</th>
                        <th className="p-3 font-semibold text-gray-600">Assigned Fleet</th>
                        <th className="p-3 font-semibold text-gray-600 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {emergencies.map((emg, i) => (
                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-3 font-semibold text-slate-700 font-mono text-xs">{emg.id}</td>
                          <td className="p-3 text-slate-800 font-medium">{emg.type}</td>
                          <td className="p-3">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase
                              ${emg.priority === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                              {emg.priority}
                            </span>
                          </td>
                          <td className="p-3 text-gray-500 text-xs max-w-[200px] truncate">{emg.address}</td>
                          <td className="p-3 text-slate-700 font-medium text-xs">{emg.responder}</td>
                          <td className="p-3 text-right">
                            <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold
                              ${emg.status === 'Pending' ? 'bg-red-50 text-red-600 animate-pulse' : 
                                emg.status === 'En Route' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'}`}>
                              {emg.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Patient-Doctor Assignment Console */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-gray-900">Assign Patient to Consultant Doctor</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Assignment Form */}
                  <div className="md:col-span-1 p-5 border border-gray-100 rounded-xl bg-white shadow-sm flex flex-col justify-between">
                    <form onSubmit={handleAssign} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Select Patient</label>
                        <select
                          value={selectedPatientId}
                          onChange={(e) => setSelectedPatientId(e.target.value)}
                          className="w-full text-sm rounded-lg border border-gray-200 bg-white p-2.5 outline-none focus:border-[#219653] focus:ring-1 focus:ring-[#219653]"
                        >
                          <option value="">-- Choose Patient --</option>
                          {patients.map(p => (
                            <option key={p.id} value={p.id}>{p.name} ({p.condition})</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Select Doctor</label>
                        <select
                          value={selectedDoctorId}
                          onChange={(e) => setSelectedDoctorId(e.target.value)}
                          className="w-full text-sm rounded-lg border border-gray-200 bg-white p-2.5 outline-none focus:border-[#219653] focus:ring-1 focus:ring-[#219653]"
                        >
                          <option value="">-- Choose Doctor --</option>
                          {availableDoctorsForAssignment.map(d => (
                            <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>
                          ))}
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-[#219653] hover:bg-[#1e874b] text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                      >
                        <UserPlus className="w-4 h-4" /> Assign Consultant
                      </button>
                    </form>
                  </div>

                  {/* Assignments List */}
                  <div className="md:col-span-2 p-5 border border-gray-100 rounded-xl bg-white shadow-sm flex flex-col">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Active Clinical Assignments</h4>
                    {assignments.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
                        <Users className="w-8 h-8 text-gray-300 mb-2" />
                        <p className="text-xs font-medium text-gray-500">No active patient-doctor assignments.</p>
                      </div>
                    ) : (
                      <div className="overflow-y-auto max-h-[190px] divide-y divide-gray-100 pr-1">
                        {assignments.map((asg) => (
                          <div key={asg.id} className="py-2.5 flex items-center justify-between text-sm first:pt-0 last:pb-0">
                            <div>
                              <p className="font-semibold text-slate-800">{asg.patientName}</p>
                              <p className="text-xs text-gray-400 mt-0.5">Assigned to: <span className="text-slate-600 font-medium">{asg.doctorName}</span></p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] text-gray-400 font-mono">{asg.date}</span>
                              <button
                                onClick={() => handleUnassign(asg.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-colors"
                                title="Unassign"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>



            </div>
          </div>
        </main>

        {/* ── Right Sidebar (Facilities Status & Logs) ── */}
        <aside className="w-[280px] bg-white border-l border-gray-100 hidden flex-col p-8 flex-shrink-0 z-10 xl:flex justify-between">
          <div>
            <div className="flex justify-between items-center mb-8">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Medical Facilities</span>
              <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded uppercase">Live Status</span>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0" />
                  <div>
                    <h5 className="text-xs font-bold text-gray-800">Lagos State Univ. Hospital (LASUTH)</h5>
                    <p className="text-[10px] text-gray-400 mt-0.5 font-medium">EMERGENCY ROOM: 4 Available Beds</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-t border-gray-50 pt-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0" />
                  <div>
                    <h5 className="text-xs font-bold text-gray-800">National Hospital Abuja</h5>
                    <p className="text-[10px] text-gray-400 mt-0.5 font-medium">EMERGENCY ROOM: 6 Available Beds</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-t border-gray-50 pt-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <div>
                    <h5 className="text-xs font-bold text-gray-800">St. Nicholas Hospital, Lagos</h5>
                    <p className="text-[10px] text-gray-400 mt-0.5 font-medium">EMERGENCY ROOM: 0 Beds (Full Capacity)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#fafafa] border border-gray-100 rounded-lg p-4 space-y-2.5">
            <h5 className="text-[10px] font-bold text-gray-500 tracking-wider uppercase flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-gray-400" /> Recent HIPAA Audits
            </h5>
            <div className="space-y-1.5 text-[10px] text-gray-400 font-mono">
              <div className="border-b border-gray-200/50 pb-1">
                <span className="text-gray-600 block">[09:42:18] LOGIN_SUCCESS</span>
                <span>User: admin@emergency360.com</span>
              </div>
              <div>
                <span className="text-gray-600 block">[09:43:05] READ_PHI</span>
                <span>Audited: Doctor verification queue read</span>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </>
  );
};

export default AdminDashboardPage;
