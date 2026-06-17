import React, { useState, useEffect } from 'react';
import { MessageCircle, Phone, Minimize2, Maximize2, X, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useConsultant } from '@/contexts/ConsultantProvider.jsx';
import ChatInterface from './ChatInterface.jsx';
import CallInterface from './CallInterface.jsx';
import apiClient from '@/lib/apiClient.js';
import { toast } from 'sonner';

const ConsultantBar = () => {
  const { 
    isOpen, 
    toggleConsultant, 
    activeTab, 
    switchTab, 
    unreadMessages, 
    currentDoctor 
  } = useConsultant();

  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && !selectedDoctor) {
      fetchDoctors();
    }
  }, [isOpen, selectedDoctor]);

  const fetchDoctors = async () => {
    setIsLoading(true);
    try {
      // Placeholder for real API
      const records = { items: [] };
      setAvailableDoctors(records.items);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDoctor = async (doctor) => {
    setSelectedDoctor(doctor);
    // In a real app, we would update the ConsultantProvider's currentDoctor here
    // and potentially create a consultation record immediately or when chat starts.
    try {
      // Create a pending consultation record
      // Placeholder for API
      console.log('Creating consultation...');
      toast.success(`Connected with ${doctor.fullName}`);
    } catch (error) {
      console.error('Error creating consultation:', error);
    }
  };

  const handleBackToList = () => {
    setSelectedDoctor(null);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
        <button
          onClick={toggleConsultant}
          className="relative flex items-center gap-3 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white px-5 py-3 rounded-full shadow-lg transition-transform hover:scale-105"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/20">
              <MessageCircle className="w-4 h-4" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#1E3A8A] rounded-full"></span>
          </div>
          <span className="font-medium pr-2 hidden sm:inline-block">Consult Doctor</span>
          
          {unreadMessages > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#DC2626] text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-sm animate-bounce">
              {unreadMessages}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className="fixed inset-0 bg-black/40 z-40 md:hidden animate-fade-in"
        onClick={toggleConsultant}
      />
      
      {/* Main Panel */}
      <div className="fixed bottom-0 left-0 right-0 md:bottom-6 md:right-6 md:left-auto w-full md:w-[380px] h-[85vh] md:h-[600px] bg-background z-50 md:rounded-2xl consultant-panel flex flex-col overflow-hidden animate-slide-in">
        
        {/* Header */}
        <div className="bg-[#1E3A8A] text-white p-4 flex items-center justify-between shrink-0">
          {selectedDoctor ? (
            <div className="flex items-center gap-3">
              <button onClick={handleBackToList} className="p-1 hover:bg-white/20 rounded-full mr-1">
                <X className="w-4 h-4" />
              </button>
              <div className="relative">
                {selectedDoctor.profilePicture ? (
                  <img 
                    src={selectedDoctor.profilePictureUrl} 
                    alt={selectedDoctor.fullName} 
                    className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/20">
                    <User className="w-5 h-5" />
                  </div>
                )}
                <span className="absolute bottom-0 right-0 w-3 h-3 border-2 border-[#1E3A8A] rounded-full bg-green-500"></span>
              </div>
              <div>
                <h4 className="font-semibold text-sm leading-tight">{selectedDoctor.fullName}</h4>
                <p className="text-xs text-white/80">{selectedDoctor.specialization}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <h4 className="font-semibold">Available Doctors</h4>
            </div>
          )}
          
          <div className="flex items-center gap-1">
            <button 
              onClick={toggleConsultant}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Minimize"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {selectedDoctor ? (
          <>
            {/* Tab Navigation */}
            <div className="flex border-b border-border bg-muted/30 shrink-0">
              <button
                onClick={() => switchTab('chat')}
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                  activeTab === 'chat' 
                    ? 'text-[#1E3A8A] border-b-2 border-[#1E3A8A] bg-background' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                Chat
              </button>
              <button
                onClick={() => switchTab('call')}
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                  activeTab === 'call' 
                    ? 'text-[#1E3A8A] border-b-2 border-[#1E3A8A] bg-background' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Phone className="w-4 h-4" />
                Call
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative bg-background">
              {activeTab === 'chat' ? <ChatInterface /> : <CallInterface />}
            </div>
          </>
        ) : (
          /* Doctor List View */
          <div className="flex-1 overflow-y-auto bg-muted/10 p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search specialization..." className="pl-9 bg-background" />
            </div>
            
            {isLoading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => (
                  <div key={i} className="bg-card p-4 rounded-xl border border-border animate-pulse flex gap-3">
                    <div className="w-12 h-12 bg-muted rounded-full"></div>
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : availableDoctors.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No doctors currently available.</p>
                <p className="text-sm mt-1">Please try again later.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {availableDoctors.map(doctor => (
                  <div 
                    key={doctor.id} 
                    onClick={() => handleSelectDoctor(doctor)}
                    className="bg-card p-3 rounded-xl border border-border hover:border-primary/50 hover:shadow-md transition-all cursor-pointer flex items-center gap-3"
                  >
                    <div className="relative shrink-0">
                      {doctor.profilePicture ? (
                        <img 
                          src={doctor.profilePictureUrl} 
                          alt={doctor.fullName} 
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                          <User className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                      <span className="absolute bottom-0 right-0 w-3 h-3 border-2 border-card rounded-full bg-green-500"></span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-semibold text-sm text-foreground truncate">{doctor.fullName}</h5>
                      <p className="text-xs text-muted-foreground truncate">{doctor.specialization}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-medium bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                          ₦{doctor.consultationFee || 0}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          ⭐ {doctor.rating || 'New'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ConsultantBar;