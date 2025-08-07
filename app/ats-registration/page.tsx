'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Info, AlertCircle } from 'lucide-react';

// Configuration constants (matching PHP constants)
const CONFIG = {
  ATS_INDIA_PHASE1_ENDDATE: '2025-11-15',
  ATS_INDIA_PHASE2_ENDDATE: '2025-11-22',
  ATS_UAE_PHASE1_ENDDATE: '2025-03-15',
  ATS_UAE_PHASE2_ENDDATE: '2025-03-22',
  
  // Fees structure (ACTUAL VALUES from PHP constants)
  ATS_INDIA_FEE_PHASE1: 2500,        // From PHP: define("ATS_INDIA_FEE_PHASE1",2500);
  ATS_INDIA_FEE_PHASE2: 2700,        // From PHP: define("ATS_INDIA_FEE_PHASE2",2700);
  ATS_INDIA_FEE_PHASE3: 3300,        // From PHP: define("ATS_INDIA_FEE_PHASE3",3300);
  
  ATS_UAE_FEE_PHASE1: 250,           // From PHP: define("ATS_UAE_FEE_PHASE1",250);
  ATS_UAE_FEE_PHASE2: 250,           // From PHP: define("ATS_UAE_FEE_PHASE2",250);
  ATS_UAE_FEE_PHASE3: 300,           // From PHP: define("ATS_UAE_FEE_PHASE3",300);
  
  ATS_INTERNATIONAL_FEE_PHASE1: 70,  // From PHP: define("ATS_INTERNATIONAL_FEE_PHASE1",70);
  ATS_INTERNATIONAL_FEE_PHASE2: 70,  // From PHP: define("ATS_INTERNATIONAL_FEE_PHASE2",70);
  ATS_INTERNATIONAL_FEE_PHASE3: 80,  // From PHP: define("ATS_INTERNATIONAL_FEE_PHASE3",80);
  
  // Subject fees (ACTUAL VALUES from PHP constants)
  ATS_INDIA_ONE_SUBJECTS_FEE: 1700,  // From PHP: define("ATS_INDIA_ONE_SUBJECTS_FEE","1700");
  ATS_INDIA_TWO_SUBJECTS_FEE: 2200,  // From PHP: define("ATS_INDIA_TWO_SUBJECTS_FEE","2200");
  
  ATS_UAE_ONE_SUBJECTS_FEE: 170,     // From PHP: define("ATS_UAE_ONE_SUBJECTS_FEE",170);
  ATS_UAE_TWO_SUBJECTS_FEE: 210,     // From PHP: define("ATS_UAE_TWO_SUBJECTS_FEE",210);
  
  ATS_INTERNATIONAL_ONE_SUBJECTS_FEE: 50,    // From PHP: define("ATS_INTERNATIONAL_ONE_SUBJECTS_FEE",50);
  ATS_INTERNATIONAL_TWO_SUBJECTS_FEE: 60,    // From PHP: define("ATS_INTERNATIONAL_TWO_SUBJECTS_FEE",60);
  
  REGISTRATION_YEAR: '2025',
  ACADEMIC_YEAR: '2025-26'
};

// Feature toggles (matching PHP configuration EXACTLY)
const FEATURES = {
  EnableMobileVerification: false,  // $EnableMobileVerification = 0
  EnablePromoCode: false,          // $EnablePromoCode = 0 (DISABLED)
  EnableNominationCode: true,      // $EnableNominationCode = 1 (but hidden by default)
  EnableEmailVerification: false,  // $EnableEmailVerification = 0
  IsActiveSubjectOffer: true       // $IsActiveSubjectOffer = 1 (but phase-dependent)
};

// Countries array (matching PHP hard-coded countries)
const COUNTRIES = [
  { id: 14, code: 'AU', name: 'Australia' },
  { id: 18, code: 'BH', name: 'Bahrain' },
  { id: 109, code: 'JP', name: 'Japan' },
  { id: 132, code: 'MY', name: 'Malaysia' },
  { id: 166, code: 'OM', name: 'Oman' },
  { id: 179, code: 'QA', name: 'Qatar' },
  { id: 194, code: 'SA', name: 'Saudi Arabia' },
  { id: 199, code: 'SG', name: 'Singapore' },
  { id: 231, code: 'AE', name: 'United Arab Emirates' },
  { id: 233, code: 'US', name: 'United States' }
];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Puducherry'
];

interface FormData {
  // Hidden fields (EXACT PHP field names)
  mobileVerified: string;
  panValVerified: string;
  emailVerified: string;
  clsduketip_hdnaction: string;
  clsduketip_paymentmode: string;
  clsduketip_refundagreement: string;
  clsduketip_whatsapp_update: string;
  client_browser: string;
  clsduketip_gender: string;
  clsduketip_country: string;
  clsduketip_hdnSchoolCode: string;
  clsduketip_schoolname: string;
  clsduketip_assertOrNot: string;
  bonusType: string;
  clsduketip_student_type: string;
  clsduketip_registrationyear: string;
  clsduketip_venuedate: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  ats_fees: string;
  clsduketip_genwisecourseopt: string;
  clsduketip_iplocation: string;
  clsduketip_issubofferactive: string;
  
  // Country selection (PHP field names)
  clsduketip_hdncountry: string;
  
  // Student information (EXACT PHP field names)
  clsduketip_panno: string;
  clsduketip_adstudentid: string;
  clsduketip_atsnominationcode: string;
  clsduketip_firstname: string;
  clsduketip_middlename: string;
  clsduketip_lastname: string;
  clsduketip_subject: string[];  // PHP array format
  clsduketip_class: string;
  clsduketip_dob: string;
  clsduketip_section: string;
  clsduketip_full_schoolname: string;
  clsduketip_examcity1: string;
  
  // Parent information (EXACT PHP field names)
  clsduketip_parentemail: string;
  clsduketip_parentcell: string;
  clsduketip_parentstdcode: string;
  
  // Verification codes (EXACT PHP field names)
  codeField: string;
  otpField: string;
  
  // Agreement (internal state)
  termsAgreed: boolean;
}

