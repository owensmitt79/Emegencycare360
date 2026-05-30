import React from 'react';
import { Helmet } from 'react-helmet';
import { Stethoscope, Home, Flame, Building2, GraduationCap, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Link } from 'react-router-dom';

const ServicesPage = () => {
  const services = [
    {
      icon: Stethoscope,
      name: 'Emergency medical response',
      what: 'Rapid ambulance dispatch with trained paramedics and advanced life support equipment.',
      when: 'Heart attacks, strokes, severe injuries, breathing difficulties, unconsciousness',
      responseTime: '8-15 minutes',
      coverage: 'Eastern Region & Nation wide',
      color: 'bg-red-50 border-red-200'
    },
    {
      icon: Home,
      name: 'Home emergency care',
      what: 'Professional medical care delivered to your home for urgent but non-critical conditions.',
      when: 'High fever, minor injuries, medication administration, post-surgery care',
      responseTime: '30-60 minutes',
      coverage: 'Eastern Region',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      icon: Flame,
      name: 'Disaster response',
      what: 'Coordinated emergency response for natural disasters and mass casualty incidents.',
      when: 'Floods, building collapses, fires, accidents with multiple victims',
      responseTime: 'Immediate deployment',
      coverage: 'Nationwide coordination',
      color: 'bg-orange-50 border-orange-200'
    },
    {
      icon: Building2,
      name: 'Corporate and school coverage',
      what: 'Dedicated emergency medical services for businesses and educational institutions.',
      when: 'Workplace injuries, student emergencies, health screenings, on-site medical support',
      responseTime: 'On-site or 10-20 minutes',
      coverage: 'Custom service areas',
      color: 'bg-green-50 border-green-200'
    },
    {
      icon: GraduationCap,
      name: 'First aid training',
      what: 'Certified first aid and CPR training programs for individuals and organizations.',
      when: 'Workplace safety compliance, community preparedness, personal skill development',
      responseTime: 'Scheduled sessions',
      coverage: 'Eastern Region & Nation wide',
      color: 'bg-purple-50 border-purple-200'
    },
    {
      icon: Video,
      name: 'Available Doctor',
      what: 'Connect instantly with an available doctor for remote medical consultation and urgent health advice.',
      when: 'Medical advice needed, symptom assessment, medication guidance',
      responseTime: '2-5 minutes',
      coverage: 'Available nationwide',
      color: 'bg-indigo-50 border-indigo-200'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Emergencycare360 - Emergency Services</title>
        <meta name="description" content="Comprehensive emergency medical services including ambulance dispatch, home care, disaster response, corporate coverage, training, and available doctor consultations across the Eastern Region and Nation wide." />
      </Helmet>



      <main className="py-12 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Emergency services</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Comprehensive emergency medical care tailored to your specific needs. Available 24/7 across the Eastern Region and Nation wide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`rapidaid-card ${service.color} border`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <service.icon className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-1">{service.name}</h2>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-1">What it is</h3>
                    <p className="text-sm">{service.what}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-1">When to use</h3>
                    <p className="text-sm">{service.when}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-1">Response time</h3>
                      <p className="text-sm font-medium">{service.responseTime}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-1">Coverage</h3>
                      <p className="text-sm font-medium">{service.coverage}</p>
                    </div>
                  </div>
                </div>

                <Link to="/emergency">
                  <Button className="w-full rapidaid-button">
                    Request this service
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="rapidaid-card inline-block">
              <h3 className="font-semibold mb-2">Need help choosing a service?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Contact our team for guidance on the best service for your situation
              </p>
              <Link to="/contact">
                <Button variant="outline" className="rapidaid-button">
                  Contact us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>


    </>
  );
};

export default ServicesPage;