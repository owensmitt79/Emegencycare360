import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';
import apiClient from '@/lib/apiClient.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Personal Info' },
  { id: 2, title: 'Credentials' },
  { id: 3, title: 'Professional' },
  { id: 4, title: 'Security' }
];

const DoctorRegisterPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    medicalLicenseNumber: '',
    licenseIssuingCountry: '',
    licenseExpiryDate: '',
    medicalSchool: '',
    graduationYear: '',
    specialization: '',
    yearsOfExperience: '',
    hospitalName: '',
    hospitalAddress: '',
    hospitalPhone: '',
    consultationFee: '',
    preferredHoursStart: '',
    preferredHoursEnd: '',
    languagesSpoken: '',
    password: '',
    passwordConfirm: '',
    ndprCompliance: false,
    medicalEthicsAgreement: false,
    termsAccepted: false,
    availableForChat: true,
    availableForVoiceCalls: true,
    availableForVideoCalls: true,
  });

  const [files, setFiles] = useState({
    profilePicture: null,
    professionalLicenseDoc: null,
    proofOfSpecialization: null
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles[0]) {
      setFiles(prev => ({ ...prev, [name]: selectedFiles[0] }));
    }
  };

  const validateStep = async (step) => {
    const newErrors = {};
    let isValid = true;

    if (step === 1) {
      if (!formData.fullName) newErrors.fullName = 'Full name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
      if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
      else if (!/^\+234\d{10}$/.test(formData.phoneNumber)) newErrors.phoneNumber = 'Must be in format +234...';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';

      // Check email uniqueness if valid format
      if (!newErrors.email) {
        try {
          // Placeholder for real API
          const existing = { totalItems: 0 };
          if (existing.totalItems > 0) {
            newErrors.email = 'Email is already registered';
          }
        } catch (e) {
          console.error('Error checking email:', e);
        }
      }
    }

    if (step === 2) {
      if (!formData.medicalLicenseNumber) newErrors.medicalLicenseNumber = 'License number is required';
      if (!formData.licenseIssuingCountry) newErrors.licenseIssuingCountry = 'Issuing country is required';
      if (!formData.licenseExpiryDate) newErrors.licenseExpiryDate = 'Expiry date is required';
      else if (new Date(formData.licenseExpiryDate) <= new Date()) newErrors.licenseExpiryDate = 'License must be valid (future date)';
      if (!formData.medicalSchool) newErrors.medicalSchool = 'Medical school is required';
      if (!formData.graduationYear) newErrors.graduationYear = 'Graduation year is required';
      if (!formData.specialization) newErrors.specialization = 'Specialization is required';
      if (!formData.yearsOfExperience) newErrors.yearsOfExperience = 'Years of experience is required';
      if (!files.professionalLicenseDoc) newErrors.professionalLicenseDoc = 'License document is required';
    }

    if (step === 3) {
      if (!formData.hospitalName) newErrors.hospitalName = 'Hospital name is required';
      if (!formData.hospitalAddress) newErrors.hospitalAddress = 'Hospital address is required';
      if (!formData.hospitalPhone) newErrors.hospitalPhone = 'Hospital phone is required';
    }

    if (step === 4) {
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
      else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) newErrors.password = 'Password must contain uppercase, lowercase, and number';
      
      if (formData.password !== formData.passwordConfirm) newErrors.passwordConfirm = 'Passwords do not match';
      
      if (!formData.ndprCompliance) newErrors.ndprCompliance = 'You must agree to NDPR compliance';
      if (!formData.medicalEthicsAgreement) newErrors.medicalEthicsAgreement = 'You must agree to Medical Ethics';
      if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the Terms and Conditions';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      isValid = false;
    }

    return isValid;
  };

  const nextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
      window.scrollTo(0, 0);
    } else {
      toast.error('Please fix the errors before proceeding');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validateStep(4);
    if (!isValid) return;

    setIsLoading(true);
    try {
      const submitData = new FormData();
      
      // Append all text fields
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      
      // Set default verification status
      submitData.append('verificationStatus', 'Pending');
      submitData.append('emailVisibility', true);

      // Append files
      if (files.profilePicture) submitData.append('profilePicture', files.profilePicture);
      if (files.professionalLicenseDoc) submitData.append('professionalLicenseDoc', files.professionalLicenseDoc);
      if (files.proofOfSpecialization) submitData.append('proofOfSpecialization', files.proofOfSpecialization);

      // Placeholder for API
      console.log('Registering doctor...', submitData);
      
      toast.success('Registration successful! Please wait for verification.');
      navigate('/doctors/login');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Doctor Registration | Emergencycare360</title>
      </Helmet>

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-foreground">Join Our Medical Network</h1>
          <p className="mt-2 text-muted-foreground">Complete your profile to start consulting with patients</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-8 px-4">
          {STEPS.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center relative z-10">
                <div className={`step-indicator ${
                  currentStep === step.id ? 'active' : 
                  currentStep > step.id ? 'completed' : 'pending'
                }`}>
                  {currentStep > step.id ? <CheckCircle2 className="w-5 h-5" /> : step.id}
                </div>
                <span className={`text-xs mt-2 font-medium hidden sm:block ${
                  currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step.title}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div className={`step-line ${currentStep > step.id ? 'completed' : 'pending'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-card rounded-2xl shadow-lg border border-border p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* STEP 1: Personal Info */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-semibold border-b pb-2">Personal Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Dr. Jane Doe" className="text-foreground" />
                    {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="doctor@example.com" className="text-foreground" />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="+2348012345678" className="text-foreground" />
                    {errors.phoneNumber && <p className="text-sm text-destructive">{errors.phoneNumber}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} className="text-foreground" />
                    {errors.dateOfBirth && <p className="text-sm text-destructive">{errors.dateOfBirth}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Select value={formData.gender} onValueChange={(val) => handleSelectChange('gender', val)}>
                      <SelectTrigger className="text-foreground">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.gender && <p className="text-sm text-destructive">{errors.gender}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profilePicture">Profile Picture (Optional)</Label>
                    <div className="flex items-center gap-4">
                      <Input id="profilePicture" name="profilePicture" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                      <Label htmlFor="profilePicture" className="cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-muted transition-colors">
                        <Upload className="w-4 h-4" />
                        {files.profilePicture ? 'Change Image' : 'Upload Image'}
                      </Label>
                      {files.profilePicture && <span className="text-sm text-muted-foreground truncate max-w-[150px]">{files.profilePicture.name}</span>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Credentials */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-semibold border-b pb-2">Medical Credentials</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="medicalLicenseNumber">Medical License Number *</Label>
                    <Input id="medicalLicenseNumber" name="medicalLicenseNumber" value={formData.medicalLicenseNumber} onChange={handleInputChange} className="text-foreground" />
                    {errors.medicalLicenseNumber && <p className="text-sm text-destructive">{errors.medicalLicenseNumber}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="licenseIssuingCountry">License Issuing Country *</Label>
                    <Input id="licenseIssuingCountry" name="licenseIssuingCountry" value={formData.licenseIssuingCountry} onChange={handleInputChange} className="text-foreground" />
                    {errors.licenseIssuingCountry && <p className="text-sm text-destructive">{errors.licenseIssuingCountry}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="licenseExpiryDate">License Expiry Date *</Label>
                    <Input id="licenseExpiryDate" name="licenseExpiryDate" type="date" value={formData.licenseExpiryDate} onChange={handleInputChange} className="text-foreground" />
                    {errors.licenseExpiryDate && <p className="text-sm text-destructive">{errors.licenseExpiryDate}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization *</Label>
                    <Select value={formData.specialization} onValueChange={(val) => handleSelectChange('specialization', val)}>
                      <SelectTrigger className="text-foreground">
                        <SelectValue placeholder="Select specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General Practice">General Practice</SelectItem>
                        <SelectItem value="Emergency Medicine">Emergency Medicine</SelectItem>
                        <SelectItem value="Surgery">Surgery</SelectItem>
                        <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                        <SelectItem value="Obstetrics">Obstetrics</SelectItem>
                        <SelectItem value="Cardiology">Cardiology</SelectItem>
                        <SelectItem value="Neurology">Neurology</SelectItem>
                        <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                        <SelectItem value="Radiology">Radiology</SelectItem>
                        <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.specialization && <p className="text-sm text-destructive">{errors.specialization}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medicalSchool">Medical School *</Label>
                    <Input id="medicalSchool" name="medicalSchool" value={formData.medicalSchool} onChange={handleInputChange} className="text-foreground" />
                    {errors.medicalSchool && <p className="text-sm text-destructive">{errors.medicalSchool}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="graduationYear">Graduation Year *</Label>
                    <Input id="graduationYear" name="graduationYear" type="number" min="1950" max={new Date().getFullYear()} value={formData.graduationYear} onChange={handleInputChange} className="text-foreground" />
                    {errors.graduationYear && <p className="text-sm text-destructive">{errors.graduationYear}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="yearsOfExperience">Years of Experience *</Label>
                    <Input id="yearsOfExperience" name="yearsOfExperience" type="number" min="0" value={formData.yearsOfExperience} onChange={handleInputChange} className="text-foreground" />
                    {errors.yearsOfExperience && <p className="text-sm text-destructive">{errors.yearsOfExperience}</p>}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="professionalLicenseDoc">Professional License Document (PDF) *</Label>
                    <div className="flex items-center gap-4">
                      <Input id="professionalLicenseDoc" name="professionalLicenseDoc" type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
                      <Label htmlFor="professionalLicenseDoc" className="cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-muted transition-colors">
                        <Upload className="w-4 h-4" />
                        {files.professionalLicenseDoc ? 'Change Document' : 'Upload PDF'}
                      </Label>
                      {files.professionalLicenseDoc && <span className="text-sm text-muted-foreground truncate">{files.professionalLicenseDoc.name}</span>}
                    </div>
                    {errors.professionalLicenseDoc && <p className="text-sm text-destructive">{errors.professionalLicenseDoc}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Professional Info */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-semibold border-b pb-2">Professional Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="hospitalName">Current Hospital/Clinic Name *</Label>
                    <Input id="hospitalName" name="hospitalName" value={formData.hospitalName} onChange={handleInputChange} className="text-foreground" />
                    {errors.hospitalName && <p className="text-sm text-destructive">{errors.hospitalName}</p>}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="hospitalAddress">Hospital Address *</Label>
                    <Input id="hospitalAddress" name="hospitalAddress" value={formData.hospitalAddress} onChange={handleInputChange} className="text-foreground" />
                    {errors.hospitalAddress && <p className="text-sm text-destructive">{errors.hospitalAddress}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hospitalPhone">Hospital Phone *</Label>
                    <Input id="hospitalPhone" name="hospitalPhone" value={formData.hospitalPhone} onChange={handleInputChange} className="text-foreground" />
                    {errors.hospitalPhone && <p className="text-sm text-destructive">{errors.hospitalPhone}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="consultationFee">Consultation Fee (₦) (Optional)</Label>
                    <Input id="consultationFee" name="consultationFee" type="number" value={formData.consultationFee} onChange={handleInputChange} className="text-foreground" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="languagesSpoken">Languages Spoken</Label>
                    <Input id="languagesSpoken" name="languagesSpoken" placeholder="English, Yoruba, etc." value={formData.languagesSpoken} onChange={handleInputChange} className="text-foreground" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Security & Agreements */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-semibold border-b pb-2">Security & Agreements</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} className="text-foreground" />
                    {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                    <p className="text-xs text-muted-foreground">Min 8 chars, 1 uppercase, 1 lowercase, 1 number</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passwordConfirm">Confirm Password *</Label>
                    <Input id="passwordConfirm" name="passwordConfirm" type="password" value={formData.passwordConfirm} onChange={handleInputChange} className="text-foreground" />
                    {errors.passwordConfirm && <p className="text-sm text-destructive">{errors.passwordConfirm}</p>}
                  </div>
                </div>

                <div className="space-y-4 mt-6 bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Checkbox id="ndprCompliance" name="ndprCompliance" checked={formData.ndprCompliance} onCheckedChange={(c) => handleInputChange({target: {name: 'ndprCompliance', type: 'checkbox', checked: c}})} />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="ndprCompliance" className="font-medium">NDPR Compliance *</Label>
                      <p className="text-sm text-muted-foreground">I agree to handle patient data in compliance with the Nigeria Data Protection Regulation.</p>
                    </div>
                  </div>
                  {errors.ndprCompliance && <p className="text-sm text-destructive ml-7">{errors.ndprCompliance}</p>}

                  <div className="flex items-start space-x-3">
                    <Checkbox id="medicalEthicsAgreement" name="medicalEthicsAgreement" checked={formData.medicalEthicsAgreement} onCheckedChange={(c) => handleInputChange({target: {name: 'medicalEthicsAgreement', type: 'checkbox', checked: c}})} />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="medicalEthicsAgreement" className="font-medium">Medical Ethics Agreement *</Label>
                      <p className="text-sm text-muted-foreground">I agree to abide by the standard medical ethics and guidelines for telemedicine.</p>
                    </div>
                  </div>
                  {errors.medicalEthicsAgreement && <p className="text-sm text-destructive ml-7">{errors.medicalEthicsAgreement}</p>}

                  <div className="flex items-start space-x-3">
                    <Checkbox id="termsAccepted" name="termsAccepted" checked={formData.termsAccepted} onCheckedChange={(c) => handleInputChange({target: {name: 'termsAccepted', type: 'checkbox', checked: c}})} />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="termsAccepted" className="font-medium">Terms and Conditions *</Label>
                      <p className="text-sm text-muted-foreground">I accept the platform's terms of service and privacy policy.</p>
                    </div>
                  </div>
                  {errors.termsAccepted && <p className="text-sm text-destructive ml-7">{errors.termsAccepted}</p>}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1 || isLoading}
              >
                <ChevronLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              
              {currentStep < 4 ? (
                <Button type="button" onClick={nextStep}>
                  Next <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Submitting...' : 'Complete Registration'}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorRegisterPage;