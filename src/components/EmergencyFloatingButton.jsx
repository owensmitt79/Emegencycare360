import React, { useState } from 'react';
import { Phone, MapPin, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import EmergencyContactModal from '@/components/EmergencyContactModal.jsx';

const EmergencyFloatingButton = () => {
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleCall = () => {
    setOpen(false);
    setIsModalOpen(true);
  };

  const handleRequest = () => {
    router.push('/emergency');
    setOpen(false);
  };

  const handleFind = () => {
    router.push('/coverage');
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-6 z-40 w-16 h-16 bg-destructive text-destructive-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.95] flex items-center justify-center"
        aria-label="Emergency help"
      >
        <AlertCircle className="w-8 h-8" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Emergencycare360 assistance</DialogTitle>
            <DialogDescription>
              Choose how you need help right now
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            <Button
              onClick={handleCall}
              className="w-full h-14 text-base bg-destructive hover:bg-destructive/90 transition-all duration-200 active:scale-[0.98]"
            >
              <Phone className="w-5 h-5 mr-2" />
              Contact emergency line
            </Button>
            <Button
              onClick={handleRequest}
              className="w-full h-14 text-base transition-all duration-200 active:scale-[0.98]"
            >
              <AlertCircle className="w-5 h-5 mr-2" />
              Request emergency help
            </Button>
            <Button
              onClick={handleFind}
              variant="outline"
              className="w-full h-14 text-base transition-all duration-200 active:scale-[0.98]"
            >
              <MapPin className="w-5 h-5 mr-2" />
              Find nearest facility
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <EmergencyContactModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default EmergencyFloatingButton;