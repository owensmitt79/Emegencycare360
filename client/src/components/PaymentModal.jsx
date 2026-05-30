import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, CreditCard, CheckCircle2, Shield, Zap, Star,
  Lock, Smartphone, ArrowRight, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// ── Plans ─────────────────────────────────────────────────────────────────────
const PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: 2500,
    period: 'one-time',
    color: 'from-blue-500 to-blue-600',
    icon: Zap,
    features: [
      '1 Doctor Consultation',
      'Text Chat Only',
      'Valid for 7 days',
      'Emergency Priority',
    ],
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 8000,
    period: 'per month',
    color: 'from-primary to-primary/80',
    icon: Star,
    popular: true,
    features: [
      'Unlimited Consultations',
      'Chat + Voice Calls',
      'Valid for 30 days',
      'Priority Response',
      '24/7 Access',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 15000,
    period: 'per month',
    color: 'from-purple-600 to-purple-700',
    icon: Shield,
    features: [
      'Unlimited Consultations',
      'Chat + Voice + Video',
      'Valid for 30 days',
      'Dedicated Doctor',
      '24/7 Priority Access',
      'Family Coverage (2 members)',
    ],
  },
];

// ── Mock payment processor ─────────────────────────────────────────────────────
const processMockPayment = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      // 95% success rate for demo
      Math.random() > 0.05 ? resolve({ reference: `PAY-${Date.now()}` }) : reject(new Error('Card declined'));
    }, 2200);
  });

// ── PaymentModal ──────────────────────────────────────────────────────────────
const PaymentModal = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState('plans'); // 'plans' | 'checkout' | 'success'
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setStep('checkout');
  };

  const formatCard = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const handlePay = async (e) => {
    e.preventDefault();
    if (!cardData.number || !cardData.name || !cardData.expiry || !cardData.cvv) {
      toast.error('Please fill in all card details.');
      return;
    }
    setProcessing(true);
    try {
      const result = await processMockPayment();
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + (selectedPlan.id === 'basic' ? 7 : 30));
      const paymentRecord = {
        plan: selectedPlan.id,
        planName: selectedPlan.name,
        reference: result.reference,
        amount: selectedPlan.price,
        paidAt: new Date().toISOString(),
        expiresAt: expiry.toISOString(),
        active: true,
      };
      localStorage.setItem('subscriptionData', JSON.stringify(paymentRecord));
      setStep('success');
      setTimeout(() => {
        onSuccess(paymentRecord);
        toast.success(`${selectedPlan.name} plan activated! You can now consult with doctors.`);
      }, 1500);
    } catch (err) {
      toast.error(err.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-card border border-border rounded-3xl shadow-2xl w-full overflow-hidden"
        style={{ maxWidth: step === 'plans' ? '860px' : '440px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-lg">
                {step === 'plans' && 'Choose a Plan'}
                {step === 'checkout' && 'Secure Checkout'}
                {step === 'success' && 'Payment Successful'}
              </h2>
              {step === 'plans' && (
                <p className="text-xs text-muted-foreground">Select a plan to start consulting with doctors</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Plans Step */}
        {step === 'plans' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PLANS.map((plan) => {
                const Icon = plan.icon;
                return (
                  <motion.div
                    key={plan.id}
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className={`relative rounded-2xl border-2 overflow-hidden cursor-pointer ${
                      plan.popular ? 'border-primary shadow-lg shadow-primary/20' : 'border-border'
                    }`}
                    onClick={() => handleSelectPlan(plan)}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-xs font-bold text-center py-1">
                        MOST POPULAR
                      </div>
                    )}
                    <div className={`bg-gradient-to-br ${plan.color} p-5 ${plan.popular ? 'pt-7' : ''}`}>
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-white font-bold text-xl">{plan.name}</h3>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-white text-3xl font-black">₦{plan.price.toLocaleString()}</span>
                        <span className="text-white/70 text-sm">/{plan.period}</span>
                      </div>
                    </div>
                    <div className="p-5 bg-card">
                      <ul className="space-y-2 mb-5">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        className={`w-full font-semibold bg-gradient-to-r ${plan.color} text-white border-0 hover:opacity-90`}
                        onClick={() => handleSelectPlan(plan)}
                      >
                        Get Started <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" /> Secured by 256-bit SSL encryption
            </p>
          </div>
        )}

        {/* Checkout Step */}
        {step === 'checkout' && selectedPlan && (
          <div className="p-6">
            {/* Order summary */}
            <div className={`bg-gradient-to-r ${selectedPlan.color} rounded-2xl p-4 mb-6 text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-xs font-medium uppercase tracking-wider">Selected Plan</p>
                  <p className="font-bold text-xl mt-0.5">{selectedPlan.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/70 text-xs">Total</p>
                  <p className="font-black text-2xl">₦{selectedPlan.price.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handlePay} className="space-y-4">
              <div>
                <Label htmlFor="cardName" className="text-sm font-medium">Cardholder Name</Label>
                <Input
                  id="cardName"
                  placeholder="John Doe"
                  value={cardData.name}
                  onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                  className="mt-1 text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="cardNumber" className="text-sm font-medium">Card Number</Label>
                <div className="relative mt-1">
                  <Input
                    id="cardNumber"
                    placeholder="4242 4242 4242 4242"
                    value={cardData.number}
                    onChange={(e) => setCardData({ ...cardData, number: formatCard(e.target.value) })}
                    className="pr-12 text-foreground font-mono"
                    maxLength={19}
                  />
                  <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry" className="text-sm font-medium">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={cardData.expiry}
                    onChange={(e) => setCardData({ ...cardData, expiry: formatExpiry(e.target.value) })}
                    className="mt-1 text-foreground font-mono"
                    maxLength={5}
                  />
                </div>
                <div>
                  <Label htmlFor="cvv" className="text-sm font-medium">CVV</Label>
                  <div className="relative mt-1">
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={cardData.cvv}
                      onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                      className="text-foreground font-mono"
                      maxLength={4}
                      type="password"
                    />
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 text-xs text-muted-foreground items-center bg-muted/50 rounded-xl p-3">
                <Smartphone className="w-4 h-4 flex-shrink-0 text-primary" />
                <span>For demo, use any card details. No real charge will be made.</span>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep('plans')}
                  disabled={processing}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className={`flex-1 bg-gradient-to-r ${selectedPlan.color} text-white border-0 font-bold hover:opacity-90`}
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing…
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Pay ₦{selectedPlan.price.toLocaleString()}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Success Step */}
        {step === 'success' && (
          <div className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.1 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-2xl font-bold mb-2">Payment Successful!</h3>
              <p className="text-muted-foreground mb-1">
                Your <strong>{selectedPlan?.name}</strong> plan is now active.
              </p>
              <p className="text-sm text-muted-foreground">Redirecting you back to your dashboard…</p>
            </motion.div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default PaymentModal;
