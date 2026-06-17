import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'next/link';
import { useRouter } from 'next/navigation';
import { Phone, MapPin, Stethoscope, Home, Building2, Video, Clock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import LiveCounter from '@/components/LiveCounter.jsx';
import TrustSignals from '@/components/TrustSignals.jsx';
import EmergencyFloatingButton from '@/components/EmergencyFloatingButton.jsx';
import CookieConsent from '@/components/CookieConsent.jsx';
import OfflineBanner from '@/components/OfflineBanner.jsx';
import { useTranslation } from '@/contexts/TranslationContext.jsx';

const HomePage = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const emergencyActions = [
    {
      icon: Phone,
      title: t('call_emergency_line'),
      description: t('speak_with_team'),
      href: 'tel:+2348012345678',
      color: 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'
    },
    {
      icon: Stethoscope,
      title: t('get_help_now'),
      description: t('submit_details'),
      action: () => router.push('/emergency'),
      color: 'bg-primary hover:bg-primary/90 text-primary-foreground'
    },
    {
      icon: MapPin,
      title: t('find_facility'),
      description: t('locate_center'),
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
              backgroundImage: 'url(/api/hero-image)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.9)',
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
                {t('hero_title')}
              </h1>
              <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
                {t('hero_subtitle')}
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex justify-center"
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-extrabold text-xl px-12 py-8 rounded-full shadow-2xl flex items-center gap-3 hover:scale-105 transition-transform duration-300">
                      <Zap className="w-7 h-7" />
                      Emergency Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-[360px] p-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border-white/20">
                    {emergencyActions.map((action, index) => (
                      <DropdownMenuItem key={index} asChild className="mb-2 last:mb-0 p-0 rounded-xl cursor-pointer overflow-hidden focus:bg-transparent">
                        {action.href && action.href.startsWith('tel:') ? (
                          <a href={action.href} className={`flex items-start gap-4 p-4 w-full transition-all ${action.color} rounded-xl hover:opacity-90 hover:-translate-y-0.5`}>
                            <action.icon className="w-6 h-6 mt-1 flex-shrink-0" />
                            <div className="flex flex-col text-left">
                              <span className="font-bold text-base">{action.title}</span>
                              <span className="text-sm opacity-90">{action.description}</span>
                            </div>
                          </a>
                        ) : action.action ? (
                          <button onClick={action.action} className={`flex items-start gap-4 p-4 w-full transition-all ${action.color} rounded-xl hover:opacity-90 hover:-translate-y-0.5`}>
                            <action.icon className="w-6 h-6 mt-1 flex-shrink-0" />
                            <div className="flex flex-col text-left">
                              <span className="font-bold text-base">{action.title}</span>
                              <span className="text-sm opacity-90">{action.description}</span>
                            </div>
                          </button>
                        ) : (
                          <a href={action.href} className={`flex items-start gap-4 p-4 w-full transition-all ${action.color} rounded-xl hover:opacity-90 hover:-translate-y-0.5`}>
                            <action.icon className="w-6 h-6 mt-1 flex-shrink-0" />
                            <div className="flex flex-col text-left">
                              <span className="font-bold text-base">{action.title}</span>
                              <span className="text-sm opacity-90">{action.description}</span>
                            </div>
                          </a>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* About The Platform Section */}
        <section className="py-24 bg-white relative overflow-hidden border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-xs uppercase tracking-widest font-bold text-primary mb-3">Platform Overview</h2>
                <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                  Next-Generation Clinical Dispatch & Emergency Infrastructure
                </h3>
                <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                  Emergencycare360 is a fully integrated medical response ecosystem. We bridge the critical gap between patients experiencing life-threatening medical events and the nearest available clinical responders.
                </p>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  Utilizing advanced GPS routing, real-time vital tracking, and a distributed network of certified paramedics and physicians, we ensure that clinical-grade medical intervention arrives exactly when and where it is needed most.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Stethoscope className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Clinical Triage</h4>
                      <p className="text-sm text-slate-500 mt-1 leading-relaxed">Immediate remote assessment by certified medical professionals.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Precision Routing</h4>
                      <p className="text-sm text-slate-500 mt-1 leading-relaxed">Algorithmic dispatch of the closest available trauma unit.</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl transform translate-x-4 translate-y-4 -z-10"></div>
                <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl border border-slate-800">
                  <h4 className="text-2xl font-bold mb-8 border-b border-slate-700 pb-4">Our Operational Protocol</h4>
                  
                  <div className="space-y-8">
                    <div className="flex gap-5">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-sm shadow-lg shadow-primary/30">1</div>
                        <div className="w-0.5 h-12 bg-slate-700 mt-2"></div>
                      </div>
                      <div>
                        <h5 className="text-lg font-bold">Signal Acquisition</h5>
                        <p className="text-slate-400 text-sm mt-1 leading-relaxed">Emergency request is received with exact GPS coordinates and initial symptoms.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-5">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-sm shadow-lg shadow-primary/30">2</div>
                        <div className="w-0.5 h-12 bg-slate-700 mt-2"></div>
                      </div>
                      <div>
                        <h5 className="text-lg font-bold">Resource Allocation</h5>
                        <p className="text-slate-400 text-sm mt-1 leading-relaxed">The nearest ambulance fleet and paramedics are instantly mobilized via our dispatch network.</p>
                      </div>
                    </div>

                    <div className="flex gap-5">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-sm shadow-lg shadow-primary/30">3</div>
                      </div>
                      <div>
                        <h5 className="text-lg font-bold">Medical Intervention</h5>
                        <p className="text-slate-400 text-sm mt-1 leading-relaxed">Life-saving trauma treatment begins immediately on-site and continues in transit to the facility.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

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
              <a href="/services">
                <Button size="lg" className="rapidaid-button">
                  View all services
                </Button>
              </a>
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