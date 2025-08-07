import { NextRequest, NextResponse } from 'next/server';

// Mock OTP storage (in production, use Redis or database)
const otpStorage = new Map<string, { otp: string; expires: number; type: 'mobile' | 'email' }>();

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Mock SMS sending function
async function sendSMS(mobile: string, otp: string): Promise<boolean> {
  // In production, integrate with SMS provider like Twilio, AWS SNS, etc.
  console.log(`Sending SMS to ${mobile}: Your ATS registration OTP is ${otp}. Valid for 10 minutes.`);
  
  // Mock success response
  return true;
}

// Mock email sending function  
async function sendEmail(email: string, otp: string): Promise<boolean> {
  // In production, integrate with email service like AWS SES, SendGrid, etc.
  console.log(`Sending email to ${email}: Your ATS registration OTP is ${otp}. Valid for 10 minutes.`);
  
  // Mock success response
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const { mobile, email, type } = await request.json();
    
    if (type !== 'mobile' && type !== 'email') {
      return NextResponse.json(
        { success: false, error: 'Invalid OTP type' },
        { status: 400 }
      );
    }
    
    if (type === 'mobile' && !mobile) {
      return NextResponse.json(
        { success: false, error: 'Mobile number is required' },
        { status: 400 }
      );
    }
    
    if (type === 'email' && !email) {
      return NextResponse.json(
        { success: false, error: 'Email address is required' },
        { status: 400 }
      );
    }
    
    // Generate OTP
    const otp = generateOTP();
    const expires = Date.now() + (10 * 60 * 1000); // 10 minutes
    
    const key = type === 'mobile' ? mobile : email;
    
    // Store OTP
    otpStorage.set(key, { otp, expires, type });
    
    // Send OTP
    let sent = false;
    if (type === 'mobile') {
      sent = await sendSMS(mobile, otp);
    } else {
      sent = await sendEmail(email, otp);
    }
    
    if (!sent) {
      return NextResponse.json(
        { success: false, error: `Failed to send OTP via ${type}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: `OTP sent successfully to your ${type}`,
      expiresIn: 600 // 10 minutes in seconds
    });
    
  } catch (error) {
    console.error('Send OTP API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}