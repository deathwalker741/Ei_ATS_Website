import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { ClsDuketip } from '@/lib/classes/eiduketip';

// CRITICAL MISSING FUNCTIONALITY - PAN Validation and Autofill
// This endpoint replicates atsAjaxCall.php operation 'getSchoolDetailsByPan'
// Used for auto-filling student data when PAN is entered

export async function POST(request: NextRequest) {
  try {
    const { panNumber, country } = await request.json();
    console.log('PAN validation API called with:', { panNumber, country });

    if (!panNumber) {
      console.log('PAN number is missing');
      return NextResponse.json({ error: 'PAN number is required' }, { status: 400 });
    }

    // Create instance and set PAN number (exact same as PHP)
    const clsduketip = new ClsDuketip();
    clsduketip.panNumber = panNumber;
    clsduketip.country = country || 'India';

    // Call the exact same method as PHP
    const schoolDetails = await clsduketip.getSchoolDetailsByPanAjax();
    console.log('School details result:', schoolDetails);

    return NextResponse.json(schoolDetails);

  } catch (error) {
    console.error('PAN validation error:', error);
    return NextResponse.json({ 
      error: 'Failed to validate PAN',
      valid: '0',
      eligible: '0'
    }, { status: 500 });
  }
}