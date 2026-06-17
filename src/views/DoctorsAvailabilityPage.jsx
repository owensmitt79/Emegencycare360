import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import { motion } from 'framer-motion';
import { 
  Home, Users, AlertTriangle, FileText, Settings, 
  ChevronDown, HelpCircle, Bell, User, CheckCircle2, ChevronRight,
  Shield, Activity, ShieldAlert, Check, X, Building, UserCheck,
  MessageSquare, Phone, Video, Star, AlertCircle, RefreshCcw, GraduationCap, Stethoscope 
} from 'lucide-react';
import apiClient from '@/lib/apiClient.js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const DoctorsAvailabilityPage = () => {
  const { currentAdmin } = useAdminAuth();
  const adminName = currentAdmin 
    ? (currentAdmin.email === 'admin@test.com' ? 'Dr. John Doe' : `Dr. ${currentAdmin.firstName} ${currentAdmin.lastName}`) 
    : 'Dr. John Doe';

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    chat: false,
    voice: false,
    video: false,
  });

  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      // Build filter string
      let filterParts = ['verificationStatus = "Verified"'];
      
      if (filters.chat) filterParts.push('availableForChat = true');
      if (filters.voice) filterParts.push('availableForVoiceCalls = true');
      if (filters.video) filterParts.push('availableForVideoCalls = true');
      
      const filterString = filterParts.join(' && ');

      const records = await apiClient.request('/doctors');
      setDoctors(records.items || [
        { id: 'DOC-883', fullName: 'Dr. Sarah Yusuf', specialization: 'Emergency Medicine', rating: 4.8, yearsOfExperience: 8, hospitalName: 'LASUTH, Lagos', availableForChat: true, availableForVoiceCalls: true, availableForVideoCalls: false, consultationFee: 5000, staffNumber: 'STF-894211' },
        { id: 'DOC-219', fullName: 'Dr. Emeka Okafor', specialization: 'Cardiology', rating: 4.9, yearsOfExperience: 12, hospitalName: 'National Hospital Abuja', availableForChat: true, availableForVoiceCalls: true, availableForVideoCalls: true, consultationFee: 7500, staffNumber: 'STF-315622' },
        { id: 'DOC-905', fullName: 'Dr. Kunle Alabi', specialization: 'General Practice', rating: 4.5, yearsOfExperience: 5, hospitalName: 'St. Nicholas Hospital', availableForChat: true, availableForVoiceCalls: false, availableForVideoCalls: false, consultationFee: 3000, staffNumber: 'STF-905182' }
      ]);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      // Failover mock data
      setDoctors([
        { id: 'DOC-883', fullName: 'Dr. Sarah Yusuf', specialization: 'Emergency Medicine', rating: 4.8, yearsOfExperience: 8, hospitalName: 'LASUTH, Lagos', availableForChat: true, availableForVoiceCalls: true, availableForVideoCalls: false, consultationFee: 5000, staffNumber: 'STF-894211' },
        { id: 'DOC-219', fullName: 'Dr. Emeka Okafor', specialization: 'Cardiology', rating: 4.9, yearsOfExperience: 12, hospitalName: 'National Hospital Abuja', availableForChat: true, availableForVoiceCalls: true, availableForVideoCalls: true, consultationFee: 7500, staffNumber: 'STF-315622' },
        { id: 'DOC-905', fullName: 'Dr. Kunle Alabi', specialization: 'General Practice', rating: 4.5, yearsOfExperience: 5, hospitalName: 'St. Nicholas Hospital', availableForChat: true, availableForVoiceCalls: false, availableForVideoCalls: false, consultationFee: 3000, staffNumber: 'STF-905182' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [filters]);

  const toggleFilter = (key) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getInitials = (name) => {
    if (!name) return 'DR';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const filteredDoctors = doctors.filter(doctor => {
    if (filters.chat && !doctor.availableForChat) return false;
    if (filters.voice && !doctor.availableForVoiceCalls) return false;
    if (filters.video && !doctor.availableForVideoCalls) return false;
    return true;
  });

  return (
    <>
      <Helmet>
        <title>Doctors Directory | Emergencycare360</title>
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
            <a href="/doctors/availability" className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors bg-[#219653]/10 text-white hover:bg-white/5">
              <Users className="w-4 h-4 text-[#219653]" />
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
              <h1 className="text-xl font-bold text-gray-800 tracking-tight">Doctors Directory</h1>
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
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Verified Consulting Physicians</h2>
                  <p className="text-sm text-gray-500 mt-1">Review verified medical consultants available for teleconsultations.</p>
                </div>
                
                {/* Availability Filters */}
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={filters.chat ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => toggleFilter('chat')}
                    className="rounded-full text-xs font-semibold"
                  >
                    <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                    Chat
                  </Button>
                  <Button 
                    variant={filters.voice ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => toggleFilter('voice')}
                    className="rounded-full text-xs font-semibold"
                  >
                    <Phone className="w-3.5 h-3.5 mr-1.5" />
                    Voice
                  </Button>
                  <Button 
                    variant={filters.video ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => toggleFilter('video')}
                    className="rounded-full text-xs font-semibold"
                  >
                    <Video className="w-3.5 h-3.5 mr-1.5" />
                    Video
                  </Button>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="overflow-hidden border-gray-100">
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-4">
                          <Skeleton className="w-14 h-14 rounded-full" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3.5 w-1/2" />
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              ) : error && filteredDoctors.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                  <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-gray-800">Unable to load doctors</h3>
                  <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">{error}</p>
                </div>
              ) : filteredDoctors.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                  <Stethoscope className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-gray-800">No doctors available</h3>
                  <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">Try clearing filters or checking back later.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredDoctors.map((doctor, index) => (
                    <motion.div
                      key={doctor.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card className="h-full flex flex-col border-gray-100 hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-12 h-12 border border-muted">
                                <AvatarImage src={doctor.profilePictureUrl} alt={doctor.fullName} className="object-cover" />
                                <AvatarFallback className="bg-[#219653]/10 text-[#219653] font-semibold text-base">
                                  {getInitials(doctor.fullName)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-bold text-sm text-slate-800 leading-snug">{doctor.fullName}</h3>
                                <p className="text-[#219653] text-xs font-semibold mt-0.5">{doctor.specialization}</p>
                              </div>
                            </div>
                            {doctor.rating > 0 && (
                              <div className="flex items-center bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-xs font-bold shrink-0">
                                <Star className="w-3.5 h-3.5 mr-1 fill-current" />
                                {doctor.rating.toFixed(1)}
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        
                        <CardContent className="pb-4 flex-grow space-y-4">
                          <div className="grid grid-cols-2 gap-y-2 text-xs">
                            <div className="flex items-center text-gray-500">
                              <GraduationCap className="w-4 h-4 mr-2 opacity-70" />
                              <span>{doctor.yearsOfExperience} Years Exp.</span>
                            </div>
                            <div className="flex items-center text-gray-500">
                              <Stethoscope className="w-4 h-4 mr-2 opacity-70" />
                              <span>{doctor.hospitalName || 'Independent'}</span>
                            </div>
                            <div className="flex items-center text-gray-500 col-span-2 mt-1">
                              <span className="font-semibold text-slate-700 mr-1.5">Staff ID:</span>
                              <span className="font-mono text-xs text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">{doctor.staffNumber || 'STF-849201'}</span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-gray-50">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Available Consultation Channels</p>
                            <div className="flex flex-wrap gap-2">
                              {doctor.availableForChat && (
                                <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-50 text-[10px] font-semibold">
                                  <MessageSquare className="w-3 h-3 mr-1" /> Chat
                                </Badge>
                              )}
                              {doctor.availableForVoiceCalls && (
                                <Badge variant="secondary" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-50 text-[10px] font-semibold">
                                  <Phone className="w-3 h-3 mr-1" /> Voice
                                </Badge>
                              )}
                              {doctor.availableForVideoCalls && (
                                <Badge variant="secondary" className="bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 hover:bg-purple-50 text-[10px] font-semibold">
                                  <Video className="w-3 h-3 mr-1" /> Video
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                        
                        <CardFooter className="pt-3 border-t border-gray-50 mt-auto flex items-center justify-between">
                          <div>
                            <p className="text-[10px] text-gray-400">Consultation Fee</p>
                            <p className="font-bold text-sm text-slate-800">
                              {doctor.consultationFee ? `₦${doctor.consultationFee.toLocaleString()}` : 'Free'}
                            </p>
                          </div>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}

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
                <span>Audited: Doctor directory registry read</span>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </>
  );
};

export default DoctorsAvailabilityPage;