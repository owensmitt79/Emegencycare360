import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Plus, Trash2, Heart, User, Clock, AlertTriangle, AlertCircle, CreditCard, CheckCircle2, Stethoscope, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext.jsx';
import apiClient from '@/lib/apiClient.js';
import { AnimatePresence } from 'framer-motion';
import PaymentModal from '@/components/PaymentModal.jsx';

const DashboardPage = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [savingMedical, setSavingMedical] = useState(false);
  
  const [emergencyContacts, setEmergencyContacts] = useState(user?.emergency_contacts || []);
  const [medicalInfo, setMedicalInfo] = useState({
    bloodType: user?.blood_type || '',
    allergies: user?.allergies || '',
    medications: user?.medications || ''
  });
  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: '' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  // Load subscription from localStorage
  const [subscription, setSubscription] = useState(() => {
    try {
      const data = localStorage.getItem('subscriptionData');
      if (!data) return null;
      const parsed = JSON.parse(data);
      if (new Date(parsed.expiresAt) < new Date()) {
        localStorage.removeItem('subscriptionData');
        return null;
      }
      return parsed;
    } catch { return null; }
  });

  // Redirect to login only when there is definitively no logged-in user
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch actual emergency requests
  useEffect(() => {
    const fetchRequests = async () => {
      if (!user?.id) { setLoadingRequests(false); return; }
      try {
        const data = await apiClient.request('/emergency-requests?user=' + user.id);
        setRequests(data.items || []);
      } catch (error) {
        console.warn('Could not fetch emergency requests:', error?.message);
      } finally {
        setLoadingRequests(false);
      }
    };
    fetchRequests();
  }, [user?.id]);

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const saveContactsToDb = async (contacts) => {
    try {
      // Placeholder for updating user contacts via API
      console.log("Saving contacts to db", contacts);
      refreshUser(); // Update the local context
    } catch (error) {
      console.error('Failed to save contacts:', error);
      toast.error('Failed to save contacts to database');
    }
  };

  const handleAddContact = async () => {
    if (!newContact.name || !newContact.phone) {
      toast.error('Please fill in name and phone number');
      return;
    }

    const updatedContacts = [...emergencyContacts, { ...newContact, id: Date.now() }];
    setEmergencyContacts(updatedContacts);
    setNewContact({ name: '', phone: '', relationship: '' });
    setDialogOpen(false);
    
    await saveContactsToDb(updatedContacts);
    toast.success('Emergency contact added');
  };

  const handleDeleteContact = async (id) => {
    const updatedContacts = emergencyContacts.filter(contact => contact.id !== id);
    setEmergencyContacts(updatedContacts);
    await saveContactsToDb(updatedContacts);
    toast.success('Contact removed');
  };

  const handleSaveMedicalInfo = async () => {
    setSavingMedical(true);
    try {
      // Placeholder for API update
      console.log("Saving medical info", medicalInfo);
      await refreshUser();
      toast.success('Medical information saved securely');
    } catch (error) {
      console.error('Failed to save medical info:', error);
      toast.error('Failed to save medical information');
    } finally {
      setSavingMedical(false);
    }
  };

  const getStatusColor = (status) => {
    status = (status || '').toLowerCase();
    if (['resolved', 'completed'].includes(status)) return 'bg-green-100 text-green-700 border-green-200';
    if (['en_route', 'on_scene', 'dispatched'].includes(status)) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (['cancelled'].includes(status)) return 'bg-gray-100 text-gray-700 border-gray-200';
    return 'bg-yellow-100 text-yellow-700 border-yellow-200'; // pending
  };

  const getUrgencyColor = (urgency) => {
    urgency = (urgency || '').toLowerCase();
    if (['high', 'critical'].includes(urgency)) return 'bg-red-100 text-red-700 border-red-200';
    if (urgency === 'medium') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-green-100 text-green-700 border-green-200'; // low
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-14 h-14 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Login Required</h2>
          <p className="text-muted-foreground mb-6">Please sign in to access your dashboard.</p>
          <Link to="/login">
            <Button className="font-semibold px-8">Go to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Dashboard | Emergencycare360`}</title>
        <meta name="description" content="Manage your emergency requests, medical information, and emergency contacts." />
      </Helmet>

      <main className="py-12 min-h-screen bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 bg-card p-6 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-1">Welcome back, {user?.full_name || user?.name || 'User'}</h1>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" className="gap-2 border-destructive/20 text-destructive hover:bg-destructive/10">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>

          {/* ── SUBSCRIPTION / PAYMENT PANEL ── */}
          {subscription ? (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6 mb-8 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">{subscription.planName} Plan — Active</h3>
                    <p className="text-sm text-muted-foreground">
                      Valid until {new Date(subscription.expiresAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-500 text-white py-1 px-3">Active</Badge>
                  <Link to="/services">
                    <Button size="sm" className="gap-2 font-semibold">
                      <Stethoscope className="w-4 h-4" /> Consult a Doctor
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 border border-primary/20 rounded-2xl p-6 mb-8 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">Unlock Doctor Consultations</h3>
                    <p className="text-sm text-muted-foreground">
                      Subscribe to a plan to chat, call, or video-consult with a licensed doctor.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="border-primary/30 text-primary">No Active Plan</Badge>
                  <Button
                    id="subscribe-btn"
                    onClick={() => setShowPayment(true)}
                    className="gap-2 font-semibold shadow-md shadow-primary/20"
                  >
                    <Star className="w-4 h-4" /> Subscribe Now
                  </Button>
                </div>
              </div>
            </div>
          )}

          <Tabs defaultValue="requests" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 p-1 bg-card border border-border rounded-xl">
              <TabsTrigger value="requests" className="rounded-lg">Request History</TabsTrigger>
              <TabsTrigger value="medical" className="rounded-lg">Medical Profile</TabsTrigger>
              <TabsTrigger value="contacts" className="rounded-lg">Emergency Contacts</TabsTrigger>
            </TabsList>

            {/* REQUEST HISTORY TAB */}
            <TabsContent value="requests">
              <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
                  <Clock className="w-6 h-6 text-primary" /> Emergency Request History
                </h2>
                
                {loadingRequests ? (
                  <div className="text-center py-12 text-muted-foreground">Loading your history...</div>
                ) : requests.length === 0 ? (
                  <div className="text-center py-16 bg-muted/30 rounded-xl border border-dashed border-border">
                    <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium text-foreground">No emergency requests yet</p>
                    <p className="text-muted-foreground mt-2">When you submit an emergency, it will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {requests.map((request) => (
                      <div key={request.id} className="border border-border rounded-xl p-5 hover:bg-accent/30 transition-all duration-200">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                          <div>
                            <h3 className="font-bold text-lg text-foreground capitalize">{request.emergency_type} Emergency</h3>
                            {request.address && <p className="text-sm text-muted-foreground mt-1">{request.address}</p>}
                          </div>
                          <div className="flex gap-2">
                            <Badge className={getUrgencyColor(request.urgency)}>
                              Urgency: {request.urgency || 'Normal'}
                            </Badge>
                            <Badge className={getStatusColor(request.status)}>
                              Status: {request.status || 'Pending'}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {new Date(request.created).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* MEDICAL PROFILE TAB */}
            <TabsContent value="medical">
              <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-6 text-foreground">Medical Information</h2>
                <p className="text-muted-foreground mb-8">
                  This information helps our responders provide you with the most appropriate care during an emergency.
                </p>
                <div className="space-y-6 max-w-2xl">
                  <div className="space-y-2">
                    <Label htmlFor="bloodType" className="font-medium">Blood Type</Label>
                    <select
                      id="bloodType"
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      value={medicalInfo.bloodType}
                      onChange={(e) => setMedicalInfo({ ...medicalInfo, bloodType: e.target.value })}
                    >
                      <option value="">Select Blood Type</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="allergies" className="font-medium">Allergies</Label>
                    <Input
                      id="allergies"
                      value={medicalInfo.allergies}
                      onChange={(e) => setMedicalInfo({ ...medicalInfo, allergies: e.target.value })}
                      placeholder="List any allergies (e.g., Penicillin, Peanuts)"
                      className="text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medications" className="font-medium">Current Medications</Label>
                    <Input
                      id="medications"
                      value={medicalInfo.medications}
                      onChange={(e) => setMedicalInfo({ ...medicalInfo, medications: e.target.value })}
                      placeholder="List current medications and dosages"
                      className="text-foreground"
                    />
                  </div>

                  <Button 
                    onClick={handleSaveMedicalInfo} 
                    className="font-semibold"
                    disabled={savingMedical}
                  >
                    {savingMedical ? 'Saving...' : 'Save Medical Profile'}
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* EMERGENCY CONTACTS TAB */}
            <TabsContent value="contacts">
              <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Emergency Contacts</h2>
                    <p className="text-muted-foreground mt-1">People to notify when you request emergency help.</p>
                  </div>
                  
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="font-semibold shadow-sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Contact
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add Emergency Contact</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="contactName">Full Name *</Label>
                          <Input
                            id="contactName"
                            value={newContact.name}
                            onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                            placeholder="Jane Doe"
                            className="text-foreground"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contactPhone">Phone Number *</Label>
                          <Input
                            id="contactPhone"
                            value={newContact.phone}
                            onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                            placeholder="+234..."
                            className="text-foreground"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contactRelationship">Relationship</Label>
                          <Input
                            id="contactRelationship"
                            value={newContact.relationship}
                            onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                            placeholder="e.g., Spouse, Parent, Friend"
                            className="text-foreground"
                          />
                        </div>
                        <Button onClick={handleAddContact} className="w-full font-semibold">
                          Save Contact
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {emergencyContacts.length === 0 ? (
                  <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed border-border">
                    <User className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-lg font-medium text-foreground">No emergency contacts added</p>
                    <p className="text-muted-foreground mt-1">Add trusted individuals who should be notified in an emergency.</p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {emergencyContacts.map((contact) => (
                      <div key={contact.id} className="border border-border rounded-xl p-5 flex items-start justify-between bg-background shadow-sm">
                        <div>
                          <h3 className="font-bold text-lg text-foreground">{contact.name}</h3>
                          <p className="text-primary font-medium mt-1">{contact.phone}</p>
                          {contact.relationship && (
                            <Badge variant="outline" className="mt-2 text-xs">
                              {contact.relationship}
                            </Badge>
                          )}
                        </div>
                        <Button
                          onClick={() => handleDeleteContact(contact.id)}
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPayment && (
          <PaymentModal
            onClose={() => setShowPayment(false)}
            onSuccess={(paymentRecord) => {
              setSubscription(paymentRecord);
              setShowPayment(false);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default DashboardPage;