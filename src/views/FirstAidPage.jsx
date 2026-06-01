import React from 'react';
import { Helmet } from 'react-helmet';
import { Download, Heart, Wind, Droplet, Brain, Zap, Flame } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const FirstAidPage = () => {
  const guides = [
    {
      id: 'cpr',
      icon: Heart,
      title: 'CPR for adults',
      summary: 'Cardiopulmonary resuscitation to restore blood circulation and breathing',
      image: 'https://images.unsplash.com/photo-1692085654353-bad2a051e13d',
      steps: [
        'Check for responsiveness - tap shoulders and shout "Are you okay?"',
        'Call emergency services immediately or have someone else call',
        'Place person on firm, flat surface. Kneel beside their chest',
        'Place heel of one hand on center of chest, other hand on top. Interlock fingers',
        'Push hard and fast - compress chest at least 2 inches deep at 100-120 compressions per minute',
        'After 30 compressions, give 2 rescue breaths. Tilt head back, lift chin, pinch nose, seal mouth and blow',
        'Continue cycles of 30 compressions and 2 breaths until help arrives or person starts breathing'
      ],
      beforeHelp: 'Do not stop CPR until professional help arrives. If an AED is available, use it immediately. Continue compressions even if you are tired - switch with another person if possible.'
    },
    {
      id: 'choking',
      icon: Wind,
      title: 'Choking (Heimlich maneuver)',
      summary: 'Emergency procedure to dislodge an object blocking the airway',
      steps: [
        'Ask "Are you choking?" If person cannot speak or cough, they need immediate help',
        'Stand behind the person and wrap your arms around their waist',
        'Make a fist with one hand and place it just above the navel',
        'Grasp your fist with the other hand and press into the abdomen with quick, upward thrusts',
        'Repeat thrusts until the object is expelled or person becomes unconscious',
        'If person becomes unconscious, lower them to the ground and begin CPR'
      ],
      beforeHelp: 'Encourage the person to cough forcefully if they can. Do not perform abdominal thrusts on infants under 1 year old - use back blows and chest thrusts instead.'
    },
    {
      id: 'bleeding',
      icon: Droplet,
      title: 'Bleeding control',
      summary: 'Steps to stop severe bleeding and prevent shock',
      steps: [
        'Protect yourself - wear gloves if available',
        'Have the person lie down and elevate the bleeding area above the heart if possible',
        'Remove any visible debris from the wound, but do not remove large objects',
        'Apply firm, direct pressure to the wound using a clean cloth or bandage',
        'Maintain pressure for at least 10-15 minutes without checking if bleeding has stopped',
        'If blood soaks through, add more cloth on top and continue pressure',
        'Once bleeding stops, secure the bandage with tape or cloth strips'
      ],
      beforeHelp: 'Do not remove the bandage once applied. If bleeding does not stop after 15 minutes of pressure, call emergency services. Watch for signs of shock: pale skin, rapid breathing, confusion.'
    },
    {
      id: 'stroke',
      icon: Brain,
      title: 'Stroke recognition (FAST)',
      summary: 'Identify stroke symptoms quickly using the FAST method',
      steps: [
        'F - Face: Ask person to smile. Does one side of face droop?',
        'A - Arms: Ask person to raise both arms. Does one arm drift downward?',
        'S - Speech: Ask person to repeat a simple phrase. Is speech slurred or strange?',
        'T - Time: If you observe any of these signs, call emergency services immediately',
        'Note the time when symptoms first appeared - this is critical information for treatment',
        'Keep the person calm and comfortable while waiting for help'
      ],
      beforeHelp: 'Do not give the person anything to eat or drink. Note the exact time symptoms started. Keep them lying down with head slightly elevated. Every minute counts in stroke treatment.'
    },
    {
      id: 'seizure',
      icon: Zap,
      title: 'Seizure first aid',
      summary: 'How to help someone during and after a seizure',
      steps: [
        'Stay calm and note the time the seizure starts',
        'Clear the area around the person of any hard or sharp objects',
        'Cushion their head with something soft like a folded jacket',
        'Turn the person on their side to keep airway clear',
        'Do NOT put anything in their mouth or try to restrain them',
        'Time the seizure - call emergency services if it lasts more than 5 minutes',
        'After seizure ends, stay with person and speak calmly as they regain consciousness'
      ],
      beforeHelp: 'Most seizures end within 1-2 minutes. Call emergency services if: seizure lasts over 5 minutes, person has multiple seizures, person is injured, pregnant, or has diabetes, or this is their first seizure.'
    },
    {
      id: 'burns',
      icon: Flame,
      title: 'Burn treatment',
      summary: 'First aid for thermal, chemical, and electrical burns',
      steps: [
        'Remove person from heat source and ensure scene is safe',
        'For thermal burns: cool the burn with cool (not ice cold) running water for 10-20 minutes',
        'Remove jewelry, belts, and tight clothing before swelling begins',
        'Cover burn with sterile, non-stick bandage or clean cloth',
        'For chemical burns: brush off dry chemicals, then rinse with water for 20 minutes',
        'Do NOT apply ice, butter, ointments, or break blisters',
        'For severe burns (larger than 3 inches or on face/hands/feet), seek immediate medical care'
      ],
      beforeHelp: 'Keep the person warm with a blanket to prevent shock. Do not apply ice directly to burns. For electrical burns, do not touch the person until power source is turned off. All electrical burns require medical evaluation.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Emergencycare360 - First Aid Guides</title>
        <meta name="description" content="Step-by-step first aid instructions for CPR, choking, bleeding, stroke, seizures, and burns. Learn life-saving techniques." />
      </Helmet>



      <main className="py-12 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-3">First aid guides</h1>
            <p className="text-lg text-muted-foreground">
              Step-by-step instructions for common medical emergencies. Learn what to do before help arrives.
            </p>
          </div>

          <div className="rapidaid-card mb-8 bg-yellow-50 border-yellow-200">
            <p className="text-sm font-medium">
              <span className="font-bold">Important:</span> These guides are for educational purposes. In a real emergency, always call emergency services first. First aid does not replace professional medical care.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {guides.map((guide) => (
              <AccordionItem
                key={guide.id}
                value={guide.id}
                className="rapidaid-card border-0"
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <guide.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{guide.title}</h2>
                      <p className="text-sm text-muted-foreground">{guide.summary}</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pt-4 space-y-6">
                    {guide.image && (
                      <img
                        src={guide.image}
                        alt={guide.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    )}

                    <div>
                      <h3 className="font-semibold mb-3">Step-by-step instructions</h3>
                      <ol className="space-y-3">
                        {guide.steps.map((step, index) => (
                          <li key={index} className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </span>
                            <span className="text-sm leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-semibold mb-2 text-sm">What to do before help arrives</h3>
                      <p className="text-sm text-muted-foreground">{guide.beforeHelp}</p>
                    </div>

                    <Button variant="outline" className="w-full rapidaid-button" asChild>
                      <a href="#" download>
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF checklist
                      </a>
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 rapidaid-card text-center">
            <h3 className="font-semibold mb-2">Want hands-on training?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Join our certified first aid and CPR training programs
            </p>
            <Button className="rapidaid-button">
              View training schedule
            </Button>
          </div>
        </div>
      </main>


    </>
  );
};

export default FirstAidPage;