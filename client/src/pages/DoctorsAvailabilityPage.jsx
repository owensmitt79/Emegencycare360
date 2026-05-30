import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare, Phone, Video, Star, AlertCircle, RefreshCcw, GraduationCap, Stethoscope } from 'lucide-react';
import apiClient from '@/lib/apiClient.js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const DoctorsAvailabilityPage = () => {
  const navigate = useNavigate();
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
      setDoctors(records.items || []);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Failed to load available doctors. Please try again later.');
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

  return (
    <>
      <Helmet>
        <title>Available Doctors - Emergencycare360</title>
        <meta name="description" content="Connect with our verified medical professionals for immediate online consultation via chat, voice, or video call." />
      </Helmet>

      <main className="min-h-screen bg-background pb-20">
        {/* Header Section */}
        <section className="bg-muted py-12 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/about" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to About
            </Link>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">Available Doctors</h1>
                <p className="text-muted-foreground max-w-2xl text-lg">
                  Connect instantly with our verified medical professionals for remote consultation and urgent health advice.
                </p>
              </div>
              
              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={filters.chat ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => toggleFilter('chat')}
                  className="rounded-full"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat
                </Button>
                <Button 
                  variant={filters.voice ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => toggleFilter('voice')}
                  className="rounded-full"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Voice
                </Button>
                <Button 
                  variant={filters.video ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => toggleFilter('video')}
                  className="rounded-full"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Video
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                      <Skeleton className="w-16 h-16 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4 space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full rounded-md" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-card rounded-2xl border border-border shadow-sm">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Unable to load doctors</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">{error}</p>
              <Button onClick={fetchDoctors}>
                <RefreshCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-2xl border border-border shadow-sm">
              <Stethoscope className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No doctors available</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We couldn't find any doctors matching your current availability filters. Try adjusting your filters to see more results.
              </p>
              {(filters.chat || filters.voice || filters.video) && (
                <Button 
                  variant="outline" 
                  className="mt-6"
                  onClick={() => setFilters({ chat: false, voice: false, video: false })}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor, index) => (
                <motion.div
                  key={doctor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300 border-border/50">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-16 h-16 border-2 border-muted">
                              <AvatarImage src={doctor.profilePictureUrl} alt={doctor.fullName} className="object-cover" />
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                              {getInitials(doctor.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-bold text-lg leading-tight">{doctor.fullName}</h3>
                            <p className="text-primary text-sm font-medium">{doctor.specialization}</p>
                          </div>
                        </div>
                        {doctor.rating > 0 && (
                          <div className="flex items-center bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-1 rounded-md text-sm font-medium">
                            <Star className="w-3.5 h-3.5 mr-1 fill-current" />
                            {doctor.rating.toFixed(1)}
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pb-4 flex-grow space-y-4">
                      <div className="grid grid-cols-2 gap-y-2 text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <GraduationCap className="w-4 h-4 mr-2 opacity-70" />
                          <span>{doctor.yearsOfExperience} Years Exp.</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Stethoscope className="w-4 h-4 mr-2 opacity-70" />
                          <span>{doctor.hospitalName || 'Independent'}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-border/50">
                        <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">Available For</p>
                        <div className="flex flex-wrap gap-2">
                          {doctor.availableForChat && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-100">
                              <MessageSquare className="w-3 h-3 mr-1" /> Chat
                            </Badge>
                          )}
                          {doctor.availableForVoiceCalls && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100">
                              <Phone className="w-3 h-3 mr-1" /> Voice
                            </Badge>
                          )}
                          {doctor.availableForVideoCalls && (
                            <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 hover:bg-purple-100">
                              <Video className="w-3 h-3 mr-1" /> Video
                            </Badge>
                          )}
                          {!doctor.availableForChat && !doctor.availableForVoiceCalls && !doctor.availableForVideoCalls && (
                            <span className="text-sm text-muted-foreground italic">Currently unavailable</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="pt-0 border-t border-border/50 mt-auto flex items-center justify-between">
                      <div className="py-4">
                        <p className="text-xs text-muted-foreground">Consultation Fee</p>
                        <p className="font-bold text-lg">
                          {doctor.consultationFee ? `₦${doctor.consultationFee.toLocaleString()}` : 'Free'}
                        </p>
                      </div>
                      <Button 
                        className="w-full max-w-[140px]"
                        disabled={!doctor.availableForChat && !doctor.availableForVoiceCalls && !doctor.availableForVideoCalls}
                        onClick={() => navigate(`/consultation/${doctor.id}`)}
                      >
                        Consult Now
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default DoctorsAvailabilityPage;