// Email template for order confirmation - equivalent to PHP email_order_confirmation.php
// This replicates the exact template structure used in the PHP version

interface TemplateData {
  student: any;
  DUKE_TIP_AMOUNT: string;
  hall_ticket_date: string;
  exam_city: string;
  studentname: string;
  school_name: string;
  year: string;
  endtime: { [key: string]: string };
  isNonASSET: number;
  site: string;
  contactemail: string;
  subjects: string;
  webinarlink: string;
}

/**
 * Generate order confirmation email template
 * Equivalent to PHP template('partials/emails/email_order_confirmation.php', ...)
 */
export async function generateOrderConfirmationTemplate(data: TemplateData): Promise<string> {
  const {
    student,
    DUKE_TIP_AMOUNT,
    hall_ticket_date,
    exam_city,
    studentname,
    school_name,
    year,
    endtime,
    isNonASSET,
    site,
    contactemail,
    subjects,
    webinarlink
  } = data;

  // This template structure should match exactly what the PHP template generates
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration Confirmation - ${site} Talent Search</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .footer { background-color: #f8f9fa; padding: 15px; font-size: 12px; }
        .highlight { background-color: #fff3cd; padding: 10px; border-left: 4px solid #ffc107; margin: 15px 0; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        table, th, td { border: 1px solid #ddd; }
        th, td { padding: 8px; text-align: left; }
        th { background-color: #f8f9fa; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Registration Confirmation</h2>
            <h3>${site} Talent Search ${year}</h3>
        </div>
        
        <div class="content">
            <p>Dear Parent/Guardian,</p>
            
            <p>Thank you for registering <strong>${studentname}</strong> for the ${site} Talent Search ${year}.</p>
            
            <div class="highlight">
                <strong>Registration Details:</strong>
            </div>
            
            <table>
                <tr><th>Student Name</th><td>${studentname}</td></tr>
                <tr><th>Class</th><td>${student.class}</td></tr>
                <tr><th>PAN Number</th><td>${student.panNumber}</td></tr>
                <tr><th>School</th><td>${school_name}</td></tr>
                <tr><th>Amount Paid</th><td>${DUKE_TIP_AMOUNT}</td></tr>
                ${subjects ? `<tr><th>Subjects Selected</th><td>${subjects}</td></tr>` : ''}
                ${exam_city ? `<tr><th>Exam City</th><td>${exam_city}</td></tr>` : ''}
                ${student.examdate && student.examdate !== '00-00-0000' ? `<tr><th>Exam Date</th><td>${student.examdate}</td></tr>` : ''}
            </table>
            
            ${isNonASSET === 0 ? `
            <div class="highlight">
                <strong>Important Information:</strong>
                <ul>
                    <li>Your registration is confirmed and payment has been processed successfully.</li>
                    <li>Hall tickets will be available for download from <strong>${hall_ticket_date}</strong>.</li>
                    <li>Please ensure you arrive at the exam center 30 minutes before the scheduled time.</li>
                    <li>Bring your hall ticket and a valid photo ID on the exam day.</li>
                </ul>
            </div>
            
            ${endtime ? `
            <div class="highlight">
                <strong>Exam Schedule (Class ${student.class}):</strong>
                <ul>
                    <li><strong>English:</strong> 9:00 AM - ${endtime.english} PM</li>
                    <li><strong>Mathematics:</strong> 12:00 PM - ${endtime.maths} PM</li>
                    <li><strong>Science:</strong> 3:00 PM - ${endtime.science} PM</li>
                </ul>
            </div>
            ` : ''}
            ` : `
            <div class="highlight">
                <strong>Special Registration:</strong>
                <p>This is a special invitation-based registration. Further details about the assessment will be shared separately.</p>
            </div>
            `}
            
            ${webinarlink ? `
            <div class="highlight">
                <strong>Orientation Webinar:</strong>
                <p>Join our orientation webinar: <a href="${webinarlink}">${webinarlink}</a></p>
            </div>
            ` : ''}
            
            <p><strong>What's Next?</strong></p>
            <ul>
                <li>Keep this confirmation email for your records.</li>
                <li>Watch for additional communications regarding exam logistics.</li>
                <li>Visit our website for preparation resources and updates.</li>
            </ul>
            
            <p>If you have any questions or concerns, please don't hesitate to contact us at <a href="mailto:${contactemail}">${contactemail}</a>.</p>
            
            <p>Best regards,<br>
            <strong>The ${site} Talent Search Team</strong></p>
        </div>
        
        <div class="footer">
            <p>This is an automated email. Please do not reply directly to this email.</p>
            <p>For support, contact: <a href="mailto:${contactemail}">${contactemail}</a></p>
        </div>
    </div>
</body>
</html>
  `.trim();
}