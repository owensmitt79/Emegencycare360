import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Phone, Video, Send, Activity,
  Droplet, AlertTriangle, Pill, User, CheckCheck,
  Wifi, MicOff, VideoOff, PhoneOff,
  ShieldCheck, Stethoscope, Lock, CreditCard, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext.jsx';
import apiClient from '@/lib/apiClient.js';
import PaymentModal from '@/components/PaymentModal.jsx';

// ── Helpers ──────────────────────────────────────────────────────────────────
const getInitials = (name) => {
  if (!name) return '??';
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

const formatTime = (iso) => {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// ── Sub-components ────────────────────────────────────────────────────────────
const CallModal = ({ type, doctor, onHangUp }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
  >
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.85, opacity: 0 }}
      className="bg-card border border-border rounded-3xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl"
    >
      <div className="relative mb-6">
        <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto ring-4 ring-primary/30 animate-pulse">
          <span className="text-3xl font-bold text-primary">{getInitials(doctor?.fullName)}</span>
        </div>
        <div className="absolute bottom-0 right-1/2 translate-x-12 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-card">
          {type === 'video' ? <Video className="w-4 h-4 text-white" /> : <Phone className="w-4 h-4 text-white" />}
        </div>
      </div>

      <h2 className="text-xl font-bold mb-1">{doctor?.fullName}</h2>
      <p className="text-muted-foreground text-sm mb-2">{doctor?.specialization}</p>
      <Badge className="bg-green-100 text-green-700 mb-6">
        <Wifi className="w-3 h-3 mr-1" /> {type === 'video' ? 'Video' : 'Voice'} Call In Progress
      </Badge>

      <div className="text-3xl font-mono text-primary mb-8 tracking-widest">
        <CallTimer />
      </div>

      <div className="flex justify-center gap-4">
        <button className="w-14 h-14 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
          <MicOff className="w-5 h-5 text-muted-foreground" />
        </button>
        {type === 'video' && (
          <button className="w-14 h-14 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
            <VideoOff className="w-5 h-5 text-muted-foreground" />
          </button>
        )}
        <button
          onClick={onHangUp}
          className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
        >
          <PhoneOff className="w-6 h-6 text-white" />
        </button>
      </div>
    </motion.div>
  </motion.div>
);

