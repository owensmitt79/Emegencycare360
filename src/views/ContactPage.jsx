import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Phone, Mail, MapPin, MessageCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      toast.success('Message sent successfully', {
        description: 'We will respond within 24 hours'
      });
      setFormData({ name: '', email: '', message: '' });
      setSubmitting(false);
    }, 1000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <Helmet>
        <title>Emergencycare360 - Contact Us</title>
        <meta name="description" content="Get in touch with Emergencycare360. 24/7 emergency line: +234 703 878 7313. Send us a message or visit our offices in Lagos." />
      </Helmet>



      <main className="min-h-screen bg-slate-50 pb-20">
        {/* Formal Hero Section */}
        <div className="bg-slate-900 text-white py-20 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Corporate Directory & Support</h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
              Connect with Emergencycare360's administrative offices and clinical dispatch centers. 
              Our emergency response teams operate 24/7/365 to ensure immediate medical intervention.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          <div className="bg-white rounded-xl shadow-lg shadow-red-900/5 border border-slate-200 mb-12 text-center p-8 border-t-4 border-t-red-600">
            <h2 className="text-xs uppercase tracking-widest font-bold text-red-600 mb-3">Priority Emergency Dispatch Hotline</h2>
            <a href="tel:+2347038787313" className="text-4xl md:text-5xl font-extrabold text-slate-900 hover:text-red-600 transition-colors duration-200">
              +234 703 878 7313
            </a>
            <p className="mt-4 text-slate-500 font-medium text-sm">Available 24 hours a day, 7 days a week. All calls are recorded for clinical quality assurance.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-slate-700" />
                  </div>
                  <div className="w-full">
                    <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-4 pb-2 border-b border-slate-100">Telecommunications</h3>
                    <div className="space-y-3 text-sm text-slate-600">
                      <div className="flex justify-between">
                        <span className="font-medium">Emergency Line:</span>
                        <a href="tel:+2347038787313" className="text-slate-900 font-semibold hover:text-slate-700">+234 703 878 7313</a>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">General Administration:</span>
                        <a href="tel:+2347038787313" className="text-slate-900 font-semibold hover:text-slate-700">+234 703 878 7313</a>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Corporate Accounts:</span>
                        <a href="tel:+2347038787313" className="text-slate-900 font-semibold hover:text-slate-700">+234 703 878 7313</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-slate-700" />
                  </div>
                  <div className="w-full">
                    <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-4 pb-2 border-b border-slate-100">WhatsApp Support Channel</h3>
                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                      For non-critical inquiries, document submission, and general support, you can reach our administrative team via WhatsApp.
                    </p>
                    <Button asChild variant="outline" className="w-full border-slate-300 text-slate-700 hover:bg-slate-50">
                      <a href="https://wa.me/2347038787313" target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Initiate Secure Chat
                      </a>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-slate-700" />
                  </div>
                  <div className="w-full">
                    <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-4 pb-2 border-b border-slate-100">Electronic Mail Directory</h3>
                    <div className="space-y-3 text-sm text-slate-600">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                        <span className="font-medium">General Inquiries:</span>
                        <a href="mailto:info@emergencycare360.ng" className="text-slate-900 font-semibold hover:text-slate-700">info@emergencycare360.ng</a>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                        <span className="font-medium">Technical Support:</span>
                        <a href="mailto:support@emergencycare360.ng" className="text-slate-900 font-semibold hover:text-slate-700">support@emergencycare360.ng</a>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                        <span className="font-medium">Institutional Partnerships:</span>
                        <a href="mailto:partners@emergencycare360.ng" className="text-slate-900 font-semibold hover:text-slate-700">partners@emergencycare360.ng</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-slate-700" />
                  </div>
                  <div className="w-full">
                    <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-4 pb-2 border-b border-slate-100">Corporate Facilities</h3>
                    <div className="space-y-5 text-sm">
                      <div>
                        <p className="font-bold text-slate-900 mb-1">National Headquarters</p>
                        <p className="text-slate-600 leading-relaxed">
                          No 1 Rochas close<br />
                          Okigwe, Imo State
                        </p>
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 mb-1">Victoria Island Dispatch Center</p>
                        <p className="text-slate-600 leading-relaxed">
                          23 Adeola Odeku Street<br />
                          Victoria Island, Lagos
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 text-white rounded-xl shadow-lg border border-slate-800 p-6">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-slate-300" />
                  </div>
                  <div className="w-full">
                    <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-2">Operational Readiness</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Our dispatch centers, ambulance fleet, and medical personnel maintain 100% operational readiness 24/7/365. We do not observe public holidays or facility closures.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 sticky top-24">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Formal Inquiry Submission</h2>
                <p className="text-sm text-slate-500 mb-8 pb-4 border-b border-slate-100">
                  Please use this secure channel for institutional inquiries, partnership requests, or administrative questions. Do not use this form for medical emergencies.
                </p>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Label htmlFor="name" className="text-slate-700 font-semibold text-xs uppercase tracking-wider">Full Legal Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Dr. John Doe or Jane Smith"
                      required
                      className="mt-2 text-slate-900 placeholder:text-slate-400 bg-slate-50 border-slate-200 focus-visible:ring-slate-900"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-slate-700 font-semibold text-xs uppercase tracking-wider">Professional Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. name@institution.com"
                      required
                      className="mt-2 text-slate-900 placeholder:text-slate-400 bg-slate-50 border-slate-200 focus-visible:ring-slate-900"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-slate-700 font-semibold text-xs uppercase tracking-wider">Message Content</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please clearly describe the nature of your inquiry..."
                      rows={7}
                      required
                      className="mt-2 text-slate-900 placeholder:text-slate-400 bg-slate-50 border-slate-200 focus-visible:ring-slate-900 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-lg h-12 mt-2 shadow-none"
                    disabled={submitting}
                  >
                    {submitting ? 'Transmitting Request...' : 'Submit Inquiry'}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>


    </>
  );
};

export default ContactPage;