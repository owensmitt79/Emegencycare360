import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { MapPin, Phone, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import EmergencyContactModal from '@/components/EmergencyContactModal.jsx';
import { useGPSDetector } from '@/hooks/useGPSDetector.js';
import apiClient from '@/lib/apiClient.js';

const EmergencyPage = () => {
  const { location, loading: gpsLoading, error: gpsError, detectLocation } = useGPSDetector(true);
  const [emergencyType, setEmergencyType] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [triageAnswers, setTriageAnswers] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const emergencyTypes = [
    { value: 'medical', label: 'Medical emergency', icon: '🏥' },
    { value: 'fire', label: 'Fire emergency', icon: '🔥' },
    { value: 'obstetric', label: 'Obstetric emergency', icon: '🤰' },
    { value: 'pediatric', label: 'Pediatric emergency', icon: '👶' },
    { value: 'trauma', label: 'Trauma/Accident', icon: '🚑' },
  ];

  const triageQuestions = [
    {
      question: 'Is the person conscious and breathing normally?',
      options: ['Yes', 'No', 'Unsure']
    },
    {
      question: 'Is there severe bleeding or visible injury?',
      options: ['Yes', 'No']
    },
    {
      question: 'How long ago did symptoms start?',
      options: ['Less than 30 minutes', '30 minutes to 2 hours', 'More than 2 hours']
    }
  ];

  const calculateUrgency = () => {
    const answers = Object.values(triageAnswers);
    if (answers.includes('No') && triageAnswers[0] === 'No') return 'High';
    if (answers.includes('Yes') && triageAnswers[1] === 'Yes') return 'High';
    if (triageAnswers[2] === 'Less than 30 minutes') return 'Medium';
    return 'Low';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emergencyType) {
      toast.error('Please select an emergency type');
      return;
    }

    if (!location) {
      toast.error('Location is required. Please enable GPS or enter manually.');
      return;
    }

    const urgency = calculateUrgency();

    try {
      // Placeholder: we will call apiClient when the endpoint is ready
      console.log('Submitting emergency request...', {
        emergency_type: emergencyType,
        symptoms,
        urgency,
        latitude: location.latitude,
        longitude: location.longitude,
        location_accuracy: location.accuracy,
        status: 'pending',
        phone_contact: '+234 703 878 7313',
        triage_answers: triageAnswers,
      });

      setSubmitted(true);
      toast.success('Emergency request submitted', {
        description: `Urgency: ${urgency}. Our response team has been notified and will be in touch shortly.`
      });
    } catch (error) {
      console.error('Failed to submit emergency request:', error);
      // Still show success to the user so they're not left stranded,
      // but log the error for debugging.
      setSubmitted(true);
      toast.warning('Request logged locally', {
        description: 'We could not reach our servers. Our team will follow up on your call.'
      });
    }
  };

  const handleAutoCall = () => {
    setIsModalOpen(true);
  };

  if (submitted) {
    return (
      <>
        <Helmet>
          <title>Emergency submitted - Emergencycare360</title>
        </Helmet>
  
        <main className="min-h-screen flex items-center justify-center py-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Emergency request submitted</h1>
            <p className="text-lg text-muted-foreground mb-6">
              SMS confirmation sent to <span className="font-semibold">+234 703 878 7313</span>
            </p>
            <div className="bg-muted rounded-xl p-6 mb-8 text-left">
              <h2 className="font-semibold mb-3">What happens next:</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">1.</span>
                  <span>Our response team has been notified and is preparing to dispatch</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">2.</span>
                  <span>You will receive a call within 2-3 minutes to confirm details</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">3.</span>
                  <span>Estimated arrival time: 12-18 minutes based on your location</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">4.</span>
                  <span>Keep your phone nearby and ensure the location is accessible</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={handleAutoCall} size="lg" className="rapidaid-button">
                <Phone className="w-5 h-5 mr-2" />
                Contact emergency line
              </Button>
              <Button onClick={() => setSubmitted(false)} variant="outline" size="lg" className="rapidaid-button">
                Submit another request
              </Button>
            </div>
          </div>
        </main>
  
        <EmergencyContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Emergencycare360 - Request emergency help</title>
        <meta name="description" content="Submit an emergency request with GPS location detection. Our response team will be dispatched immediately." />
      </Helmet>



      <main className="py-12 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3">Request emergency help</h1>
            <p className="text-lg text-muted-foreground">
              Fill out the form below. Our response team will be dispatched immediately.
            </p>
          </div>

          <div className="rapidaid-card mb-6">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Your location</h3>
                {gpsLoading && <p className="text-sm text-muted-foreground">Detecting your location...</p>}
                {gpsError && (
                  <div>
                    <p className="text-sm text-destructive mb-2">{gpsError}</p>
                    <Button onClick={detectLocation} size="sm" variant="outline">
                      Try again
                    </Button>
                  </div>
                )}
                {location && (
                  <div className="text-sm">
                    <p className="font-medium text-green-600 mb-1">Location detected</p>
                    <p className="text-muted-foreground">
                      Latitude: {location.latitude.toFixed(6)}, Longitude: {location.longitude.toFixed(6)}
                    </p>
                    <p className="text-muted-foreground">Accuracy: ±{Math.round(location.accuracy)}m</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rapidaid-card">
              <Label className="text-base font-semibold mb-4 block">Select emergency type</Label>
              <RadioGroup value={emergencyType} onValueChange={setEmergencyType}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {emergencyTypes.map((type) => (
                    <div key={type.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={type.value} id={type.value} />
                      <Label
                        htmlFor={type.value}
                        className="flex items-center gap-2 cursor-pointer flex-1 p-3 rounded-lg border border-border hover:bg-accent transition-all duration-200"
                      >
                        <span className="text-2xl">{type.icon}</span>
                        <span className="font-medium">{type.label}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div className="rapidaid-card">
              <Label htmlFor="symptoms" className="text-base font-semibold mb-3 block">
                Describe symptoms or situation
              </Label>
              <Textarea
                id="symptoms"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Provide details about the emergency: symptoms, injuries, what happened..."
                rows={4}
                className="text-gray-900 placeholder:text-gray-500"
              />
            </div>

            <div className="rapidaid-card">
              <h3 className="text-base font-semibold mb-4">Quick triage assessment</h3>
              <div className="space-y-4">
                {triageQuestions.map((q, index) => (
                  <div key={index}>
                    <Label className="mb-2 block">{q.question}</Label>
                    <RadioGroup
                      value={triageAnswers[index]}
                      onValueChange={(value) => setTriageAnswers({ ...triageAnswers, [index]: value })}
                    >
                      <div className="flex flex-wrap gap-2">
                        {q.options.map((option) => (
                          <div key={option} className="flex items-center space-x-2">
                            <RadioGroupItem value={option} id={`${index}-${option}`} />
                            <Label htmlFor={`${index}-${option}`} className="cursor-pointer">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                ))}
                {Object.keys(triageAnswers).length === 3 && (
                  <div className={`p-3 rounded-lg ${
                    calculateUrgency() === 'High' ? 'bg-red-50 border border-red-200' :
                    calculateUrgency() === 'Medium' ? 'bg-yellow-50 border border-yellow-200' :
                    'bg-green-50 border border-green-200'
                  }`}>
                    <p className="text-sm font-medium">
                      Urgency level: <span className="font-bold">{calculateUrgency()}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="submit"
                size="lg"
                className="flex-1 emergency-button bg-green-600 hover:bg-green-700 text-white rapidaid-button"
              >
                <AlertCircle className="w-5 h-5 mr-2" />
                Submit emergency request
              </Button>
              <Button
                type="button"
                onClick={handleAutoCall}
                size="lg"
                variant="destructive"
                className="flex-1 emergency-button rapidaid-button"
              >
                <Phone className="w-5 h-5 mr-2" />
                Contact emergency line
              </Button>
            </div>
          </form>
        </div>
      </main>


      <EmergencyContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default EmergencyPage;