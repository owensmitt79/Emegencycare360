import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { MapPin, Navigation, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { useGPSDetector } from '@/hooks/useGPSDetector.js';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const CoverageMapPage = () => {
  const { location, detectLocation } = useGPSDetector();
  // Center map roughly over the Eastern Region
  const [mapCenter, setMapCenter] = useState([5.9, 7.3]);

  const ambulanceBases = [
    { name: 'Enugu base', position: [6.4584, 7.5464], responseTime: '8-12 min' },
    { name: 'Owerri base', position: [5.4833, 7.0333], responseTime: '10-15 min' },
    { name: 'Aba base', position: [5.1167, 7.3667], responseTime: '12-18 min' }
  ];

  const hospitals = [
    { name: 'University of Nigeria Teaching Hospital', position: [6.4225, 7.5211] },
    { name: 'Federal Medical Centre, Owerri', position: [5.4921, 7.0268] },
    { name: 'Abia State University Teaching Hospital', position: [5.1216, 7.3553] },
    { name: 'Niger Foundation Hospital', position: [6.4412, 7.5089] },
    { name: 'Memfys Hospital', position: [6.4520, 7.5100] }
  ];

  useEffect(() => {
    if (location) {
      setMapCenter([location.latitude, location.longitude]);
    }
  }, [location]);

  const ambulanceIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNkYzI2MjYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTQgMThoLTRWNmg0Ii8+PHBhdGggZD0iTTE0IDZoNGwyIDRtLTYgOGgyIi8+PGNpcmNsZSBjeD0iNiIgY3k9IjE4IiByPSIyIi8+PGNpcmNsZSBjeD0iMTgiIGN5PSIxOCIgcj0iMiIvPjwvc3ZnPg==',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  const hospitalIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMzYjgyZjYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTIgNnY2bTMtM0g5Ii8+PHJlY3Qgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiB4PSIzIiB5PSIzIiByeD0iMiIvPjwvc3ZnPg==',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28]
  });

  return (
    <>
      <Helmet>
        <title>Emergencycare360 - Coverage Map</title>
        <meta name="description" content="View our emergency response coverage across the Eastern Region and Nation wide with ambulance bases, partner hospitals, and estimated response times." />
      </Helmet>



      <main className="py-12 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3">Coverage map</h1>
            <p className="text-lg text-muted-foreground">
              Our emergency response network across the Eastern Region and Nation wide
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="rapidaid-card p-0 overflow-hidden h-[600px]">
                <MapContainer
                  center={mapCenter}
                  zoom={8}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {ambulanceBases.map((base, index) => (
                    <React.Fragment key={base.name}>
                      <Marker position={base.position} icon={ambulanceIcon}>
                        <Popup>
                          <div className="text-sm">
                            <p className="font-semibold">{base.name}</p>
                            <p className="text-muted-foreground">Response: {base.responseTime}</p>
                          </div>
                        </Popup>
                      </Marker>
                      <Circle
                        center={base.position}
                        radius={15000}
                        pathOptions={{ color: '#dc2626', fillColor: '#dc2626', fillOpacity: 0.1 }}
                      />
                      <Circle
                        center={base.position}
                        radius={30000}
                        pathOptions={{ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.05 }}
                      />
                    </React.Fragment>
                  ))}

                  {hospitals.map((hospital) => (
                    <Marker key={hospital.name} position={hospital.position} icon={hospitalIcon}>
                      <Popup>
                        <div className="text-sm">
                          <p className="font-semibold">{hospital.name}</p>
                          <p className="text-muted-foreground">Partner hospital</p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}

                  {location && (
                    <Marker position={[location.latitude, location.longitude]}>
                      <Popup>
                        <div className="text-sm">
                          <p className="font-semibold">Your location</p>
                        </div>
                      </Popup>
                    </Marker>
                  )}
                </MapContainer>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rapidaid-card">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-primary" />
                  Find nearest responder
                </h3>
                <Button onClick={detectLocation} className="w-full rapidaid-button mb-3">
                  <MapPin className="w-4 h-4 mr-2" />
                  Use my location
                </Button>
                {location && (
                  <p className="text-sm text-green-600 font-medium">
                    Location detected successfully
                  </p>
                )}
              </div>

              <div className="rapidaid-card">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Response times
                </h3>
                <div className="space-y-3">
                  {ambulanceBases.map((base) => (
                    <div key={base.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className="text-sm font-medium">{base.name}</span>
                      <span className="text-sm text-muted-foreground">{base.responseTime}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span className="text-sm font-medium">Nation wide dispatch</span>
                    <span className="text-sm text-muted-foreground">Varies by location</span>
                  </div>
                </div>
              </div>

              <div className="rapidaid-card">
                <h3 className="font-semibold mb-3">Coverage zones</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-500/20 border-2 border-red-500"></div>
                    <span>15km radius - Priority response</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-orange-500/20 border-2 border-orange-500"></div>
                    <span>30km radius - Extended coverage</span>
                  </div>
                  <div className="flex items-center gap-2 mt-4 pt-2 border-t border-border">
                    <span className="font-medium">Nation wide coverage available via partner network</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>


    </>
  );
};

export default CoverageMapPage;