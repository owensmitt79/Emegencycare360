import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import apiClient from '@/lib/apiClient.js';
import { Loader2, Navigation } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// Custom icons using Lucide SVGs wrapped in divIcon
const createCustomIcon = (color, type) => {
  const iconSvg = type === 'ambulance' 
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11h2"/><path d="M15 18H9"/><path d="M19 18h2v-6l-3.4-5.4A2 2 0 0 0 15.9 6H14"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/><path d="M10 10h4"/><path d="M12 8v4"/></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="10" r="3"/><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z"/></svg>`;
    
  return L.divIcon({
    html: iconSvg,
    className: 'bg-transparent',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};

const ResponderTrackingMap = () => {
  const [responders, setResponders] = useState([]);
  const [ambulances, setAmbulances] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default center (can be dynamically set to the base region)
  const defaultCenter = [6.5244, 3.3792]; // Lagos approx for demo

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Placeholder for real API
        setResponders([]);
        setAmbulances([]);
      } catch (error) {
        console.error('Error fetching tracking data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      // Cleanup subscriptions when we have them
    };
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'available': return '#22c55e'; // green
      case 'busy': 
      case 'en_route':
      case 'on_scene': return '#eab308'; // yellow
      default: return '#ef4444'; // red
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-muted/30">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Live Tracking | Emergencycare360</title></Helmet>
      <div className="h-[calc(100vh-80px)] w-full relative">
        <MapContainer center={defaultCenter} zoom={11} className="w-full h-full z-0">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {responders.map(resp => resp.current_latitude && resp.current_longitude && (
            <Marker 
              key={`resp-${resp.id}`} 
              position={[resp.current_latitude, resp.current_longitude]}
              icon={createCustomIcon(getStatusColor(resp.status), 'responder')}
            >
              <Popup className="rounded-xl">
                <div className="p-1">
                  <h3 className="font-bold text-sm">{resp.employee_id}</h3>
                  <p className="text-xs capitalize text-muted-foreground mb-1">Status: {resp.status}</p>
                  <p className="text-xs">Rating: {resp.rating} ★</p>
                </div>
              </Popup>
            </Marker>
          ))}

          {ambulances.map(amb => amb.current_latitude && amb.current_longitude && (
            <Marker 
              key={`amb-${amb.id}`} 
              position={[amb.current_latitude, amb.current_longitude]}
              icon={createCustomIcon(getStatusColor(amb.status), 'ambulance')}
            >
              <Popup>
                <div className="p-1">
                  <h3 className="font-bold text-sm">{amb.vehicle_number}</h3>
                  <p className="text-xs capitalize text-muted-foreground mb-1">Type: {amb.type}</p>
                  <p className="text-xs capitalize">Status: {amb.status}</p>
                  <p className="text-xs">Fuel: {amb.fuel_level}%</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        
        {/* Floating Legend Panel */}
        <Card className="absolute top-4 right-4 z-10 w-48 shadow-lg border-border/50">
          <CardContent className="p-4 space-y-3">
            <h4 className="font-semibold text-sm border-b pb-2">Legend</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500"></span> Available</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-yellow-500"></span> Busy / En Route</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500"></span> Offline / Out</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ResponderTrackingMap;