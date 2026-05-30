import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import apiClient from '@/lib/apiClient.js';
import { Search, AlertCircle, MapPin, Phone, Activity, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const DispatcherDashboard = () => {
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
      <main className="min-h-screen bg-muted/20 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Dispatcher Dashboard</h1>
              <p className="text-muted-foreground">Manage active emergency requests and resource allocation.</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search ID or Phone..." 
                  className="pl-8 bg-background text-foreground"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] bg-background text-foreground">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? (
              Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-xl" />)
            ) : filteredRequests.length === 0 ? (
              <div className="col-span-full py-20 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium">No Active Requests</h3>
                <p className="text-muted-foreground">All clear at the moment.</p>
              </div>
            ) : (
              filteredRequests.map(req => (
                <Card key={req.id} className="flex flex-col border-border/50 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
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
                        <span className="line-clamp-2">{req.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span>{req.contact_phone}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                        <span className="line-clamp-2 text-muted-foreground italic">
                          {req.symptoms_description || 'No description provided'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 pt-4 mt-auto border-t border-border">
                      <div className="text-xs">
                        <span className="block text-muted-foreground">Responder</span>
                        <span className={req.assigned_responder_id ? 'font-medium' : 'text-destructive font-medium'}>
                          {req.assigned_responder_id ? 'Assigned' : 'Unassigned'}
                        </span>
                      </div>
                      <div className="text-xs">
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
                        {req.assigned_responder_id ? 'Reassign Responder' : 'Assign Responder'}
                      </Button>
                      <Button 
                        size="sm" 
                        variant={req.assigned_ambulance_id ? "outline" : "default"}
                        className="w-full text-xs"
                        onClick={() => openAssignModal(req, 'ambulance')}
                      >
                        {req.assigned_ambulance_id ? 'Reassign Amb.' : 'Assign Amb.'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
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
      </main>
    </>
  );
};

export default DispatcherDashboard;