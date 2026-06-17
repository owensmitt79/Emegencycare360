import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import apiClient from '@/lib/apiClient.js';
import { 
  Search, AlertCircle, MapPin, Phone, Activity, CheckCircle, 
  Home, Users, AlertTriangle, FileText, Settings, ChevronDown, 
  HelpCircle, Bell, User, CheckCircle2, ChevronRight, Shield, 
  ShieldAlert, Check, X, Building, UserCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const DispatcherDashboard = () => {
  const { currentAdmin } = useAdminAuth();
  const adminName = currentAdmin 
    ? (currentAdmin.email === 'admin@test.com' ? 'Dr. John Doe' : `Dr. ${currentAdmin.firstName} ${currentAdmin.lastName}`) 
    : 'Dr. John Doe';

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [assignType, setAssignType] = useState(''); // 'responder' or 'ambulance'
  const [availableResources, setAvailableResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(false);

  const fetchRequests = async () => {
    try {
      // Placeholder for real API call
      const records = { items: [] };
      setRequests(records.items);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch emergency requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();

    // Subscribe to real-time updates when available
    return () => {
      // Cleanup subscriptions
    };
  }, []);

  const openAssignModal = async (request, type) => {
    setSelectedRequest(request);
    setAssignType(type);
    setAssignModalOpen(true);
    setLoadingResources(true);
    
    try {
      let records = { items: [] };
      if (type === 'responder') {
        // Placeholder
      } else {
        // Placeholder
      }
      setAvailableResources(records.items);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to load available ${type}s`);
    } finally {
      setLoadingResources(false);
    }
  };

  const handleAssign = async (resourceId) => {
    try {
      const updateData = {};
      if (assignType === 'responder') {
        updateData.assigned_responder_id = resourceId;
        // Optionally update status if currently pending
        if (selectedRequest.status === 'pending') updateData.status = 'dispatched';
      } else {
        updateData.assigned_ambulance_id = resourceId;
      }

      // Placeholder API call
      console.log('Assigning resource', resourceId, 'to request', selectedRequest.id, updateData);

      toast.success(`Successfully assigned ${assignType}`);
      setAssignModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error('Assignment failed.');
    }
  };

  const updateRequestStatus = async (id, newStatus) => {
    try {
      // Placeholder for real API
      console.log('Updating status', id, newStatus);
      toast.success('Status updated');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status');
    }
  };

  const filteredRequests = requests.filter(r => {
    const matchesSearch = r.id.toLowerCase().includes(searchTerm.toLowerCase()) || r.contact_phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getPriorityColor = (p) => {
    switch(p) {
      case 'critical': return 'bg-red-600 hover:bg-red-700 text-white';
      case 'high': return 'bg-orange-500 hover:bg-orange-600 text-white';
      case 'medium': return 'bg-yellow-500 hover:bg-yellow-600 text-white';
      default: return 'bg-blue-500 hover:bg-blue-600 text-white';
    }
  };

  return (
    <>
      <Helmet><title>Dispatcher Dashboard | Emergencycare360</title></Helmet>

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
            <a href="/dispatcher" className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors bg-[#219653]/10 text-white hover:bg-white/5">
              <AlertTriangle className="w-4 h-4 text-[#219653]" />
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
              <h1 className="text-xl font-bold text-gray-800 tracking-tight">Dispatcher Control Dashboard</h1>
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
                  <h2 className="text-2xl font-bold text-gray-900">Incident Registry & Dispatch</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage active emergency requests and resource allocation.</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search ID or Phone..." 
                      className="pl-8 bg-background text-foreground text-sm"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px] bg-background text-foreground text-sm">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="dispatched">Dispatched</SelectItem>
                      <SelectItem value="en_route">En Route</SelectItem>
                      <SelectItem value="arrived">Arrived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {error && (
                <div className="bg-destructive/10 text-destructive p-4 rounded-lg flex items-center justify-between">
                  <span>{error}</span>
                  <Button variant="outline" size="sm" onClick={fetchRequests}>Retry</Button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? (
                  Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-xl" />)
                ) : filteredRequests.length === 0 ? (
                  <div className="col-span-full py-20 text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-medium">No Active Requests</h3>
                    <p className="text-muted-foreground">All clear at the moment.</p>
                  </div>
                ) : (
                  filteredRequests.map(req => (
                    <Card key={req.id} className="flex flex-col border-border/50 shadow-sm hover:shadow-md transition-shadow animate-fade-in">
                      <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
                        <div>
                          <CardTitle className="text-base flex items-center gap-2">
                            <span className="uppercase">{req.emergency_type}</span>
                            <Badge className={getPriorityColor(req.priority)}>{req.priority}</Badge>
                          </CardTitle>
                          <p className="text-xs text-muted-foreground mt-1 font-mono">{req.id}</p>
                        </div>
                        <Select value={req.status} onValueChange={(val) => updateRequestStatus(req.id, val)}>
                          <SelectTrigger className="w-[120px] h-8 text-xs bg-background text-foreground">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="dispatched">Dispatched</SelectItem>
                            <SelectItem value="en_route">En Route</SelectItem>
                            <SelectItem value="arrived">Arrived</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </CardHeader>
                      <CardContent className="flex-1 space-y-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                            <span className="line-clamp-2 text-xs">{req.address}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                            <span className="text-xs">{req.contact_phone}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                            <span className="line-clamp-2 text-muted-foreground italic text-xs">
                              {req.symptoms_description || 'No description provided'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 pt-4 mt-auto border-t border-border">
                          <div className="text-[11px]">
                            <span className="block text-muted-foreground">Responder</span>
                            <span className={req.assigned_responder_id ? 'font-medium' : 'text-destructive font-medium'}>
                              {req.assigned_responder_id ? 'Assigned' : 'Unassigned'}
                            </span>
                          </div>
                          <div className="text-[11px]">
                            <span className="block text-muted-foreground">Ambulance</span>
                            <span className={req.assigned_ambulance_id ? 'font-medium' : 'text-destructive font-medium'}>
                              {req.assigned_ambulance_id ? 'Assigned' : 'Unassigned'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-4">
                          <Button 
                            size="sm" 
                            variant={req.assigned_responder_id ? "outline" : "default"}
                            className="w-full text-xs"
                            onClick={() => openAssignModal(req, 'responder')}
                          >
                            {req.assigned_responder_id ? 'Reassign' : 'Assign Responder'}
                          </Button>
                          <Button 
                            size="sm" 
                            variant={req.assigned_ambulance_id ? "outline" : "default"}
                            className="w-full text-xs"
                            onClick={() => openAssignModal(req, 'ambulance')}
                          >
                            {req.assigned_ambulance_id ? 'Reassign' : 'Assign Amb.'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
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
                <span>Audited: Incident registry queue read</span>
              </div>
            </div>
          </div>
        </aside>

      </div>

      {/* Assign Modal */}
      <Dialog open={assignModalOpen} onOpenChange={setAssignModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign {assignType === 'responder' ? 'Responder' : 'Ambulance'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {loadingResources ? (
              <div className="flex justify-center p-8"><Activity className="w-6 h-6 animate-spin text-primary" /></div>
            ) : availableResources.length === 0 ? (
              <p className="text-center text-muted-foreground p-4">No available resources found.</p>
            ) : (
              availableResources.map(res => (
                <div key={res.id} className="flex items-center justify-between p-3 border border-border rounded-lg bg-card">
                  <div>
                    <p className="font-semibold">{assignType === 'responder' ? res.employee_id : res.vehicle_number}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {assignType === 'responder' ? `Rating: ${res.rating}` : `Type: ${res.type}`}
                    </p>
                  </div>
                  <Button size="sm" onClick={() => handleAssign(res.id)}>Assign</Button>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DispatcherDashboard;