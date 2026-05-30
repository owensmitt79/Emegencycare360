import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import apiClient from '@/lib/apiClient.js';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Clock, Phone, AlertTriangle, CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const createDotIcon = (color) => L.divIcon({
  html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>`,
  className: 'bg-transparent',
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

const EmergencyRequestStatus = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [ambulance, setAmbulance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        // Placeholder for real API
        setRequest({ id: requestId, status: 'pending', emergency_type: 'medical', priority: 'high', address: 'Loading...', latitude: 0, longitude: 0 });
      } catch (err) {
        console.error(err);
        toast.error('Could not load request details.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();

    return () => {
      // Cleanup
    };
  }, [requestId]);

  const handleCancel = async () => {
    if (window.confirm("Are you sure you want to cancel this emergency request?")) {
      try {
        // Placeholder for API
        setRequest(prev => ({ ...prev, status: 'cancelled' }));
        toast.success("Request cancelled successfully.");
      } catch (err) {
        toast.error("Failed to cancel request.");
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!request) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Request Not Found</h2>
        <Button onClick={() => navigate('/')}>Return Home</Button>
      </div>
    );
  }

  const getStepStatus = (stepName) => {
    const flow = ['pending', 'dispatched', 'en_route', 'arrived', 'completed'];
    const currentIdx = flow.indexOf(request.status);
    const stepIdx = flow.indexOf(stepName);
    
    if (request.status === 'cancelled') return 'cancelled';
    if (currentIdx >= stepIdx) return 'completed';
    if (currentIdx === stepIdx - 1) return 'active';
    return 'pending';
  };

  return (
    <>
      <Helmet><title>Status Tracker | Emergencycare360</title></Helmet>
      <main className="min-h-screen bg-muted/20 pb-20">
        <div className="bg-primary text-primary-foreground py-6 px-4 md:px-8 shadow-sm">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/20" onClick={() => navigate('/')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Emergency Request Tracker</h1>
              <p className="text-sm opacity-90 font-mono">ID: {request.id}</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-8 px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {['pending', 'dispatched', 'en_route', 'arrived', 'completed'].map((step, idx) => {
                    const status = getStepStatus(step);
                    return (
                      <div key={step} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                            status === 'completed' ? 'bg-primary border-primary' :
                            status === 'active' ? 'bg-background border-primary animate-pulse' :
                            'bg-muted border-muted-foreground'
                          }`}>
                            {status === 'completed' && <CheckCircle2 className="w-4 h-4 text-primary-foreground" />}
                          </div>
                          {idx < 4 && <div className={`w-0.5 h-8 ${status === 'completed' ? 'bg-primary' : 'bg-muted'}`} />}
                        </div>
                        <div className="pt-0.5">
                          <p className={`font-semibold capitalize ${status === 'pending' ? 'text-muted-foreground' : 'text-foreground'}`}>
                            {step.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Type & Priority</p>
                  <p className="font-medium capitalize">{request.emergency_type} - <span className="text-destructive">{request.priority}</span></p>
                </div>
                <div>
                  <p className="text-muted-foreground">Location</p>
                  <p className="font-medium">{request.address}</p>
                </div>
                {request.status === 'pending' && (
                  <Button variant="destructive" className="w-full mt-4" onClick={handleCancel}>
                    Cancel Request
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card className="overflow-hidden h-[500px] border-border/50 shadow-md relative">
              {(request.latitude && request.longitude) ? (
                <MapContainer center={[request.latitude, request.longitude]} zoom={13} className="w-full h-full z-0">
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  
                  {/* Incident Location */}
                  <Marker position={[request.latitude, request.longitude]} icon={createDotIcon('#ef4444')}>
                    <Popup>Incident Location</Popup>
                  </Marker>

                  {/* Ambulance Location */}
                  {ambulance?.current_latitude && (
                    <Marker position={[ambulance.current_latitude, ambulance.current_longitude]} icon={createDotIcon('#3b82f6')}>
                      <Popup>Assigned Ambulance</Popup>
                    </Marker>
                  )}
                </MapContainer>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-muted text-muted-foreground">
                  <AlertTriangle className="w-12 h-12 mb-2 opacity-50" />
                  <p>Location map unavailable</p>
                </div>
              )}
              
              {ambulance && request.status !== 'completed' && request.status !== 'arrived' && (
                <div className="absolute top-4 left-4 z-10 bg-background/95 backdrop-blur border border-border shadow-lg rounded-lg p-4">
                  <p className="text-sm font-bold flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" /> ETA: Calculating...
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Ambulance {ambulance.vehicle_number} is on the way</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </>
  );
};

export default EmergencyRequestStatus;