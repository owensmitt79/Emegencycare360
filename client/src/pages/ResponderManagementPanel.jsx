import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import apiClient from '@/lib/apiClient.js';
import { Search, UserPlus, FileEdit, Filter, ShieldAlert } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const ResponderManagementPanel = () => {
  const [responders, setResponders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchResponders = async () => {
    try {
      // Expand base_location_id to show name instead of ID
      // Placeholder for real API
      const records = [];
      setResponders(records);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load responders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResponders();
  }, []);

  const filtered = responders.filter(r => 
    r.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.certification_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Helmet><title>Responder Management | Emergencycare360</title></Helmet>
      <main className="min-h-screen bg-muted/20 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <ShieldAlert className="w-8 h-8 text-primary" />
                Responder Staff
              </h1>
              <p className="text-muted-foreground mt-1">Manage active emergency responders and paramedics.</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search ID..." 
                  className="pl-8 bg-background text-foreground"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="default" className="gap-2">
                <UserPlus className="w-4 h-4" /> Add New
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              Array(8).fill(0).map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-xl" />)
            ) : filtered.length === 0 ? (
              <div className="col-span-full py-12 text-center text-muted-foreground">No responders found.</div>
            ) : (
              filtered.map(resp => (
                <Card key={resp.id} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg">{resp.employee_id}</h3>
                        <p className="text-xs text-muted-foreground font-mono">{resp.certification_number}</p>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                        resp.status === 'available' ? 'bg-green-100 text-green-700' :
                        resp.status === 'busy' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {resp.status}
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm mb-6">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Base:</span>
                        <span className="font-medium truncate pl-2 max-w-[150px]">
                          {resp.expand?.base_location_id?.name || 'Unassigned'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rating:</span>
                        <span className="font-medium">{resp.rating || 'N/A'} ★</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Responses:</span>
                        <span className="font-medium">{resp.total_responses || 0}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 border-t pt-4">
                      <Button variant="outline" size="sm" className="w-full text-xs h-8">
                        <FileEdit className="w-3 h-3 mr-1" /> Edit
                      </Button>
                      <Button variant="secondary" size="sm" className="w-full text-xs h-8">
                        Reports
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default ResponderManagementPanel;