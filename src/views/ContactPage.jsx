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



      <main className="py-12 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-3">Contact us</h1>
            <p className="text-lg text-muted-foreground">
              We're here to help 24/7. Reach out for emergencies or general inquiries.
            </p>
          </div>

          <div className="rapidaid-card bg-destructive text-destructive-foreground mb-12 text-center">
            <h2 className="text-2xl font-bold mb-2">Emergency hotline</h2>
            <a href="tel:+2347038787313" className="text-4xl font-bold hover:opacity-80 transition-opacity duration-200">
              +234 703 878 7313
            </a>
            <p className="mt-3 text-destructive-foreground/90">Available 24 hours a day, 7 days a week</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="space-y-6">
              <div className="rapidaid-card">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Phone numbers</h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Emergency: <a href="tel:+2347038787313" className="text-primary hover:underline">+234 703 878 7313</a></p>
                      <p>General inquiries: <a href="tel:+2347038787313" className="text-primary hover:underline">+234 703 878 7313</a></p>
                      <p>Corporate services: <a href="tel:+2347038787313" className="text-primary hover:underline">+234 703 878 7313</a></p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rapidaid-card">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">WhatsApp</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Chat with our support team on WhatsApp
                    </p>
                    <Button asChild variant="outline" size="sm" className="rapidaid-button">
                      <a href="https://wa.me/2347038787313" target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Start WhatsApp chat
                      </a>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="rapidaid-card">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Email</h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>General: <a href="mailto:info@emergencycare360.ng" className="text-primary hover:underline">info@emergencycare360.ng</a></p>
                      <p>Support: <a href="mailto:support@emergencycare360.ng" className="text-primary hover:underline">support@emergencycare360.ng</a></p>
                      <p>Partnerships: <a href="mailto:partners@emergencycare360.ng" className="text-primary hover:underline">partners@emergencycare360.ng</a></p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rapidaid-card">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Office locations</h3>
                    <div className="space-y-4 text-sm">
                      <div>
                        <p className="font-medium mb-1">Ikeja headquarters</p>
                        <p className="text-muted-foreground">
                          47 Allen Avenue, Ikeja<br />
                          Lagos State, Nigeria
                        </p>
                      </div>
                      <div>
                        <p className="font-medium mb-1">Victoria Island office</p>
                        <p className="text-muted-foreground">
                          23 Adeola Odeku Street<br />
                          Victoria Island, Lagos
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rapidaid-card bg-green-50 border-green-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">24/7 availability</h3>
                    <p className="text-sm text-muted-foreground">
                      Our emergency response team is available around the clock, every day of the year. We never close.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="rapidaid-card">
                <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Your name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                      className="mt-1 text-gray-900 placeholder:text-gray-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      required
                      className="mt-1 text-gray-900 placeholder:text-gray-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      rows={6}
                      required
                      className="mt-1 text-gray-900 placeholder:text-gray-500"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full rapidaid-button"
                    disabled={submitting}
                  >
                    {submitting ? 'Sending...' : 'Send message'}
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