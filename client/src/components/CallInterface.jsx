import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useConsultant } from '@/contexts/ConsultantProvider.jsx';

const CallInterface = () => {
  const { currentDoctor, addCallLog, switchTab } = useConsultant();
  const [callState, setCallState] = useState('incoming'); // incoming, active, ended
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let interval;
    if (callState === 'active') {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleAccept = () => {
    setCallState('active');
  };

  const handleDecline = () => {
    setCallState('ended');
    logCall('declined');
    setTimeout(() => switchTab('chat'), 2000);
  };

  const handleEnd = () => {
    setCallState('ended');
    logCall('completed');
    setTimeout(() => switchTab('chat'), 2000);
  };

  const logCall = (status) => {
    addCallLog({
      id: Date.now().toString(),
      doctorName: currentDoctor.name,
      startTime: new Date().toISOString(),
      duration,
      status
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-white relative overflow-hidden">
      {/* Background blur */}
      <div 
        className="absolute inset-0 opacity-20 bg-cover bg-center blur-xl scale-110"
        style={{ backgroundImage: `url(${currentDoctor.callImage})` }}
      />
      
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/10 mb-6 shadow-2xl">
          <img 
            src={currentDoctor.callImage} 
            alt={currentDoctor.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <h3 className="text-2xl font-bold mb-2">{currentDoctor.name}</h3>
        <p className="text-white/60 mb-8">{currentDoctor.specialization}</p>

        {callState === 'incoming' && (
          <div className="animate-pulse text-white/80 mb-12">
            Incoming video consultation...
          </div>
        )}

        {callState === 'active' && (
          <div className="flex items-center gap-2 text-[#3B82F6] font-mono text-xl mb-12 bg-[#3B82F6]/10 px-4 py-2 rounded-full">
            <Clock className="w-5 h-5" />
            {formatTime(duration)}
          </div>
        )}

        {callState === 'ended' && (
          <div className="text-white/60 mb-12">
            Call ended
          </div>
        )}

        <div className="mt-auto w-full flex justify-center gap-6 pb-8">
          {callState === 'incoming' ? (
            <>
              <Button 
                onClick={handleDecline}
                size="icon"
                className="w-14 h-14 rounded-full bg-[#DC2626] hover:bg-[#DC2626]/90 text-white shadow-lg"
              >
                <PhoneOff className="w-6 h-6" />
              </Button>
              <Button 
                onClick={handleAccept}
                size="icon"
                className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg animate-pulse-ring"
              >
                <Phone className="w-6 h-6" />
              </Button>
            </>
          ) : callState === 'active' ? (
            <Button 
              onClick={handleEnd}
              size="icon"
              className="w-16 h-16 rounded-full bg-[#DC2626] hover:bg-[#DC2626]/90 text-white shadow-lg"
            >
              <PhoneOff className="w-7 h-7" />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CallInterface;