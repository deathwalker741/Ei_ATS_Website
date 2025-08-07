import { NextRequest, NextResponse } from 'next/server';

// Mock OTP storage (should match the one in send-otp)
// In production, use Redis or database
const otpStorage = new Map<string, { otp: string; expires: number; type: 'mobile' | 'email' }>();

export async function POST(request: NextRequest) {
  try {
    const { mobile, email, otp, type } = await request.json();
    
    if (type !== 'mobile' && type !== 'email') {
      return NextResponse.json(
        { success: false, error: 'Invalid OTP type' },
        { status: 400 }
      );
    }
    
    if (!otp) {
      return NextResponse.json(
        { success: false, error: 'OTP is required' },
        { status: 400 }
      );
    }
    
    const key = type === 'mobile' ? mobile : email;
    
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
    
    // Get stored OTP
    const storedOtpData = otpStorage.get(key);
    
    if (!storedOtpData) {
      return NextResponse.json(
        { success: false, error: 'No OTP found. Please request a new OTP.' },
        { status: 400 }
      );
    }
    
    // Check expiry
    if (Date.now() > storedOtpData.expires) {
      otpStorage.delete(key); // Clean up expired OTP
      return NextResponse.json(
        { success: false, error: 'OTP has expired. Please request a new OTP.' },
        { status: 400 }
      );
    }
    
    // Verify OTP
    if (storedOtpData.otp !== otp.toString()) {
      return NextResponse.json(
        { success: false, error: 'Invalid OTP. Please check and try again.' },
        { status: 400 }
      );
    }
    
    // Verify type matches
    if (storedOtpData.type !== type) {
      return NextResponse.json(
        { success: false, error: 'OTP type mismatch' },
        { status: 400 }
      );
    }
    
    // OTP verified successfully, remove from storage
    otpStorage.delete(key);
    
    return NextResponse.json({
      success: true,
      message: `${type === 'mobile' ? 'Mobile' : 'Email'} verified successfully`,
      verified: true
    });
    
  } catch (error) {
    console.error('Verify OTP API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}