import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const EmergencyContactModal = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-t-4 border-t-[#DC2626]">
        <DialogHeader>
          <DialogTitle className="text-[#1E3A8A] text-xl font-bold">
            Contact Emergency Services
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            Choose your preferred method to reach our 24/7 emergency response team immediately.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 mt-2">
          <Button
            asChild
            className="w-full h-14 bg-[#DC2626] hover:bg-[#DC2626]/90 text-white shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98] text-base font-semibold"
          >
            <a href="tel:+2347038787313">
              <Phone className="w-5 h-5 mr-2" />
              Call Now
            </a>
          </Button>
          <Button
            asChild
            className="w-full h-14 bg-[#3B82F6] hover:bg-[#1E3A8A] text-white shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98] text-base font-semibold"
          >
            <a href="https://wa.me/2347038787313" target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-5 h-5 mr-2" />
              WhatsApp
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmergencyContactModal;