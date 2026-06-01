import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import apiClient from '@/lib/apiClient.js';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Building2, Search, MapPin, Phone, Activity } from 'lucide-react';
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
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
        
        {/* List Section */}
        <div className="w-full lg:w-1/2 xl:w-2/5 p-4 md:p-6 bg-muted/20 border-r border-border overflow-y-auto max-h-[calc(100vh-80px)]">
          <div className="flex flex-col gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Building2 className="w-6 h-6 text-primary" /> Partner Hospitals
              </h1>
              <p className="text-sm text-muted-foreground mt-1">Manage facility capacities and details</p>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search hospitals..." 
                className="pl-8 bg-background text-foreground"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8"><Activity className="w-8 h-8 animate-spin mx-auto text-primary" /></div>
            ) : filtered.map(hosp => (
              <Card key={hosp.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <h3 className="font-bold text-lg leading-tight">{hosp.name}</h3>
                    <Badge variant={hosp.capacity_status === 'available' ? 'default' : hosp.capacity_status === 'busy' ? 'secondary' : 'destructive'} 
                           className="shrink-0 cursor-pointer"
                           onClick={() => toggleCapacity(hosp.id, hosp.capacity_status)}>
                      {hosp.capacity_status}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 shrink-0 mt-0.5" /> 
                      <span className="line-clamp-2 text-foreground">{hosp.address}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4 shrink-0" /> 
                      <span className="text-foreground font-medium">{hosp.emergency_phone} (ER)</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Map Section */}
        <div className="w-full lg:w-1/2 xl:w-3/5 h-[50vh] lg:h-auto bg-background relative z-0">
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
    </>
  );
};

export default HospitalDirectory;