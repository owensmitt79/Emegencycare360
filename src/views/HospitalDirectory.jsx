import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import apiClient from '@/lib/apiClient.js';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { 
  Building2, Search, MapPin, Phone, Activity, 
  Home, Users, AlertTriangle, FileText, Settings, ChevronDown, 
  HelpCircle, Bell, User, CheckCircle2, ChevronRight, Shield, 
  ShieldAlert, Check, X, Building, UserCheck
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const customIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="M9 15h6"/></svg>`,
  className: 'bg-white rounded-md shadow-sm p-0.5',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

const HospitalDirectory = () => {
  const { currentAdmin } = useAdminAuth();
  const adminName = currentAdmin 
    ? (currentAdmin.email === 'admin@test.com' ? 'Dr. John Doe' : `Dr. ${currentAdmin.firstName} ${currentAdmin.lastName}`) 
    : 'Dr. John Doe';

  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        // Placeholder for real API
        const records = [];
        setHospitals(records);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load hospitals');
      } finally {
        setLoading(false);
      }
    };
    fetchHospitals();
  }, []);

  const toggleCapacity = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'available' ? 'busy' : currentStatus === 'busy' ? 'full' : 'available';
    try {
      // Placeholder for real API
      setHospitals(prev => prev.map(h => h.id === id ? { ...h, capacity_status: nextStatus } : h));
      toast.success('Capacity updated');
    } catch (err) {
      toast.error('Failed to update capacity');
    }
  };

  const filtered = hospitals.filter(h => h.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <>
      <Helmet><title>Hospital Directory | Emergencycare360</title></Helmet>

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
            <a href="/hospitals" className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors bg-[#219653]/10 text-white hover:bg-white/5">
              <Building className="w-4 h-4 text-[#219653]" />
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
              <h1 className="text-xl font-bold text-gray-800 tracking-tight">Hospital Facilities Directory</h1>
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

          {/* Interactive Split Directory */}
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
            
            {/* List Side */}
            <div className="w-full lg:w-1/2 xl:w-2/5 p-6 border-r border-gray-100 overflow-y-auto h-full space-y-6">
              <div className="flex flex-col gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Building2 className="w-5.5 h-5.5 text-[#219653]" /> Medical Facilities
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">Review ER bed availabilities and tracking locations</p>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search hospitals..." 
                    className="pl-9 bg-background text-foreground text-sm"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8"><Activity className="w-6 h-6 animate-spin mx-auto text-[#219653]" /></div>
                ) : filtered.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-sm">No facilities found.</div>
                ) : (
                  filtered.map(hosp => (
                    <Card key={hosp.id} className="hover:shadow-md transition-shadow border-gray-100">
                      <CardContent className="p-4 sm:p-5">
                        <div className="flex justify-between items-start gap-2 mb-3">
                          <h3 className="font-bold text-slate-800 text-base leading-snug">{hosp.name}</h3>
                          <Badge 
                            variant={hosp.capacity_status === 'available' ? 'default' : hosp.capacity_status === 'busy' ? 'secondary' : 'destructive'} 
                            className="shrink-0 cursor-pointer font-bold capitalize text-[10px]"
                            onClick={() => toggleCapacity(hosp.id, hosp.capacity_status)}
                          >
                            {hosp.capacity_status}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-xs text-gray-500">
                          <p className="flex items-start gap-2">
                            <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-gray-400" /> 
                            <span className="line-clamp-2 text-gray-700">{hosp.address}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 shrink-0 text-gray-400" /> 
                            <span className="text-gray-700 font-medium">{hosp.emergency_phone} (ER)</span>
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>

            {/* Map Side */}
            <div className="w-full lg:w-1/2 xl:w-3/5 h-full bg-gray-50 relative z-0">
              <MapContainer center={[6.5244, 3.3792]} zoom={12} className="w-full h-full">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {hospitals.map(hosp => hosp.latitude && hosp.longitude && (
                  <Marker key={`map-${hosp.id}`} position={[hosp.latitude, hosp.longitude]} icon={customIcon}>
                    <Popup>
                      <div className="p-1 min-w-[200px]">
                        <h4 className="font-bold text-sm mb-1">{hosp.name}</h4>
                        <p className="text-xs mb-2">{hosp.emergency_phone}</p>
                        <Badge variant={hosp.capacity_status === 'available' ? 'default' : 'destructive'} className="text-[10px]">
                          {hosp.capacity_status}
                        </Badge>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

          </div>
        </main>
      </div>
    </>
  );
};

export default HospitalDirectory;