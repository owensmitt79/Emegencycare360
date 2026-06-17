import React from 'react';
import { Shield, Award, Users, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const TrustSignals = () => {
  const certifications = [
    {
      icon: Shield,
      title: 'NEMA certified',
      description: 'National Emergency Management Agency'
    },
    {
      icon: Award,
      title: 'Red Cross partner',
      description: 'Official partner organization'
    },
    {
      icon: Users,
      title: 'WHO recognized',
      description: 'World Health Organization standards'
    },
    {
      icon: Clock,
      title: '24/7 availability',
      description: 'Round-the-clock emergency response'
    },
    {
      icon: CheckCircle,
      title: 'NRS certified',
      description: 'Nigeria Revenue Service certified'
    }
  ];

  return (
    <div className="py-16 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Trusted emergency care</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Certified and recognized by leading health and emergency organizations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-xl p-6 text-center border border-border hover:shadow-lg transition-all duration-200"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <cert.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{cert.title}</h3>
              <p className="text-sm text-muted-foreground">{cert.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;