import React from 'react';
import { Helmet } from 'react-helmet';
import { Stethoscope, Home, Flame, Building2, GraduationCap, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import Link from 'next/link';

const ServicesPage = () => {
  const services = [
    {
      icon: Stethoscope,
      name: 'Emergency Medical Response',
      what: 'Rapid ambulance dispatch with highly trained paramedics and advanced life support equipment.',
      when: 'Critical incidents: Heart attacks, strokes, severe injuries, breathing difficulties, unconsciousness.',
      responseTime: '8-15 minutes',
      coverage: 'Eastern Region & Nationwide'
    },
    {
      icon: Home,
      name: 'Home Emergency Care',
      what: 'Professional, clinical-grade medical care delivered directly to your residence for urgent but non-critical conditions.',
      when: 'High fever, minor injuries, post-surgery complications, urgent medication administration.',
      responseTime: '30-60 minutes',
      coverage: 'Eastern Region'
    },
    {
      icon: Flame,
      name: 'Disaster Response',
      what: 'Coordinated, large-scale emergency response protocols for natural disasters and mass casualty incidents.',
      when: 'Industrial accidents, building collapses, fires, and incidents involving multiple casualties.',
      responseTime: 'Immediate deployment',
      coverage: 'Nationwide coordination'
    },
    {
      icon: Building2,
      name: 'Corporate & Institutional Coverage',
      what: 'Dedicated, on-site emergency medical infrastructure for businesses, schools, and large organizations.',
      when: 'Workplace injuries, occupational hazards, health screenings, and on-site medical standby.',
      responseTime: 'On-site or 10-20 minutes',
      coverage: 'Custom service areas'
    },
    {
      icon: GraduationCap,
      name: 'Clinical First Aid Training',
      what: 'Accredited and certified first aid and CPR training programs designed for individuals and corporate teams.',
      when: 'Workplace safety compliance, organizational preparedness, and professional skill development.',
      responseTime: 'Scheduled sessions',
      coverage: 'Eastern Region & Nationwide'
    },
    {
      icon: Video,
      name: 'Telemedicine Consultations',
      what: 'Instant, secure remote consultations with board-certified physicians for urgent health advisories.',
      when: 'Immediate medical advice, symptom triage, medication guidance, and non-emergency clinical assessments.',
      responseTime: '2-5 minutes',
      coverage: 'Available nationwide'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Emergencycare360 - Emergency Services</title>
        <meta name="description" content="Comprehensive emergency medical services including ambulance dispatch, home care, disaster response, corporate coverage, training, and available doctor consultations across the Eastern Region and Nation wide." />
      </Helmet>



      <main className="min-h-screen bg-slate-50 pb-20">
        {/* Formal Hero Section */}
        <div className="bg-slate-900 text-white py-20 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Clinical Services Portfolio</h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
              Emergencycare360 provides comprehensive, professional-grade emergency medical infrastructure. 
              Our services are meticulously tailored to deliver rapid, life-saving interventions across the Eastern Region and nationwide.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg shadow-slate-200/50 border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
              >
                <div className="p-8 flex-grow">
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <service.icon className="w-6 h-6 text-slate-700" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 leading-tight">{service.name}</h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-2">Service Overview</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{service.what}</p>
                    </div>

                    <div>
                      <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-2">Indications</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{service.when}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                      <div>
                        <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-1">Target ETA</h3>
                        <p className="text-slate-800 text-sm font-semibold">{service.responseTime}</p>
                      </div>
                      <div>
                        <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-1">Service Area</h3>
                        <p className="text-slate-800 text-sm font-semibold">{service.coverage}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 mt-auto">
                  <Link href="/emergency" className="w-full">
                    <Button variant="default" className="w-full bg-slate-900 hover:bg-slate-800 text-white shadow-none rounded-lg">
                      Request Dispatch
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Require Administrative Assistance?</h3>
              <p className="text-slate-500 mb-6">
                Please contact our institutional advisory team to discuss custom corporate deployments or specialized clinical requirements.
              </p>
              <Link href="/contact">
                <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
                  Contact Advisory Services
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