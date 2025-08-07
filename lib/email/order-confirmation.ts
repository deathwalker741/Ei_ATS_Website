// Email order confirmation - EXACT same logic as PHP sendEmailOrderConfirm
import { getRegistrationDetails } from '@/lib/database/payment-operations';
import { sendAWSEmail } from '@/lib/email/aws-ses';
import { generateOrderConfirmationTemplate } from '@/lib/email/templates/order-confirmation';

/**
 * Send order confirmation email
 * Equivalent to PHP function sendEmailOrderConfirm (lines 293-396)
 */
export async function sendEmailOrderConfirm(
  orderID: string,
  orderSite: string
): Promise<void> {
  try {
    // Subject array (equivalent to PHP line 296)
    const subjectArray: { [key: number]: string } = {
      1: "English",
      2: "Maths", 
      3: "Science"
    };
    
    // Email configuration (equivalent to PHP lines 297-298)
    const duketipemail = 'eitalentsearch@ei.study';
    
    // Current year and academic year (equivalent to PHP lines 299-300)
    const currentYear = process.env.ATS_INDIA_REGISTERATION_YEAR || '2025';
    const academicYear = `${currentYear}-${(parseInt(currentYear) + 1).toString().slice(-2)}`;
    
    // Get registration details (equivalent to PHP lines 303-313)
    const registrationData = await getRegistrationDetails(orderID);
    
    if (!registrationData) {
      console.error('No registration data found for orderID:', orderID);
      return;
    }
    
    const to = registrationData.parentEmail;
    
    // Calculate amount display (equivalent to PHP lines 315-325)
    let amount = '';
    if (registrationData.examCity1 === 'Dubai' || 
        registrationData.examCity1 === 'Sharjah' || 
        registrationData.examCity1 === 'Abu Dhabi') {
      amount = 'AED' + (process.env.DUKE_TIP_AMOUNT_INTERNATIONAL || '70');
    } else {
      if (registrationData.amount_paid && registrationData.amount_paid !== 0) {
        amount = "Rs. " + registrationData.amount_paid;
      } else {
        amount = 'Rs.' + (process.env.DUKE_TIP_AMOUNT || '2500');
      }
    }
    
    // Email recipients (equivalent to PHP lines 327-328)
    const ccArray: string[] = [];
    const bccArray = ['ats.mailers@ei-india.com', 'einotification.sudhir@gmail.com'];
    
    // Student name formatting (equivalent to PHP lines 330-334)
    let studentname = '';
    if (registrationData.middleName) {
      studentname = `${registrationData.firstName} ${registrationData.middleName} ${registrationData.lastName}`;
    } else {
      studentname = `${registrationData.firstName} ${registrationData.lastName}`;
    }
    
    // School name formatting (equivalent to PHP lines 336-337)
    let schoolname = '';
    if (registrationData.schoolname) {
      schoolname = `${registrationData.schoolname}, ${registrationData.city}`;
    } else if (registrationData.registered_schoolname) {
      schoolname = registrationData.registered_schoolname;
    }
    
    // Exam timing based on class (equivalent to PHP lines 339-348)
    let sectionmins: number;
    let totalmins: number;
    let endtime: { [key: string]: string };
    
    if ([5, 6].includes(registrationData.class)) {
      sectionmins = 60;
      totalmins = 180;
      endtime = { english: "10:00", maths: "1:00", science: "4:00" };
    } else if ([7, 8].includes(registrationData.class)) {
      sectionmins = 70;
      totalmins = 210;
      endtime = { english: "10:10", maths: "1:10", science: "4:10" };
    } else {
      sectionmins = 70;
      totalmins = 210;
      endtime = { english: "10:10", maths: "1:10", science: "4:10" };
    }
    
    // Check if NonASSET (equivalent to PHP lines 351-353)
    const isNonASSET = (registrationData.referrer === "ats_invited_registration.php" && 
                       registrationData.examdate === "00-00-0000") ? 1 : 0;
    
    // Format selected subjects (equivalent to PHP lines 355-363)
    let subjectsSelected = "";
    if (registrationData.subjectnos_selected) {
      const subArray = registrationData.subjectnos_selected.split(',');
      subArray.forEach(subVal => {
        const subNum = parseInt(subVal);
        if (subjectArray[subNum]) {
          subjectsSelected += subjectArray[subNum] + ",";
        }
      });
    }
    
    // Email content based on site (equivalent to PHP lines 366-380)
    let website: string;
    let contactEmail: string;
    let subject: string;
    let fromname: string;
    
    if (orderSite === "GTS") {
      website = "Gifted";
      contactEmail = "gts@giftedindia.org";
      subject = `Registration Confirmation for Gifted Talent Search: ${academicYear} (India)`;
      fromname = "Gifted Talent Search";
    } else {
      website = "Ei Talent";
      contactEmail = duketipemail;
      subject = `Registration Confirmation for Ei ASSET Talent Search: ${academicYear} (India)`;
      fromname = "ASSET Talent Search";
    }
    
    // Generate email message (equivalent to PHP lines 382-390)
    const templateData = {
      student: registrationData,
      DUKE_TIP_AMOUNT: amount,
      hall_ticket_date: process.env.DUKE_TIP_REGISTRATION_HALL_TICKET_DATE || '',
      exam_city: registrationData.examCity1 || '',
      studentname: studentname,
      school_name: schoolname,
      year: academicYear,
      endtime: endtime,
      isNonASSET: isNonASSET,
      site: website,
      contactemail: contactEmail,
      subjects: subjectsSelected.replace(/,$/, ''), // Remove trailing comma
      webinarlink: process.env.ATS_WEBINAR || ''
    };
    
    const message = await generateOrderConfirmationTemplate(templateData);
    
    // Send email via AWS SES (equivalent to PHP lines 393-394)
    await sendAWSEmail(
      to,
      `${fromname}<${contactEmail}>`,
      subject,
      message,
      ccArray,
      bccArray
    );
    
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
  }
}