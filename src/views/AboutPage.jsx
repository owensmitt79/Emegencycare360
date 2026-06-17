import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Award, Users, Heart, Zap, ArrowRight, Stethoscope } from 'lucide-react';

const AboutPage = () => {
  const ceoData = {
    name: 'Dr. Nwazue Eligwedire Jane',
    title: 'Founder, Chief Executive Officer (CEO) & Managing Director (MD), Emergency Care 360',
    image: '/dr jane (1).png',
    bio: [
      'Dr. Jane is an Emergency Physician, healthcare leader, and entrepreneur, serving as Founder, CEO, and Managing Director of EmergencyCare360 — an organization focused on improving emergency care through rapid response, telemedicine, ambulances, training, and community empowerment.',
      'She has extensive clinical experience in high-pressure emergency settings (resuscitation, critical care, disaster response) and is currently undergoing specialist residency training in Emergency Medicine. She also holds an MBA in Healthcare Management and certifications in BLS, ACLS, and ATLS from the American Heart Association.',
      'Dr. Jane founded EmergencyCare360 to address gaps in emergency healthcare access. Her vision is to make quality emergency care accessible regardless of location or income. She leads initiatives in medical response, teleconsultation, first aid training, corporate preparedness, and community health education.',
      'Beyond clinical work, she advocates for emergency response infrastructure, healthcare innovation, workforce development, and mentorship — especially within Africa. Her core belief is that timely intervention, quality care, and informed communities save lives.'
    ],
    credentials: 'MD, Emergency Medicine | MBA Healthcare Administration | Certified Emergency Medical Director'
  };

  const advisoryBoard = [
    {
      name: 'Prof. Emeka Nwosu',
      title: 'Medical Director',
      specialty: 'Emergency Medicine',
      image: 'https://horizons-cdn.hostinger.com/ef8d048f-5959-49b1-98b1-993f960c08a7/board-member-1.png'
    },
    {
      name: 'Dr. Amara Adeyemi',
      title: 'Head of Operations',
      specialty: 'Paramedic Services & Training',
      image: 'https://horizons-cdn.hostinger.com/ef8d048f-5959-49b1-98b1-993f960c08a7/board-member-2.png'
    },
    {
      name: 'Dr. Chukwu Obi',
      title: 'Clinical Advisor',
      specialty: 'Trauma & Critical Care',
      image: 'https://horizons-cdn.hostinger.com/ef8d048f-5959-49b1-98b1-993f960c08a7/board-member-3.png'
    },
    {
      name: 'Dr. Ngozi Eze',
      title: 'Community Health Officer',
      specialty: 'Public Health & Outreach',
      image: 'https://horizons-cdn.hostinger.com/ef8d048f-5959-49b1-98b1-993f960c08a7/board-member-4.png'
    }
  ];

  const partnershipCards = [
    {
      logo: 'https://horizons-cdn.hostinger.com/ef8d048f-5959-49b1-98b1-993f960c08a7/f377bc91d3310dcf868d92c947ec9afe.png',
      alt: 'NEMA Logo',
      title: 'NEMA Certified',
      caption: 'National Emergency Management Agency Partner'
    },
    {
      logo: 'https://horizons-cdn.hostinger.com/ef8d048f-5959-49b1-98b1-993f960c08a7/0b2291f52af91fa0c70479348b70a2fa.png',
      alt: 'Red Cross Logo',
      title: 'Red Cross Partner',
      caption: 'International humanitarian organization partnership'
    },
    {
      logo: 'https://horizons-cdn.hostinger.com/ef8d048f-5959-49b1-98b1-993f960c08a7/3ab9fe10ea260f7e3dc6db055e44f8f9.png',
      alt: 'WHO Logo',
      title: 'WHO Recognized',
      caption: 'World Health Organization recognized standards'
    }
  ];

  const coreValues = [
    {
      icon: Heart,
      title: 'Patient-Centered Care',
      description: 'Every decision we make prioritizes the health, safety, and dignity of those we serve.'
    },
    {
      icon: Zap,
      title: 'Rapid Response',
      description: 'Speed saves lives. Our systems are optimized for the fastest possible emergency response.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We maintain the highest standards of medical training, equipment, and service delivery.'
    },
    {
      icon: Users,
      title: 'Community Trust',
      description: 'We build lasting relationships with the communities we serve through transparency and accountability.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>About Emergencycare360 - Our Mission & Team</title>
        <meta name="description" content="Learn about Emergencycare360's mission to provide rapid emergency medical services. Meet our leadership team, medical advisory board, and discover our commitment to saving lives." />
      </Helmet>

      <main className="bg-background">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-b from-primary/10 to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
                About Emergencycare360
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Dedicated to providing rapid, professional emergency medical services that save lives and restore hope across the Eastern Region and beyond.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  To provide accessible, rapid, and professional emergency medical services that prioritize patient care, community safety, and the preservation of life. We are committed to being the most trusted emergency response provider in the region.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  A future where every person has immediate access to professional emergency medical care, regardless of location or circumstance. We envision a region where rapid response saves lives and emergency preparedness is a community standard.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                These principles guide every decision we make and every service we provide.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {coreValues.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CEO Section */}
        <section className="py-20 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Leadership</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Guided by experienced healthcare professionals committed to excellence.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12">
                <div className="flex items-center justify-center">
                  <img
                    src={ceoData.image}
                    alt={ceoData.name}
                    className="w-full max-w-sm rounded-xl shadow-lg object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="text-3xl font-bold mb-2">{ceoData.name}</h3>
                  <p className="text-primary font-semibold text-lg mb-4">{ceoData.title}</p>
                  <div className="text-muted-foreground leading-relaxed mb-6 text-base space-y-4">
                    {ceoData.bio.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-sm font-medium text-foreground">{ceoData.credentials}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Medical Advisory Board */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Medical Advisory Board</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Experienced medical professionals ensuring clinical excellence and best practices.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {advisoryBoard.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-1">{member.name}</h3>
                    <p className="text-primary font-semibold text-sm mb-2">{member.title}</p>
                    <p className="text-muted-foreground text-sm">{member.specialty}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Available Doctors Banner */}
        <section className="py-12 bg-primary/5 border-y border-primary/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link 
              to="/doctors-availability" 
              className="group block bg-card rounded-2xl border border-primary/20 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300 overflow-hidden"
            >
              <div className="flex flex-col md:flex-row items-center justify-between p-8 md:p-10 gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Stethoscope className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      Consult with our Available Doctors
                    </h3>
                    <p className="text-muted-foreground text-lg">
                      Need immediate medical advice? Connect with our verified professionals online via chat, voice, or video call.
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground group-hover:translate-x-2 transition-transform duration-300">
                  <ArrowRight className="w-6 h-6" />
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Certifications & Partnerships */}
        <section className="py-20 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3 text-primary">Certifications & Partnerships</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Recognized by leading health and emergency organizations for our commitment to excellence and rapid response standards.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {partnershipCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card rounded-2xl border border-border shadow-sm p-8 flex flex-col items-center justify-center text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="mb-6 flex items-center justify-center h-28 w-full">
                    <img
                      src={card.logo}
                      alt={card.alt}
                      className="h-full w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-foreground">{card.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{card.caption}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Mission</h2>
              <p className="text-primary-foreground/90 max-w-2xl mx-auto text-lg mb-8 leading-relaxed">
                Whether you're a healthcare professional, community partner, or someone who believes in rapid emergency response, we invite you to be part of our life-saving mission.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="inline-block bg-white text-primary font-bold py-3 px-8 rounded-lg hover:bg-white/90 transition-colors duration-300"
                >
                  Get in Touch
                </a>
                <a
                  href="/services"
                  className="inline-block border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white/10 transition-colors duration-300"
                >
                  Learn More
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
};

export default AboutPage;