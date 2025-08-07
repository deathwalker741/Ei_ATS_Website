import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Configuration matching PHP constants (EXACT VALUES)
const CONFIG = {
  REGISTRATION_YEAR: '2025',
  ATS_INDIA_PHASE1_ENDDATE: '2025-02-28',
  ATS_INDIA_PHASE2_ENDDATE: '2025-03-31',
  ATS_INDIA_PHASE3_ENDDATE: '2025-04-30',
  ATS_UAE_PHASE1_ENDDATE: '2025-02-28',
  ATS_UAE_PHASE2_ENDDATE: '2025-03-31',
  ATS_UAE_PHASE3_ENDDATE: '2025-04-30',
  ATS_INTERNATIONAL_PHASE1_ENDDATE: '2025-02-28',
  ATS_INTERNATIONAL_PHASE2_ENDDATE: '2025-03-31',
  ATS_INTERNATIONAL_PHASE3_ENDDATE: '2025-04-30',
  
  // Fee constants (EXACT PHP VALUES)
  ATS_INDIA_FEE_PHASE1: 2500,
  ATS_INDIA_FEE_PHASE2: 2700,
  ATS_INDIA_FEE_PHASE3: 3300,
  ATS_INDIA_TWO_SUBJECTS_FEE: 2200,
  ATS_INDIA_ONE_SUBJECTS_FEE: 1700,
  
  ATS_UAE_FEE_PHASE1: 250,
  ATS_UAE_FEE_PHASE2: 250,
  ATS_UAE_FEE_PHASE3: 300,
  ATS_UAE_TWO_SUBJECTS_FEE: 210,
  ATS_UAE_ONE_SUBJECTS_FEE: 170,
  
  ATS_INTERNATIONAL_FEE_PHASE1: 70,
  ATS_INTERNATIONAL_FEE_PHASE2: 70,
  ATS_INTERNATIONAL_FEE_PHASE3: 80,
  ATS_INTERNATIONAL_TWO_SUBJECTS_FEE: 60,
  ATS_INTERNATIONAL_ONE_SUBJECTS_FEE: 50,
};

const registrationSchema = z.object({
  // Hidden fields (EXACT PHP field names)
  mobileVerified: z.string(),
  panValVerified: z.string(),
  emailVerified: z.string(),
  clsduketip_hdnaction: z.string(),
  clsduketip_paymentmode: z.string(),
  clsduketip_refundagreement: z.string(),
  clsduketip_whatsapp_update: z.string(),
  client_browser: z.string(),
  clsduketip_gender: z.string().min(1, 'Gender is required'),
  clsduketip_country: z.string(),
  clsduketip_hdnSchoolCode: z.string(),
  clsduketip_schoolname: z.string(),
  clsduketip_assertOrNot: z.string(),
  bonusType: z.string(),
  clsduketip_student_type: z.string(),
  clsduketip_registrationyear: z.string(),
  clsduketip_venuedate: z.string(),
  utm_source: z.string(),
  utm_medium: z.string(),
  utm_campaign: z.string(),
  ats_fees: z.string(),
  clsduketip_genwisecourseopt: z.string(),
  clsduketip_iplocation: z.string(),
  clsduketip_issubofferactive: z.string(),
  
  // Country selection (PHP field names)
  clsduketip_hdncountry: z.string(),
  
  // Student information (EXACT PHP field names)
  clsduketip_panno: z.string().regex(/^\d{9}$/, 'ASSET PAN must be 9 digits').optional(),
  clsduketip_adstudentid: z.string().optional(),
  clsduketip_atsnominationcode: z.string().optional(),
  clsduketip_firstname: z.string().min(1, 'First name is required'),
  clsduketip_middlename: z.string().optional(),
  clsduketip_lastname: z.string().optional(),
  clsduketip_subject: z.array(z.string()).min(1, 'At least one subject must be selected'),
  clsduketip_class: z.string().min(1, 'Class is required'),
  clsduketip_dob: z.string().min(1, 'Date of birth is required'),
  clsduketip_section: z.string().optional(),
  clsduketip_full_schoolname: z.string().min(1, 'School name is required'),
  
  // Parent information (EXACT PHP field names)
  clsduketip_parentemail: z.string().email('Invalid email address'),
  clsduketip_parentcell: z.string().min(10, 'Valid mobile number required'),
  clsduketip_parentstdcode: z.string(),
  
  // Verification codes (EXACT PHP field names)
  codeField: z.string().optional(),
  otpField: z.string().optional(),
  
  // Agreement (internal field)
  termsAgreed: z.boolean().refine(val => val === true, 'You must accept terms and conditions')
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received registration data:', body);

    // Validate the request body
    const data = registrationSchema.parse(body);

    // Calculate fees based on location and phase (EXACT PHP logic)
    const calculateFees = (data: any) => {
      const today = new Date().toISOString().split('T')[0];
      const subjectCount = data.clsduketip_subject?.length || 3;
      let amount = 0;
      let currency = 'INR';

      if (data.clsduketip_iplocation === 'India' && data.clsduketip_hdncountry === 'India') {
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
      } else if (data.clsduketip_hdncountry === 'United Arab Emirates') {
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
        // International pricing
        currency = 'USD';
        
        if (today <= CONFIG.ATS_INTERNATIONAL_PHASE1_ENDDATE) {
          amount = subjectCount === 3 ? CONFIG.ATS_INTERNATIONAL_FEE_PHASE1 : 
                  subjectCount === 2 ? CONFIG.ATS_INTERNATIONAL_TWO_SUBJECTS_FEE :
                  CONFIG.ATS_INTERNATIONAL_ONE_SUBJECTS_FEE;
        } else if (today <= CONFIG.ATS_INTERNATIONAL_PHASE2_ENDDATE) {
          amount = subjectCount === 3 ? CONFIG.ATS_INTERNATIONAL_FEE_PHASE2 : 
                  subjectCount === 2 ? CONFIG.ATS_INTERNATIONAL_TWO_SUBJECTS_FEE :
                  CONFIG.ATS_INTERNATIONAL_ONE_SUBJECTS_FEE;
        } else {
          amount = subjectCount === 3 ? CONFIG.ATS_INTERNATIONAL_FEE_PHASE3 : 
                  subjectCount === 2 ? CONFIG.ATS_INTERNATIONAL_TWO_SUBJECTS_FEE :
                  CONFIG.ATS_INTERNATIONAL_ONE_SUBJECTS_FEE;
        }
      }

      return { amount, currency };
    };

    const fees = calculateFees(data);

    console.log('Processing ATS registration for:', data.clsduketip_firstname, data.clsduketip_lastname);
    console.log('Selected subjects:', data.clsduketip_subject);
    console.log('Calculated fees:', fees);

    // TODO: Process registration (database save, payment gateway integration, email notifications)
    // This would involve:
    // 1. Save to database (same tables as PHP version)
    // 2. Process payment through gateway
    // 3. Send confirmation emails
    // 4. Generate registration ID

    // For now, return success response with registration details
    const registrationId = `ATS${Date.now()}`;

    return NextResponse.json({
      success: true,
      message: 'Registration submitted successfully',
      data: {
        registrationId,
        studentName: `${data.clsduketip_firstname} ${data.clsduketip_middlename || ''} ${data.clsduketip_lastname || ''}`.trim(),
        subjects: data.clsduketip_subject,
        fees,
        parentEmail: data.clsduketip_parentemail,
        location: data.clsduketip_hdncountry,
        submittedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        errors: error.errors
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}