const CallTimer = () => {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSecs(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return <>{m}:{s}</>;
};

// ── Helpers ──────────────────────────────────────────────────────────────────
const getSubscription = () => {
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
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const ConsultationRoomPage = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [subscription, setSubscription] = useState(getSubscription);
  const [showPayment, setShowPayment] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const [loadingDoctor, setLoadingDoctor] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [callType, setCallType] = useState(null); // 'voice' | 'video' | null
  const messagesEndRef = useRef(null);
  const pollingRef = useRef(null);

  const roomId = `${doctorId}_${user?.id || 'anon'}`;

  // ── Load doctor ──
  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const load = async () => {
      try {
        const data = await apiClient.getDoctor(doctorId);
        setDoctor(data);
      } catch {
        toast.error('Could not load doctor information.');
      } finally {
        setLoadingDoctor(false);
      }
    };
    load();
  }, [doctorId, user, navigate]);

  // ── Poll messages every 2 seconds ──
  const fetchMessages = useCallback(async () => {
    try {
      const data = await apiClient.getMessages(roomId);
      setMessages(data.items || []);
    } catch { /* silent */ }
  }, [roomId]);

  useEffect(() => {
    fetchMessages();
    pollingRef.current = setInterval(fetchMessages, 2000);
    return () => clearInterval(pollingRef.current);
  }, [fetchMessages]);

  // ── Auto-scroll ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Send message ──
  const handleSend = async () => {
    const text = inputText.trim();
    if (!text) return;
    setSending(true);
    setInputText('');
    try {
      await apiClient.sendMessage(roomId, {
        sender: user?.id || 'patient',
        senderName: user?.full_name || user?.name || 'You',
        text
      });
      await fetchMessages();
    } catch {
      toast.error('Failed to send message.');
      setInputText(text);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startCall = (type) => {
    if (type === 'voice' && !doctor?.availableForVoiceCalls) {
      toast.error('This doctor is not available for voice calls.');
      return;
    }
    if (type === 'video' && !doctor?.availableForVideoCalls) {
      toast.error('This doctor is not available for video calls.');
      return;
    }
    setCallType(type);
    toast.info(`${type === 'video' ? 'Video' : 'Voice'} call started with ${doctor?.fullName}`);
  };

  const endCall = () => {
    setCallType(null);
    toast.success('Call ended.');
  };

  // ── Health sidebar data ──
  const healthInfo = [
    { icon: Droplet, label: 'Blood Type', value: user?.blood_type || 'Not specified', color: 'text-red-500' },
    { icon: AlertTriangle, label: 'Allergies', value: user?.allergies || 'None listed', color: 'text-amber-500' },
    { icon: Pill, label: 'Medications', value: user?.medications || 'None listed', color: 'text-blue-500' },
  ];

  if (loadingDoctor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Connecting to consultation room…</p>
        </div>
      </div>
    );
  }

  // ── Payment Gate ──
  if (!subscription) {
    return (
      <>
        <Helmet>
          <title>Consultation Access | Emergencycare360</title>
        </Helmet>

        <main className="min-h-screen bg-muted/20 flex items-center justify-center py-12 px-4">
          <div className="max-w-lg w-full">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Doctors
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl"
            >
              {/* Top gradient banner */}
              <div className="bg-gradient-to-r from-primary to-purple-600 p-8 text-center">
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Lock className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Premium Feature</h1>
                <p className="text-white/80 text-sm">
                  Doctor consultations require an active subscription
                </p>
              </div>

              {/* Doctor preview */}
              {doctor && (
                <div className="px-8 pt-6 pb-4 border-b border-border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 font-medium">You are trying to consult with</p>
                  <div className="flex items-center gap-4">
                    <Avatar className="w-14 h-14 bg-primary/10">
                      <AvatarFallback className="text-primary font-bold text-lg">
                        {getInitials(doctor.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-lg">{doctor.fullName}</h3>
                      <p className="text-primary text-sm">{doctor.specialization}</p>
                      <p className="text-muted-foreground text-xs mt-0.5">{doctor.hospitalName}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Paywall content */}
              <div className="p-8">
                <h2 className="font-bold text-lg mb-3">What you get with a plan:</h2>
                <ul className="space-y-2.5 mb-8">
                  {[
                    { icon: '💬', text: 'Real-time text chat with licensed doctors' },
                    { icon: '📞', text: 'Voice & video call consultations' },
                    { icon: '🩺', text: 'Doctors see your health profile automatically' },
                    { icon: '🔒', text: 'End-to-end encrypted & 100% private' },
                    { icon: '⚡', text: 'Priority emergency support 24/7' },
                  ].map(({ icon, text }) => (
                    <li key={text} className="flex items-center gap-3 text-sm">
                      <span className="text-base">{icon}</span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    id="paywall-subscribe-btn"
                    onClick={() => setShowPayment(true)}
                    className="flex-1 gap-2 font-bold py-6 text-base bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 border-0 shadow-lg shadow-primary/30"
                  >
                    <CreditCard className="w-5 h-5" /> Subscribe to Consult
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 sm:flex-none"
                    onClick={() => navigate('/dashboard')}
                  >
                    View Plans in Dashboard
                  </Button>
                </div>

                <p className="text-center text-xs text-muted-foreground mt-4">
                  Plans start from ₦2,500 · Cancel anytime
                </p>
              </div>
            </motion.div>
          </div>
        </main>

        {/* Payment Modal */}
        <AnimatePresence>
          {showPayment && (
            <PaymentModal
              onClose={() => setShowPayment(false)}
              onSuccess={(record) => {
                setSubscription(record);
                setShowPayment(false);
                toast.success('Subscription active! You can now consult with your doctor.');
              }}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{doctor ? `Consultation with ${doctor.fullName}` : 'Consultation Room'} | Emergencycare360</title>
        <meta name="description" content="Securely communicate with your doctor and share your health information." />
      </Helmet>

      {/* Call Modal */}
      <AnimatePresence>
        {callType && (
          <CallModal type={callType} doctor={doctor} onHangUp={endCall} />
        )}
      </AnimatePresence>

      <main className="min-h-screen bg-muted/20 py-6 px-4">
        <div className="max-w-7xl mx-auto h-full">

          {/* Back Link */}
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Doctors
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── LEFT SIDEBAR: Health Info ── */}
            <div className="lg:col-span-1 space-y-4">

              {/* Patient Card */}
              <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Patient</p>
                    <h3 className="font-semibold text-sm">{user?.full_name || user?.name || 'You'}</h3>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700 text-xs">
                  <ShieldCheck className="w-3 h-3 mr-1" /> Active Session
                </Badge>
              </div>

              {/* Health Summary */}
              <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-sm">Health Summary</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  This information is shared with your doctor for better care.
                </p>
                <div className="space-y-3">
                  {healthInfo.map(({ icon: Icon, label, value, color }) => (
                    <div key={label} className="flex items-start gap-3 p-3 bg-muted/40 rounded-xl">
                      <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${color}`} />
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">{label}</p>
                        <p className="text-sm font-medium mt-0.5">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/dashboard" className="mt-3 block">
                  <Button variant="ghost" size="sm" className="w-full text-xs mt-2">
                    Update Health Info
                  </Button>
                </Link>
              </div>

              {/* Doctor Info */}
              {doctor && (
                <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Stethoscope className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold text-sm">Your Doctor</h3>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="w-12 h-12 bg-primary/10">
                      <AvatarFallback className="text-primary font-bold">
                        {getInitials(doctor.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{doctor.fullName}</p>
                      <p className="text-xs text-primary">{doctor.specialization}</p>
                    </div>
                  </div>
                  {doctor.bio && (
                    <p className="text-xs text-muted-foreground leading-relaxed">{doctor.bio}</p>
                  )}
                  <div className="mt-3 pt-3 border-t border-border flex gap-2 flex-wrap">
                    {doctor.availableForChat && (
                      <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">Chat</Badge>
                    )}
                    {doctor.availableForVoiceCalls && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">Voice</Badge>
                    )}
                    {doctor.availableForVideoCalls && (
                      <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">Video</Badge>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ── MAIN: Chat Room ── */}
            <div className="lg:col-span-2 flex flex-col">
              <div className="bg-card border border-border rounded-2xl shadow-sm flex flex-col overflow-hidden" style={{ height: 'calc(100vh - 200px)', minHeight: '560px' }}>

                {/* Chat Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-card/80 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10 bg-primary/10">
                        <AvatarFallback className="text-primary font-bold text-sm">
                          {getInitials(doctor?.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{doctor?.fullName || 'Loading…'}</p>
                      <p className="text-xs text-green-600 font-medium">● Online &amp; available</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 text-xs"
                      onClick={() => startCall('voice')}
                      disabled={!doctor?.availableForVoiceCalls}
                      title={!doctor?.availableForVoiceCalls ? 'Voice calls not available' : 'Start voice call'}
                    >
                      <Phone className="w-3.5 h-3.5" /> Voice
                    </Button>
                    <Button
                      size="sm"
                      className="gap-1.5 text-xs"
                      onClick={() => startCall('video')}
                      disabled={!doctor?.availableForVideoCalls}
                      title={!doctor?.availableForVideoCalls ? 'Video calls not available' : 'Start video call'}
                    >
                      <Video className="w-3.5 h-3.5" /> Video
                    </Button>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-muted/10">

                  {/* System message */}
                  <div className="text-center">
                    <span className="text-xs bg-muted text-muted-foreground px-3 py-1 rounded-full">
                      🔒 This consultation is private and secure
                    </span>
                  </div>

                  {messages.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-12"
                    >
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                        <Stethoscope className="w-7 h-7 text-primary" />
                      </div>
                      <p className="font-semibold mb-1">Start your consultation</p>
                      <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                        Describe your symptoms or health concerns below. Your health information is visible to {doctor?.fullName}.
                      </p>
                    </motion.div>
                  )}

                  <AnimatePresence initial={false}>
                    {messages.map((msg) => {
                      const isMe = msg.sender === user?.id;
                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`flex gap-2 items-end ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                          <Avatar className="w-7 h-7 flex-shrink-0 bg-primary/10 mb-1">
                            <AvatarFallback className="text-primary text-xs font-bold">
                              {isMe ? getInitials(user?.full_name || user?.name) : getInitials(msg.senderName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`max-w-[70%] group ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                            {!isMe && (
                              <span className="text-xs text-muted-foreground mb-1 ml-1">{msg.senderName}</span>
                            )}
                            <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                              isMe
                                ? 'bg-primary text-primary-foreground rounded-br-sm'
                                : 'bg-card border border-border text-foreground rounded-bl-sm'
                            }`}>
                              {msg.text}
                            </div>
                            <div className={`flex items-center gap-1 mt-1 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                              <span className="text-xs text-muted-foreground">{formatTime(msg.timestamp)}</span>
                              {isMe && <CheckCheck className="w-3 h-3 text-primary" />}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="px-4 py-3 border-t border-border bg-card">
                  <div className="flex items-end gap-2">
                    <div className="flex-1 relative">
                      <Textarea
                        id="chat-input"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your symptoms, questions, or concerns…"
                        rows={2}
                        className="resize-none pr-4 text-sm text-foreground bg-muted/30 border-border focus:border-primary transition-colors rounded-xl"
                      />
                    </div>
                    <Button
                      id="send-message-btn"
                      onClick={handleSend}
                      disabled={sending || !inputText.trim()}
                      className="h-11 w-11 p-0 rounded-xl flex-shrink-0 shadow-md"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs font-mono">Enter</kbd> to send · <kbd className="px-1 py-0.5 bg-muted rounded text-xs font-mono">Shift+Enter</kbd> for new line
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ConsultationRoomPage;
