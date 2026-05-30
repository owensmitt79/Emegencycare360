import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, MapPin, Stethoscope, Home, Building2, Video, Clock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import LiveCounter from '@/components/LiveCounter.jsx';
import TrustSignals from '@/components/TrustSignals.jsx';
import EmergencyFloatingButton from '@/components/EmergencyFloatingButton.jsx';
import CookieConsent from '@/components/CookieConsent.jsx';
import OfflineBanner from '@/components/OfflineBanner.jsx';

const HomePage = () => {
  const navigate = useNavigate();

  const emergencyActions = [
    {
      icon: Phone,
      title: 'Call emergency line',
      description: 'Speak directly with our response team',
      href: 'tel:+2348012345678',
      color: 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'
    },
    {
      icon: Stethoscope,
      title: 'Get Help Now',
      description: 'Submit your emergency details online',
      action: () => navigate('/emergency'),
      color: 'bg-primary hover:bg-primary/90 text-primary-foreground'
    },
    {
      icon: MapPin,
      title: 'Find nearest facility',
      description: 'Locate the closest emergency center',
      href: '/coverage',
      color: 'bg-secondary hover:bg-secondary/90 text-secondary-foreground'
    }
  ];

  const coreServices = [
    {
      icon: Stethoscope,
      title: 'Emergency medical response',
      description: 'Rapid ambulance dispatch with trained paramedics for critical medical emergencies across the Eastern Region and Nation wide.'
    },
    {
      icon: Home,
      title: 'Home emergency care',
      description: 'Professional medical care delivered to your home for urgent but non-critical conditions, reducing hospital visits.'
    },
    {
      icon: Video,
      title: 'Available Doctor',
      description: 'Connect instantly with an available doctor for remote medical consultation and urgent health advice.'
    },
    {
      icon: Building2,
      title: 'Corporate and school coverage',
      description: 'Dedicated emergency medical services for businesses, schools, and organizations with on-site response capabilities.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Emergencycare360 - Emergency Response Services</title>
        <meta name="description" content="Professional emergency medical services across the Eastern Region and Nation wide. 24/7 ambulance dispatch, home care, disaster response, and corporate coverage. Call +234 801 234 5678 for immediate help." />
      </Helmet>

      <OfflineBanner />


      <main>
        <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: 'url(https://horizons-cdn.hostinger.com/ef8d048f-5959-49b1-98b1-993f960c08a7/27e1f0c78e518cf9c0aaea6510ef16d4.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(1.3)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/60"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-white mb-6 text-balance text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
                Rapid, Life-Saving Emergency Care
              </h1>
              <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
                Professional medical emergency services across the Eastern Region and Nation wide. Our trained response teams are ready 24/7 to provide life-saving care when you need it most.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
                {emergencyActions.map((action, index) => (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  >
                    {action.href && action.href.startsWith('tel:') ? (
                      <a
                        href={action.href}
                        className={`block ${action.color} emergency-button rapidaid-button text-left`}
                      >
                        <action.icon className="w-6 h-6 mb-2" />
                        <div className="font-bold mb-1">{action.title}</div>
                        <div className="text-sm opacity-90">{action.description}</div>
                      </a>
                    ) : action.action ? (
                      <button
                        onClick={action.action}
                        className={`block w-full ${action.color} emergency-button rapidaid-button text-left`}
                      >
                        <action.icon className="w-6 h-6 mb-2" />
                        <div className="font-bold mb-1">{action.title}</div>
                        <div className="text-sm opacity-90">{action.description}</div>
                      </button>
                    ) : (
                      <Link
                        to={action.href}
                        className={`block ${action.color} emergency-button rapidaid-button text-left`}
                      >
                        <action.icon className="w-6 h-6 mb-2" />
                        <div className="font-bold mb-1">{action.title}</div>
                        <div className="text-sm opacity-90">{action.description}</div>
                      </Link>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <TrustSignals />

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <LiveCounter />
          </div>
        </section>

        <section className="py-20 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Core emergency services</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Comprehensive emergency medical care tailored to your specific needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {coreServices.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="rapidaid-card"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <service.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/services">
                <Button size="lg" className="rapidaid-button">
                  View all services
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* 24/7 Availability Section */}
        <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
          {/* Subtle background pattern for depth */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white"
              >
                24/7 Emergency Availability
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-primary-foreground/90 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed"
              >
                Our dedicated medical response teams are on standby around the clock. Because emergencies don't wait for business hours, neither do we.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white/10 rounded-2xl p-8 border border-white/20 backdrop-blur-sm hover:bg-white/15 transition-colors duration-300"
              >
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Round-the-clock response</h3>
                <p className="text-primary-foreground/80 leading-relaxed">
                  Available 24 hours a day, 7 days a week, 365 days a year including all public holidays and weekends.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white/10 rounded-2xl p-8 border border-white/20 backdrop-blur-sm hover:bg-white/15 transition-colors duration-300"
              >
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Immediate dispatch</h3>
                <p className="text-primary-foreground/80 leading-relaxed">
                  Advanced GPS routing and distributed ambulance fleets ensure the fastest possible arrival times to your location.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white/10 rounded-2xl p-8 border border-white/20 backdrop-blur-sm hover:bg-white/15 transition-colors duration-300"
              >
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Always-on support</h3>
                <p className="text-primary-foreground/80 leading-relaxed">
                  Direct access to trained medical dispatchers who can guide you through critical first-aid while help is on the way.
                </p>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-12 text-center"
            >
              <a href="tel:+2348012345678">
                <Button size="lg" variant="secondary" className="text-secondary-foreground font-bold text-lg px-8 py-6 h-auto rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  <Phone className="w-5 h-5 mr-2" />
                  Call Emergency Line Now
                </Button>
              </a>
            </motion.div>
          </div>
        </section>
      </main>


      <EmergencyFloatingButton />
      <CookieConsent />
    </>
  );
};

export default HomePage;