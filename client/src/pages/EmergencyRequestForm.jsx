import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { MapPin, AlertTriangle, Phone, Activity, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import apiClient from '@/lib/apiClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

const EmergencyRequestForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [successModal, setSuccessModal] = useState(null);
  
  const [formData, setFormData] = useState({
    emergency_type: '',
    priority: 'high',
    address: '',
    latitude: '',
    longitude: '',
    symptoms_description: '',
    contact_phone: user?.phone || ''
  });

  const getLocation = () => {
    setLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: prev.address || 'Location automatically detected'
          }));
          setLocating(false);
          toast.success("Location detected successfully");
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocating(false);
          toast.error("Could not detect location. Please enter address manually.");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLocating(false);
      toast.error("Geolocation is not supported by your browser");
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to request help");
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      // Placeholder for real API call
      const record = {
        ...formData,
        id: 'REQ-' + Date.now(),
        user_id: user.id,
        status: 'pending'
      };

      setSuccessModal(record);
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Failed to submit emergency request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    if (successModal) {
      navigate(`/emergency-status/${successModal.id}`);
    }
  };

  return (
    <>
      <Helmet>
        <title>Request Emergency Assistance | Emergencycare360</title>
      </Helmet>
      <main className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" onClick={() => navigate('/')} className="mb-6 -ml-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Button>

          <div className="bg-card rounded-2xl shadow-xl overflow-hidden border border-border">
            <div className="bg-destructive text-destructive-foreground p-6 md:p-8 text-center">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 animate-pulse" />
              <h1 className="text-3xl font-extrabold mb-2">Request Emergency Help</h1>
              <p className="text-destructive-foreground/90">If this is life-threatening, please ensure you fill this form accurately.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="emergency_type">Emergency Type *</Label>
                  <Select required onValueChange={(val) => handleSelectChange('emergency_type', val)}>
                    <SelectTrigger className="w-full text-foreground bg-background">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medical">Medical</SelectItem>
                      <SelectItem value="fire">Fire</SelectItem>
                      <SelectItem value="obstetric">Obstetric / Maternity</SelectItem>
                      <SelectItem value="pediatric">Pediatric / Child</SelectItem>
                      <SelectItem value="trauma">Trauma / Accident</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority Level *</Label>
                  <Select value={formData.priority} onValueChange={(val) => handleSelectChange('priority', val)}>
                    <SelectTrigger className="w-full text-foreground bg-background">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (Non-urgent)</SelectItem>
                      <SelectItem value="medium">Medium (Requires attention)</SelectItem>
                      <SelectItem value="high">High (Urgent)</SelectItem>
                      <SelectItem value="critical">Critical (Life-threatening)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Location / Address *</Label>
                <div className="flex gap-2">
                  <Input 
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="Enter full address"
                    className="flex-1 text-foreground bg-background"
                  />
                  <Button type="button" variant="outline" onClick={getLocation} disabled={locating}>
                    <MapPin className={`w-4 h-4 ${locating ? 'animate-bounce' : ''}`} />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  {formData.latitude ? <span className="text-green-600">✓ GPS Location captured</span> : "GPS Location pending"}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_phone">Contact Phone Number *</Label>
                <Input 
                  id="contact_phone"
                  name="contact_phone"
                  type="tel"
                  value={formData.contact_phone}
                  onChange={handleChange}
                  required
                  placeholder="e.g. +234 800 000 0000"
                  className="text-foreground bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="symptoms_description">Describe Symptoms / Situation</Label>
                <Textarea 
                  id="symptoms_description"
                  name="symptoms_description"
                  value={formData.symptoms_description}
                  onChange={handleChange}
                  placeholder="Briefly describe the emergency situation..."
                  className="min-h-[100px] text-foreground bg-background"
                />
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold text-lg h-14 rounded-xl"
                disabled={loading || !formData.emergency_type || !formData.address || !formData.contact_phone}
              >
                {loading ? 'Submitting Request...' : 'SUBMIT EMERGENCY REQUEST'}
              </Button>
            </form>
          </div>
        </div>

        <Dialog open={!!successModal} onOpenChange={handleModalClose}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <DialogTitle className="text-center text-xl">Request Received!</DialogTitle>
              <DialogDescription className="text-center text-base mt-2">
                Your emergency request has been sent to our dispatch center.
              </DialogDescription>
            </DialogHeader>
            <div className="bg-muted p-4 rounded-lg my-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Request ID:</span>
                <span className="font-mono font-medium">{successModal?.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span className="capitalize font-medium">{successModal?.emergency_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Priority:</span>
                <span className="capitalize font-medium text-destructive">{successModal?.priority}</span>
              </div>
            </div>
            <p className="text-center text-sm font-medium text-primary animate-pulse">
              Estimated response time: Assigning closest responder...
            </p>
            <DialogFooter>
              <Button onClick={handleModalClose} className="w-full">Track My Request</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
};

export default EmergencyRequestForm;