export default function ATSRegistrationPage() {
  const [formData, setFormData] = useState<FormData>({
    // Hidden fields (EXACT PHP initialization)
    mobileVerified: FEATURES.EnableMobileVerification ? '' : '1',
    panValVerified: '0',
    emailVerified: FEATURES.EnableEmailVerification ? '' : '1',
    clsduketip_hdnaction: '',
    clsduketip_paymentmode: 'online',
    clsduketip_refundagreement: '',
    clsduketip_whatsapp_update: '',
    client_browser: '',
    clsduketip_gender: '',
    clsduketip_country: '',
    clsduketip_hdnSchoolCode: '',
    clsduketip_schoolname: '',
    clsduketip_assertOrNot: '',
    bonusType: '',
    clsduketip_student_type: 'ASSET',
    clsduketip_registrationyear: CONFIG.REGISTRATION_YEAR,
    clsduketip_venuedate: '',
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    ats_fees: '',
    clsduketip_genwisecourseopt: '',
    clsduketip_iplocation: 'India',
    clsduketip_issubofferactive: FEATURES.IsActiveSubjectOffer ? '1' : '0',
    
    // Country selection
    clsduketip_hdncountry: 'India',
    
    // Student information (EXACT PHP field names)
    clsduketip_panno: '',
    clsduketip_adstudentid: '',
    clsduketip_atsnominationcode: '',
    clsduketip_firstname: '',
    clsduketip_middlename: '',
    clsduketip_lastname: '',
    clsduketip_subject: ['1', '2', '3'], // Default to all subjects
    clsduketip_class: '',
    clsduketip_dob: '',
    clsduketip_section: '',
    clsduketip_full_schoolname: '',
    clsduketip_examcity1: '',
    
    // Parent information (EXACT PHP field names)
    clsduketip_parentemail: '',
    clsduketip_parentcell: '',
    clsduketip_parentstdcode: '+91',
    
    // Verification codes
    codeField: '',
    otpField: '',
    
    // Agreement
    termsAgreed: false
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [showForgotPan, setShowForgotPan] = useState(false);
  const [currentFees, setCurrentFees] = useState<{amount: number, currency: string}>({amount: 0, currency: 'INR'});
  const [showNominationCode, setShowNominationCode] = useState(false);
  const [showEstStudentId, setShowEstStudentId] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showSubjectSelection, setShowSubjectSelection] = useState(false);

  // PHP-like validation functions (EXACT match to PHP)
  const isNumberKey = (event: React.KeyboardEvent) => {
    const charCode = event.charCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  };

  const onlyAlphabets = (event: React.KeyboardEvent) => {
    const charCode = event.charCode;
    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode === 32) {
      return true;
    }
    event.preventDefault();
    return false;
  };

  const handleMobileKeyPress = (event: React.KeyboardEvent) => {
    const charCode = event.charCode;
    if ((charCode >= 48 && charCode <= 57) || event.key === 'Backspace') {
      return true;
    }
    event.preventDefault();
    return false;
  };

  // CRITICAL MISSING FUNCTIONALITY - PAN Validation and Autofill
  // Exact replica of PHP validatePAN() function from duke_tip.js
  const validatePAN = async (event: React.FocusEvent<HTMLInputElement>) => {
    const panNumber = event.target.value;
    console.log('validatePAN called');
    console.log('PAN from event:', panNumber);
    console.log('PAN from state:', formData.clsduketip_panno);
    
    if (!panNumber || panNumber.length === 0) {
      console.log('PAN is empty, skipping validation');
      return;
    }

    try {
      // Clear existing data when PAN is changed (exact same as PHP)
      setFormData(prev => ({
        ...prev,
        clsduketip_schoolname: '',
        clsduketip_full_schoolname: '',
        clsduketip_hdnSchoolCode: '',
        clsduketip_firstname: '',
        clsduketip_middlename: '',
        clsduketip_lastname: '',
        clsduketip_dob: '',
        clsduketip_address: ''
      }));

      // Call the validation API (exact same as PHP atsAjaxCall.php)
      const response = await fetch('/api/registration/validate-pan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          panNumber: panNumber,
          country: formData.clsduketip_country || 'India'
        }),
      });

      const result = await response.json();
      console.log('PAN validation result:', result);

      if (result.isAlreadyRegistered === 1) {
        // Disable form if already registered (exact same as PHP)
        setFormData(prev => ({ ...prev, panValVerified: '1' }));
        
        const year = CONFIG.REGISTRATION_YEAR;
        const country = formData.clsduketip_country || 'India';
        const email = country === 'India' ? 'eitalentsearch@ei-india.com' : 'eitalentsearch@ei-india.com';
        
        alert(`You have already registered for the ASSET Talent Search Test ${year} using the same ASSET PAN. For any queries, write to us at ${email}`);
        
        // Clear fields
        setFormData(prev => ({
          ...prev,
          clsduketip_schoolname: '',
          clsduketip_full_schoolname: '',
          clsduketip_hdnSchoolCode: '',
          clsduketip_firstname: '',
          clsduketip_middlename: '',
          clsduketip_lastname: ''
        }));

      } else if (result.isAlreadyRegistered === 0 && result.valid === '1') {
        if (result.eligible === '1') {
          // Auto-fill form with student data (exact same as PHP)
          setFormData(prev => ({
            ...prev,
            panValVerified: '0',
            clsduketip_schoolname: result.school_name || '',
            clsduketip_full_schoolname: result.school_full_name || '',
            clsduketip_hdnSchoolCode: result.school_code || '',
            clsduketip_firstname: result.firstName || '',
            clsduketip_middlename: result.middleName || '',
            clsduketip_lastname: result.lastName || '',
            clsduketip_address: result.address || '',
            clsduketip_class: result.class || '',
            clsduketip_dob: result.dob || ''
          }));

          console.log('✅ Auto-filled form with data:', {
            school_name: result.school_name,
            school_full_name: result.school_full_name,
            school_code: result.school_code,
            firstName: result.firstName,
            middleName: result.middleName,
            lastName: result.lastName,
            address: result.address,
            class: result.class,
            dob: result.dob
          });

          // If DOB is not available, calculate based on class (exact same as PHP)
          if (!result.dob || result.dob === "0000-00-00") {
            const now = new Date();
            const gradevalue = parseInt(result.class || '4');
            const increment = 5;
            const currentyear = now.getFullYear();
            const addingyear = gradevalue + increment;
            const defdobyear = currentyear - addingyear;
            const setdefdate = `${defdobyear}-01-01`;
            
            setFormData(prev => ({
              ...prev,
              clsduketip_dob: setdefdate
            }));
          }

        } else {
          // Student not eligible OR error occurred - Show detailed debug information
          setFormData(prev => ({ ...prev, panValVerified: '1' }));
          
          // Create detailed debug message
          let debugInfo = `
🔍 PAN VALIDATION DEBUG DETAILS:

📋 ENTERED PAN: ${panNumber}

🗃️ DATABASE MATCH:
- First Name: ${result.firstName || 'Not found'}
- Last Name: ${result.lastName || 'Not found'}
- Class: ${result.class || 'Not found'}
- School Code: ${result.school_code || 'Not found'}
- Programme Detail ID: ${result.programmeDetailID || 'Not found'}

🎯 ELIGIBILITY LOGIC:
- Valid: ${result.valid || '0'} (1=Valid PAN, 0=Invalid)
- Eligible: ${result.eligible || '0'} (1=Eligible, 2=Not Eligible, 0=Not Qualified)
- Already Registered: ${result.isAlreadyRegistered || 0} (1=Yes, 0=No)

📊 PROGRAMME IDS CHECK:
- Student's Programme ID: ${result.programmeDetailID || 'Not found'}
- Valid India Programme IDs: Check server logs
- Country: ${formData.clsduketip_country || 'India'}`;

          // Add error information if present
          if (result.error) {
            debugInfo += `

🚨 ERROR DETAILS:
- Error: ${result.errorMessage || 'Unknown error'}
- Debug Info: ${result.debugInfo || 'No additional info'}`;
          }

          debugInfo += `

❌ RESULT: You are not qualified for the ASSET Talent Search 2025.

Eligible Values:
• 1 = ✅ ELIGIBLE (Can register)
• 2 = ❌ NOT ELIGIBLE (Qualified but wrong programme)
• 0 = ❌ NOT QUALIFIED (Never qualified)`;
          
          alert(debugInfo.trim());
          
          // Clear fields
          setFormData(prev => ({
            ...prev,
            clsduketip_schoolname: '',
            clsduketip_full_schoolname: '',
            clsduketip_hdnSchoolCode: '',
            clsduketip_firstname: '',
            clsduketip_middlename: '',
            clsduketip_lastname: ''
          }));
        }
      } else {
        // Invalid PAN
        setFormData(prev => ({ ...prev, panValVerified: '1' }));
      }

    } catch (error) {
      console.error('PAN validation failed:', error);
      setFormData(prev => ({ ...prev, panValVerified: '1' }));
    }
  };

  // Check if registration is open
  useEffect(() => {
    // This would be an API call in real implementation
    checkRegistrationStatus();
    
    // CRITICAL: Detect country using geolocation - EXACT same as PHP commonFunctions.php
    detectUserCountry();
  }, []);
  
  const detectUserCountry = async () => {
    try {
      // ip-api without IP param returns data based on caller IP
      const geoRes = await fetch('https://pro.ip-api.com/json/?key=fU7Wvn6ZzVHNjXS');
      const geoJson = await geoRes.json();
      const detectedCountry = geoJson && geoJson.country ? geoJson.country : 'India';
      setFormData(prev => ({
        ...prev,
        clsduketip_iplocation: detectedCountry,
        clsduketip_hdncountry: detectedCountry
      }));
    } catch (error) {
      console.error('Geolocation detection failed:', error);
      // Fallback to India if geolocation fails
      setFormData(prev => ({
        ...prev,
        clsduketip_iplocation: 'India',
        clsduketip_hdncountry: 'India'
      }));
    }
  };

  // Calculate fees based on location and subjects
  useEffect(() => {
    calculateFees();
    updateFieldVisibility();
  }, [formData.clsduketip_hdncountry, formData.clsduketip_subject, formData.clsduketip_iplocation]);

  const updateFieldVisibility = () => {
    const today = new Date().toISOString().split('T')[0];
    
    // Country dropdown: only show for international users
    setShowCountryDropdown(formData.clsduketip_iplocation !== 'India');
    
    // Subject selection: only show during Phase 1 for India
    if (formData.clsduketip_iplocation === 'India') {
      setShowSubjectSelection(today <= CONFIG.ATS_INDIA_PHASE1_ENDDATE);
    } else {
      // For UAE/International, show during Phase 1
      setShowSubjectSelection(today <= CONFIG.ATS_UAE_PHASE1_ENDDATE);
    }
    
    // If subject selection is hidden, ensure all subjects are selected (default behavior after Phase 1)
    if (!showSubjectSelection && formData.clsduketip_subject.length !== 3) {
      handleInputChange('clsduketip_subject', ['1', '2', '3']);
    }
    
    // Nomination code: hidden by default, only shown for specific student types
    setShowNominationCode(false); // Always hidden unless specifically triggered
    
    // EST Student ID: hidden by default, only shown for AD students
    setShowEstStudentId(false); // Always hidden unless specifically triggered
  };

  const checkRegistrationStatus = async () => {
    try {
      // Mock implementation - would be API call
      setRegistrationOpen(true);
    } catch (error) {
      console.error('Error checking registration status:', error);
    }
  };

  const calculateFees = () => {
    const today = new Date().toISOString().split('T')[0];
    const subjectCount = formData.clsduketip_subject.length;
    let amount = 0;
    let currency = 'INR';

    if (formData.clsduketip_iplocation === 'India' && formData.clsduketip_hdncountry === 'India') {
      currency = 'INR';
      
      // Phase-based pricing
      if (today <= CONFIG.ATS_INDIA_PHASE1_ENDDATE) {
        amount = subjectCount === 3 ? CONFIG.ATS_INDIA_FEE_PHASE1 : 
                subjectCount === 2 ? CONFIG.ATS_INDIA_TWO_SUBJECTS_FEE :
                CONFIG.ATS_INDIA_ONE_SUBJECTS_FEE;
      } else if (today <= CONFIG.ATS_INDIA_PHASE2_ENDDATE) {
        amount = subjectCount === 3 ? CONFIG.ATS_INDIA_FEE_PHASE2 : 
                subjectCount === 2 ? CONFIG.ATS_INDIA_TWO_SUBJECTS_FEE :
                CONFIG.ATS_INDIA_ONE_SUBJECTS_FEE;
      } else {
        amount = subjectCount === 3 ? CONFIG.ATS_INDIA_FEE_PHASE3 : 
                subjectCount === 2 ? CONFIG.ATS_INDIA_TWO_SUBJECTS_FEE :
                CONFIG.ATS_INDIA_ONE_SUBJECTS_FEE;
      }
    } else if (formData.clsduketip_hdncountry === 'United Arab Emirates') {
      currency = 'AED';
      
      if (today <= CONFIG.ATS_UAE_PHASE1_ENDDATE) {
        amount = subjectCount === 3 ? CONFIG.ATS_UAE_FEE_PHASE1 : 
                subjectCount === 2 ? CONFIG.ATS_UAE_TWO_SUBJECTS_FEE :
                CONFIG.ATS_UAE_ONE_SUBJECTS_FEE;
      } else if (today <= CONFIG.ATS_UAE_PHASE2_ENDDATE) {
        amount = subjectCount === 3 ? CONFIG.ATS_UAE_FEE_PHASE2 : 
                subjectCount === 2 ? CONFIG.ATS_UAE_TWO_SUBJECTS_FEE :
                CONFIG.ATS_UAE_ONE_SUBJECTS_FEE;
      } else {
        amount = subjectCount === 3 ? CONFIG.ATS_UAE_FEE_PHASE3 : 
                subjectCount === 2 ? CONFIG.ATS_UAE_TWO_SUBJECTS_FEE :
                CONFIG.ATS_UAE_ONE_SUBJECTS_FEE;
      }
    } else {
      currency = '$';
      
      if (today <= CONFIG.ATS_UAE_PHASE1_ENDDATE) {
        amount = subjectCount === 3 ? CONFIG.ATS_INTERNATIONAL_FEE_PHASE1 : 
                subjectCount === 2 ? CONFIG.ATS_INTERNATIONAL_TWO_SUBJECTS_FEE :
                CONFIG.ATS_INTERNATIONAL_ONE_SUBJECTS_FEE;
      } else if (today <= CONFIG.ATS_UAE_PHASE2_ENDDATE) {
        amount = subjectCount === 3 ? CONFIG.ATS_INTERNATIONAL_FEE_PHASE2 : 
                subjectCount === 2 ? CONFIG.ATS_INTERNATIONAL_TWO_SUBJECTS_FEE :
                CONFIG.ATS_INTERNATIONAL_ONE_SUBJECTS_FEE;
      } else {
        amount = subjectCount === 3 ? CONFIG.ATS_INTERNATIONAL_FEE_PHASE3 : 
                subjectCount === 2 ? CONFIG.ATS_INTERNATIONAL_TWO_SUBJECTS_FEE :
                CONFIG.ATS_INTERNATIONAL_ONE_SUBJECTS_FEE;
      }
    }

    setCurrentFees({ amount, currency });
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubjectChange = (subjectId: string, checked: boolean) => {
    const currentSubjects = formData.clsduketip_subject;
    let newSubjects: string[];

    if (checked) {
      newSubjects = [...currentSubjects, subjectId];
    } else {
      newSubjects = currentSubjects.filter(id => id !== subjectId);
      
      // Ensure at least one subject is selected
      if (newSubjects.length === 0) {
        alert('You have to select at least one subject!');
        return;
      }
    }

    handleInputChange('clsduketip_subject', newSubjects);
  };

  const handleGenderSelect = (gender: string) => {
    handleInputChange('clsduketip_gender', gender);
  };

  const handleClassChange = (classValue: string) => {
    handleInputChange('clsduketip_class', classValue);
    
    // Auto-set default date of birth based on class (EXACT PHP logic)
    if (classValue) {
      const currentYear = new Date().getFullYear();
      const gradeValue = parseInt(classValue);
      const increment = 5;
      const addingYear = gradeValue + increment;
      const dobYear = currentYear - addingYear;
      const defaultDate = `${dobYear}-01-01`;
      handleInputChange('clsduketip_dob', defaultDate);
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Required field validations (EXACT PHP field names)
    if (!formData.clsduketip_panno && formData.clsduketip_student_type === 'ASSET') {
      newErrors.clsduketip_panno = 'ASSET PAN is required';
    }
    
    // EST Student ID is only required when the field is shown (for AD students)
    if (showEstStudentId && !formData.clsduketip_adstudentid) {
      newErrors.clsduketip_adstudentid = 'EST Student ID is required';
    }

    if (!formData.clsduketip_firstname.trim()) {
      newErrors.clsduketip_firstname = 'Student first name is required';
    }

    if (!formData.clsduketip_gender) {
      newErrors.clsduketip_gender = 'Gender is required';
    }

    // Only validate subjects if subject selection is shown
    if (showSubjectSelection && formData.clsduketip_subject.length === 0) {
      newErrors.clsduketip_subject = 'At least one subject must be selected';
    }

    if (!formData.clsduketip_class) {
      newErrors.clsduketip_class = 'Class is required';
    }

    if (!formData.clsduketip_dob) {
      newErrors.clsduketip_dob = 'Date of birth is required';
    }

    if (!formData.clsduketip_full_schoolname.trim()) {
      newErrors.clsduketip_full_schoolname = 'School name is required';
    }

    if (!formData.clsduketip_parentemail.trim()) {
      newErrors.clsduketip_parentemail = 'Parent email is required';
    }

    if (!formData.clsduketip_parentcell.trim()) {
      newErrors.clsduketip_parentcell = 'Parent mobile is required';
    }

    if (!formData.termsAgreed) {
      newErrors.termsAgreed = 'You must accept the terms and conditions';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.clsduketip_parentemail && !emailRegex.test(formData.clsduketip_parentemail)) {
      newErrors.clsduketip_parentemail = 'Please enter a valid email address';
    }

    // Mobile validation
    if (formData.clsduketip_parentcell && formData.clsduketip_parentcell.length < 10) {
      newErrors.clsduketip_parentcell = 'Please enter a valid mobile number';
    }

    // ASSET PAN validation (9 digits)
    if (formData.clsduketip_panno && !/^\d{9}$/.test(formData.clsduketip_panno)) {
      newErrors.clsduketip_panno = 'ASSET PAN must be 9 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Submit registration data first
      const response = await fetch('/api/ats-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Registration successful:', result);
        
        // Route to appropriate payment gateway based on country - EXACT same logic as PHP
        const country = formData.clsduketip_iplocation;
        const examCity1 = formData.clsduketip_examcity1;
        const paymentMode = formData.clsduketip_paymentmode;
        
        // EXACT same conditions as PHP asset_talent_search_order.php lines 37 & 214
        const isSpecialDubaiCity = examCity1 === "9" || examCity1 === "50" || examCity1 === "138"; // Dubai & Sharjah & Ajman
        const shouldUseBillDesk = (country === 'India' && paymentMode === "online" && !isSpecialDubaiCity);
        
        if (shouldUseBillDesk) {
          // Use BillDesk flow for India online payments (excluding special Dubai cities)
          window.location.href = `/api/payment/billdesk/initiate?orderID=${result.orderID}`;
        } else if (country === 'United Arab Emirates' || isSpecialDubaiCity) {
          // Use CCAvenue UAE flow
          const ccavenueResponse = await fetch('/api/payment/ccavenue/initiate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderID: result.orderID }),
          });
          
          if (ccavenueResponse.ok) {
            const ccavenueData = await ccavenueResponse.json();
            
            // Create and submit CCAvenue form - EXACT same as PHP
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = ccavenueData.action;
            
            const encRequestInput = document.createElement('input');
            encRequestInput.type = 'hidden';
            encRequestInput.name = 'encRequest';
            encRequestInput.value = ccavenueData.encRequest;
            form.appendChild(encRequestInput);
            
            const accessCodeInput = document.createElement('input');
            accessCodeInput.type = 'hidden';
            accessCodeInput.name = 'access_code';
            accessCodeInput.value = ccavenueData.access_code;
            form.appendChild(accessCodeInput);
            
            document.body.appendChild(form);
            form.submit();
          } else {
            throw new Error('CCAvenue initiation failed');
          }
        } else {
          // Use CCAvenue International flow (same as UAE but different config)
          const ccavenueResponse = await fetch('/api/payment/ccavenue/initiate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderID: result.orderID }),
          });
          
          if (ccavenueResponse.ok) {
            const ccavenueData = await ccavenueResponse.json();
            
            // Create and submit CCAvenue form for international
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = ccavenueData.action;
            
            const encRequestInput = document.createElement('input');
            encRequestInput.type = 'hidden';
            encRequestInput.name = 'encRequest';
            encRequestInput.value = ccavenueData.encRequest;
            form.appendChild(encRequestInput);
            
            const accessCodeInput = document.createElement('input');
            accessCodeInput.type = 'hidden';
            accessCodeInput.name = 'access_code';
            accessCodeInput.value = ccavenueData.access_code;
            form.appendChild(accessCodeInput);
            
            document.body.appendChild(form);
            form.submit();
          } else {
            throw new Error('CCAvenue initiation failed');
          }
        }
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!registrationOpen) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="text-center p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Registration Closed
            </h1>
            <p className="text-gray-600 mb-4">
              Sorry, the registrations for current year is closed. We will be back soon for next year registrations.
            </p>
            <p className="text-gray-600">
              For any queries do write us at{' '}
              <a href="mailto:eitalentsearch@ei.study" className="text-blue-600 hover:underline">
                eitalentsearch@ei.study
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Take your first step towards discovering your child's true potential
          </h1>
          <h2 className="text-xl font-medium text-gray-700 mb-2">
            Ei ASSET Talent Search (Ei ATS) Test Registration Form: {CONFIG.ACADEMIC_YEAR} (India)
          </h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-700">
            <p className="mb-2">
              Congratulations! You are here because you are in the <span className="text-red-600 font-semibold">top 15%</span> of your class nationwide! 
              Take the Ei ASSET Talent Search (ATS) to see if you can join <span className="text-red-600 font-semibold">a global community of gifted learners</span> and get mentored by the world's best and finest.
            </p>
            <p className="mb-2">
              Ei ATS assesses students' understanding of advanced concepts in their regular school subjects. The top 2% students nationwise gain access to an exclusive network of global gifted students and talent nurturing programmes from globally acclaimed institutions like John Hopkins Centre for Talented Youth, Purdue University, Northwestern University's Centre for Talent Development and others.
            </p>
            <p className="mb-2">
              Ei ATS invites students who have scored over 85 percentile in Ei ASSET test in English, Maths OR Science. Use your Ei ASSET PAN from the Student MyBook cover to register.
            </p>
            <p className="font-semibold">
              <strong>Important Dates for Ei ATS (India):</strong><br />
              Registration closes: November 22, 2025<br />
              Test dates: November 28, 2025 to December 01, 2025
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Registration Form
              <Badge variant="outline" className="text-lg px-4 py-2">
                Fee: {currentFees.currency} {currentFees.amount}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
              {/* Hidden fields (EXACT PHP hidden fields) */}
              <input type="hidden" name="mobileVerified" value={formData.mobileVerified} />
              <input type="hidden" name="panValVerified" value={formData.panValVerified} />
              <input type="hidden" name="emailVerified" value={formData.emailVerified} />
              <input type="hidden" name="clsduketip_hdnaction" value={formData.clsduketip_hdnaction} />
              <input type="hidden" name="clsduketip_paymentmode" value={formData.clsduketip_paymentmode} />
              <input type="hidden" name="clsduketip_refundagreement" value={formData.clsduketip_refundagreement} />
              <input type="hidden" name="clsduketip_whatsapp_update" value={formData.clsduketip_whatsapp_update} />
              <input type="hidden" name="client_browser" value={formData.client_browser} />
              <input type="hidden" name="clsduketip_gender" value={formData.clsduketip_gender} />
              <input type="hidden" name="clsduketip_country" value={formData.clsduketip_country} />
              <input type="hidden" name="clsduketip_hdnSchoolCode" value={formData.clsduketip_hdnSchoolCode} />
              <input type="hidden" name="clsduketip_schoolname" value={formData.clsduketip_schoolname} />
              <input type="hidden" name="clsduketip_assertOrNot" value={formData.clsduketip_assertOrNot} />
              <input type="hidden" name="bonusType" value={formData.bonusType} />
              <input type="hidden" name="clsduketip_student_type" value={formData.clsduketip_student_type} />
              <input type="hidden" name="clsduketip_registrationyear" value={formData.clsduketip_registrationyear} />
              <input type="hidden" name="clsduketip_venuedate" value={formData.clsduketip_venuedate} />
              <input type="hidden" name="utm_source" value={formData.utm_source} />
              <input type="hidden" name="utm_medium" value={formData.utm_medium} />
              <input type="hidden" name="utm_campaign" value={formData.utm_campaign} />
              <input type="hidden" name="ats_fees" value={formData.ats_fees} />
              <input type="hidden" name="clsduketip_genwisecourseopt" value={formData.clsduketip_genwisecourseopt} />
              <input type="hidden" name="clsduketip_iplocation" value={formData.clsduketip_iplocation} />
              <input type="hidden" name="clsduketip_issubofferactive" value={formData.clsduketip_issubofferactive} />
              {/* Country Selection (only for international students, hidden by default) */}
              {showCountryDropdown && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="country">
                      <span className="text-red-500">*</span> Country
                    </Label>
                                      <Select 
                    value={formData.clsduketip_hdncountry} 
                    onValueChange={(value) => handleInputChange('clsduketip_hdncountry', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map(country => (
                          <SelectItem key={country.code} value={country.name}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.clsduketip_hdncountry && <p className="text-red-500 text-sm mt-1">{errors.clsduketip_hdncountry}</p>}
                  </div>
                </div>
              )}

              {/* ASSET PAN */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="assetPan">
                    <span className="text-red-500">*</span> ASSET PAN
                  </Label>
                  <Input
                    id="clsduketip_panno"
                    name="clsduketip_panno"
                    type="text"
                    value={formData.clsduketip_panno}
                    onChange={(e) => handleInputChange('clsduketip_panno', e.target.value)}
                    onBlur={(e) => validatePAN(e)}
                    onKeyPress={isNumberKey}
                    placeholder="ASSET PAN"
                    maxLength={9}
                    autoComplete="off"
                    className={errors.clsduketip_panno ? 'border-red-500' : ''}
                    required
                  />
                  {errors.clsduketip_panno && <p className="text-red-500 text-sm mt-1">{errors.clsduketip_panno}</p>}
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForgotPan(!showForgotPan)}
                    className="mb-1"
                  >
                    Forgot ASSET PAN
                  </Button>
                </div>
              </div>

              {/* Forgot PAN Information */}
              <Collapsible open={showForgotPan} onOpenChange={setShowForgotPan}>
                <CollapsibleContent className="space-y-4">
                  <div className="bg-gray-50 border rounded-lg p-4">
                    <p className="text-sm text-gray-700 mb-2">
                      1. You can find your ASSET PAN on the cover of your ASSET Student Mybook (Report).
                    </p>
                    <img 
                      src="/media/pan_number.png" 
                      alt="ASSET PAN Location" 
                      className="max-w-md mx-auto rounded-lg shadow-sm"
                    />
                    <p className="text-sm text-gray-700 mt-2">
                      If you don't have your ASSET Student Mybook (Report), please contact us.
                    </p>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Nomination Code (hidden by default, only shown for nomination students) */}
              {FEATURES.EnableNominationCode && showNominationCode && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nominationCode">
                      <span className="text-red-500">*</span> Nomination Code
                    </Label>
                    <Input
                      id="nominationCode"
                      type="text"
                                          value={formData.clsduketip_atsnominationcode}
                    onChange={(e) => handleInputChange('clsduketip_atsnominationcode', e.target.value)}
                      placeholder="Enter Nomination Code"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button type="button" variant="outline" className="mb-1">
                      Verify Code!
                    </Button>
                  </div>
                </div>
              )}

              {/* Student Name */}
              <div className="space-y-2">
                <Label>
                  <span className="text-red-500">*</span> Student Name
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    id="clsduketip_firstname"
                    name="clsduketip_firstname"
                    placeholder="Student First Name"
                    value={formData.clsduketip_firstname}
                    onChange={(e) => handleInputChange('clsduketip_firstname', e.target.value)}
                    onKeyPress={onlyAlphabets}
                    autoComplete="off"
                    required
                    className={errors.clsduketip_firstname ? 'border-red-500' : ''}
                  />
                  <Input
                    id="clsduketip_middlename"
                    name="clsduketip_middlename"
                    placeholder="Student Middle Name"
                    value={formData.clsduketip_middlename}
                    onChange={(e) => handleInputChange('clsduketip_middlename', e.target.value)}
                    onKeyPress={onlyAlphabets}
                    autoComplete="off"
                  />
                  <Input
                    id="clsduketip_lastname"
                    name="clsduketip_lastname"
                    placeholder="Student Last Name"
                    value={formData.clsduketip_lastname}
                    onChange={(e) => handleInputChange('clsduketip_lastname', e.target.value)}
                    onKeyPress={onlyAlphabets}
                    autoComplete="off"
                  />
                </div>
                <p className="text-red-500 text-xs">
                  (Double-check your name, make sure that your name is written correctly, and update if necessary. The name that will appear on the certificate is the name you have written here.)
                </p>
                {errors.clsduketip_firstname && <p className="text-red-500 text-sm">{errors.clsduketip_firstname}</p>}
              </div>

              {/* Gender (EXACT PHP radioBoxGender behavior) */}
              <div className="space-y-2">
                <Label>
                  <span className="text-red-500">*</span> Gender
                </Label>
                <div className="flex gap-6">
                  {/* Male Option - EXACT PHP structure */}
                  <div className="flex items-center space-x-2 cursor-pointer">
                    <span>Male</span>
                    <span 
                      id="M"
                      className="radioBoxGender w-5 h-5 border-2 border-gray-400 bg-white cursor-pointer flex items-center justify-center"
                      onClick={() => {
                        // EXACT PHP behavior: clear all, set selected
                        const allGenderBoxes = document.querySelectorAll('.radioBoxGender');
                        allGenderBoxes.forEach(box => box.innerHTML = '');
                        
                        const clickedBox = document.getElementById('M');
                        if (clickedBox) {
                          clickedBox.innerHTML = '<div class="radioClone w-3 h-3 bg-blue-600 rounded-full"></div>';
                        }
                        
                        handleGenderSelect('M');
                      }}
                      dangerouslySetInnerHTML={{
                        __html: formData.clsduketip_gender === 'M' ? '<div class="radioClone w-3 h-3 bg-blue-600 rounded-full"></div>' : ''
                      }}
                    />
                  </div>
                  
                  {/* Female Option - EXACT PHP structure */}
                  <div className="flex items-center space-x-2 cursor-pointer">
                    <span>Female</span>
                    <span 
                      id="F"
                      className="radioBoxGender w-5 h-5 border-2 border-gray-400 bg-white cursor-pointer flex items-center justify-center"
                      onClick={() => {
                        // EXACT PHP behavior: clear all, set selected
                        const allGenderBoxes = document.querySelectorAll('.radioBoxGender');
                        allGenderBoxes.forEach(box => box.innerHTML = '');
                        
                        const clickedBox = document.getElementById('F');
                        if (clickedBox) {
                          clickedBox.innerHTML = '<div class="radioClone w-3 h-3 bg-blue-600 rounded-full"></div>';
                        }
                        
                        handleGenderSelect('F');
                      }}
                      dangerouslySetInnerHTML={{
                        __html: formData.clsduketip_gender === 'F' ? '<div class="radioClone w-3 h-3 bg-blue-600 rounded-full"></div>' : ''
                      }}
                    />
                  </div>
                </div>
                {errors.clsduketip_gender && <p className="text-red-500 text-sm">{errors.clsduketip_gender}</p>}
              </div>

              {/* Subjects (only shown during Phase 1) */}
              {FEATURES.IsActiveSubjectOffer ? (
                showSubjectSelection ? (
                  <div className="space-y-2">
                    <Label>
                      <span className="text-red-500">*</span> Subject(s)
                    </Label>
                    <div className="flex flex-wrap gap-6">
                      <label className="flex items-center space-x-2">
                        <Checkbox
                          id="english"
                          name="clsduketip_subject[]"
                          value="1"
                          checked={formData.clsduketip_subject.includes('1')}
                          onCheckedChange={(checked) => handleSubjectChange('1', checked as boolean)}
                        />
                        <span>English</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <Checkbox
                          id="maths"
                          name="clsduketip_subject[]"
                          value="2"
                          checked={formData.clsduketip_subject.includes('2')}
                          onCheckedChange={(checked) => handleSubjectChange('2', checked as boolean)}
                        />
                        <span>Maths</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <Checkbox
                          id="science"
                          name="clsduketip_subject[]"
                          value="3"
                          checked={formData.clsduketip_subject.includes('3')}
                          onCheckedChange={(checked) => handleSubjectChange('3', checked as boolean)}
                        />
                        <span>Science</span>
                      </label>
                    </div>
                    {errors.clsduketip_subject && <p className="text-red-500 text-sm">{errors.clsduketip_subject}</p>}
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      Subject selection is no longer available. All three subjects (English, Mathematics, Science) are automatically selected for Phase 2 and Phase 3 registrations.
                    </p>
                  </div>
                )
              ) : null}

              {/* Class */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="class">
                    <span className="text-red-500">*</span> Class
                  </Label>
                  <Select value={formData.clsduketip_class} onValueChange={handleClassChange}>
                    <SelectTrigger className={errors.clsduketip_class ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="6">6</SelectItem>
                      <SelectItem value="7">7</SelectItem>
                      <SelectItem value="8">8</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-red-500 text-xs mt-1">
                    [Select the class that the student will be in as of November 2025.]
                  </p>
                  {errors.clsduketip_class && <p className="text-red-500 text-sm">{errors.clsduketip_class}</p>}
                </div>
              </div>

              {/* Date of Birth */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dateOfBirth">
                    <span className="text-red-500">*</span> Date Of Birth
                  </Label>
                  <Input
                    id="clsduketip_dob"
                    name="clsduketip_dob"
                    type="date"
                    value={formData.clsduketip_dob}
                    onChange={(e) => handleInputChange('clsduketip_dob', e.target.value)}
                    max="2050-12-31"
                    className={errors.clsduketip_dob ? 'border-red-500' : ''}
                  />
                  {errors.clsduketip_dob && <p className="text-red-500 text-sm mt-1">{errors.clsduketip_dob}</p>}
                </div>
              </div>

              {/* Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clsduketip_section">Section</Label>
                  <Input
                    id="clsduketip_section"
                    name="clsduketip_section"
                    type="text"
                    value={formData.clsduketip_section}
                    onChange={(e) => handleInputChange('clsduketip_section', e.target.value)}
                    placeholder="Section"
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* School Name */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="fullSchoolName">
                    <span className="text-red-500">*</span> School Name
                  </Label>
                  <Input
                    id="fullSchoolName"
                    type="text"
                    value={formData.clsduketip_full_schoolname}
                    onChange={(e) => handleInputChange('clsduketip_full_schoolname', e.target.value)}
                    placeholder="School Name"
                    className={errors.fullSchoolName ? 'border-red-500' : ''}
                  />
                  <div className="flex items-center text-sm text-blue-600 mt-1">
                    <Info size={16} className="mr-1" />
                    <span>I have changed my school</span>
                  </div>
                  {errors.fullSchoolName && <p className="text-red-500 text-sm mt-1">{errors.fullSchoolName}</p>}
                </div>
              </div>

              {/* Parent Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="parentEmail">
                    <span className="text-red-500">*</span> Parent Email
                  </Label>
                  <Input
                    id="clsduketip_parentemail"
                    name="clsduketip_parentemail"
                    type="email"
                    value={formData.clsduketip_parentemail}
                    onChange={(e) => handleInputChange('clsduketip_parentemail', e.target.value)}
                    placeholder="Parent Email"
                    autoComplete="off"
                    required
                    className={errors.clsduketip_parentemail ? 'border-red-500' : ''}
                  />
                  {errors.clsduketip_parentemail && <p className="text-red-500 text-sm mt-1">{errors.clsduketip_parentemail}</p>}
                </div>
                {FEATURES.EnableEmailVerification && (
                  <div className="flex items-end">
                    <Button type="button" variant="outline" className="mb-1">
                      Verify Email
                    </Button>
                  </div>
                )}
              </div>

              {/* Email Verification Code */}
              {FEATURES.EnableEmailVerification && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emailCode">Code</Label>
                    <Input
                      id="emailCode"
                      type="text"
                                          value={formData.codeField}
                    onChange={(e) => handleInputChange('codeField', e.target.value)}
                      placeholder="Code"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button type="button" variant="outline" className="mb-1">
                      Verify Code
                    </Button>
                  </div>
                </div>
              )}

              {/* Parent Mobile (International Phone - EXACT intlTelInput behavior) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clsduketip_parentcell">
                    <span className="text-red-500">*</span> Parent Mobile
                  </Label>
                  {/* International Phone Input - EXACT PHP intlTelInput behavior */}
                  <div className="flex">
                    <Select 
                      value={formData.clsduketip_iplocation === 'India' ? 'in' : 'ae'} 
                      onValueChange={(value) => {
                        // Update country code when country changes (EXACT PHP behavior)
                        const countryCode = value === 'in' ? '+91' : value === 'ae' ? '+971' : '+1';
                        handleInputChange('clsduketip_parentstdcode', countryCode);
                      }}
                    >
                      <SelectTrigger className="w-20 rounded-r-none">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in">🇮🇳 +91</SelectItem>
                        <SelectItem value="ae">🇦🇪 +971</SelectItem>
                        <SelectItem value="us">🇺🇸 +1</SelectItem>
                        <SelectItem value="gb">🇬🇧 +44</SelectItem>
                        <SelectItem value="ca">🇨🇦 +1</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      id="clsduketip_parentcell"
                      name="clsduketip_parentcell"
                      type="tel"
                      value={formData.clsduketip_parentcell}
                      onChange={(e) => handleInputChange('clsduketip_parentcell', e.target.value)}
                      onKeyPress={handleMobileKeyPress}
                      placeholder="Parent Mobile"
                      maxLength={10}
                      autoComplete="off"
                      required
                      className={`rounded-l-none ${errors.clsduketip_parentcell ? 'border-red-500' : ''}`}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    (Please do not enter the country code or '0' before the number.)
                  </p>
                  {errors.clsduketip_parentcell && <p className="text-red-500 text-sm mt-1">{errors.clsduketip_parentcell}</p>}
                  
                  {/* Hidden field for country code (EXACT PHP behavior) */}
                  <input 
                    type="hidden" 
                    id="clsduketip_parentstdcode_hidden"
                    name="clsduketip_parentstdcode" 
                    value={formData.clsduketip_parentstdcode} 
                  />
                </div>
                {FEATURES.EnableMobileVerification && (
                  <div className="flex items-end">
                    <Button type="button" variant="outline" className="mb-1">
                      Verify Mobile
                    </Button>
                  </div>
                )}
              </div>

              {/* Mobile OTP */}
              {FEATURES.EnableMobileVerification && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mobileOtp">OTP</Label>
                    <Input
                      id="mobileOtp"
                      type="text"
                                          value={formData.otpField}
                    onChange={(e) => handleInputChange('otpField', e.target.value)}
                      placeholder="OTP"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button type="button" variant="outline" className="mb-1">
                      Verify OTP
                    </Button>
                  </div>
                </div>
              )}

              {/* Promo Code - DISABLED in PHP version, so removing entirely */}

              {/* Mandatory Fields Info */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>All fields marked with (*) are mandatory.</strong>
                </AlertDescription>
              </Alert>

              {/* Terms and Conditions (EXACT PHP checkBox_agree behavior) */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  {/* Custom checkbox - EXACT PHP structure */}
                  <span 
                    id="agree"
                    className="checkBox_agree w-5 h-5 border-2 border-gray-400 bg-white cursor-pointer flex items-center justify-center text-green-600 font-bold text-sm"
                    onClick={() => {
                      // EXACT PHP behavior: toggle checkmark and hidden field
                      const checkBox = document.getElementById('agree');
                      const currentContent = checkBox?.innerHTML || '';
                      const isEmpty = currentContent === '';
                      
                      if (!isEmpty) {
                        // Currently checked, uncheck it
                        checkBox!.innerHTML = '';
                        handleInputChange('clsduketip_refundagreement', '');
                        handleInputChange('termsAgreed', false);
                      } else {
                        // Currently unchecked, check it
                        checkBox!.innerHTML = '&#10004;'; // EXACT PHP: &#10004;
                        handleInputChange('clsduketip_refundagreement', 'agree'); // EXACT PHP: value = id
                        handleInputChange('termsAgreed', true);
                      }
                    }}
                    dangerouslySetInnerHTML={{
                      __html: formData.termsAgreed ? '&#10004;' : ''
                    }}
                  />
                  
                  {/* Label text - EXACT PHP structure */}
                  <div className="text-sm leading-relaxed cursor-pointer" onClick={() => {
                    // Allow clicking on text to toggle checkbox (PHP behavior)
                    document.getElementById('agree')?.click();
                  }}>
                    <span className="text-red-500">*</span>&nbsp;I accept registration{' '}
                    <a 
                      href="/terms" 
                      target="_blank" 
                      className="text-blue-600 underline"
                      onClick={(e) => e.stopPropagation()} // Prevent checkbox toggle when clicking links
                    >
                      terms, conditions
                    </a>{' '}
                    and{' '}
                    <a 
                      href="/refund" 
                      target="_blank" 
                      className="text-blue-600 underline"
                      onClick={(e) => e.stopPropagation()} // Prevent checkbox toggle when clicking links
                    >
                      refund policy
                    </a>.
                  </div>
                </div>
                {errors.termsAgreed && <p className="text-red-500 text-sm">{errors.termsAgreed}</p>}
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full md:w-auto px-12 py-3 text-lg font-semibold"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}