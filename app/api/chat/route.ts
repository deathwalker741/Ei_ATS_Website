import { NextRequest, NextResponse } from 'next/server'

interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface ChatRequest {
  messages: Message[]
}

// OpenAI API configuration
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

// OpenAI API key from environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || ''

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      )
    }

    const userMessage = messages[messages.length - 1]?.content || ''
    
    // Extract region from system message
    const systemMessage = messages.find(m => m.role === 'system')?.content || ''
    const isInternational = systemMessage.includes('International')
    
    // Check if OpenAI is configured
    const openaiKey = process.env.OPENAI_API_KEY
    
    if (!openaiKey) {
      console.warn('OpenAI API key not configured, using fallback responses')
      const fallbackResponse = generateFallbackResponse(userMessage, isInternational)
      console.log('Generated fallback response for:', userMessage.substring(0, 50) + '...')
      return NextResponse.json({
        response: fallbackResponse
      })
    }

    // Try OpenAI API
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: messages,
          max_tokens: 500,
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        console.warn(`OpenAI API error: ${response.status} ${response.statusText}`)
        const fallbackResponse = generateFallbackResponse(userMessage, isInternational)
        return NextResponse.json({
          response: fallbackResponse
        })
      }

      const data = await response.json()
      const aiResponse = data.choices?.[0]?.message?.content || generateFallbackResponse(userMessage, isInternational)

      return NextResponse.json({
        response: aiResponse
      })
    } catch (apiError) {
      console.warn('OpenAI API request failed, using fallback')
      const fallbackResponse = generateFallbackResponse(userMessage, isInternational)
      return NextResponse.json({
        response: fallbackResponse
      })
    }

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { 
        response: "I'm experiencing technical difficulties. Please contact our support team at eitalentsearch@ei.study for assistance."
      },
      { status: 200 } // Return 200 so the chat continues to work
    )
  }
}

// Intelligent fallback responses based on keywords and context
function generateFallbackResponse(userMessage: string, isInternational: boolean = false): string {
  const message = userMessage.toLowerCase()
  const region = isInternational ? "International" : "India"
  const currency = isInternational ? "AED" : "INR"
  const contact = isInternational ? "atsinternational@ei.study" : "eitalentsearch@ei.study"
  const phone = isInternational ? "" : " or call +91 80 4718 7451"
  
  // Registration related
  if (message.includes('register') || message.includes('registration') || message.includes('apply') || message.includes('sign up')) {
    return `Great question about ${region} registration! Here's what you need to know:
    
    📅 **Registration Deadlines for Ei ATS ${region} 2025:**
    • Early Bird: ${isInternational ? "March 16, 2025" : "November 2, 2025"}
    • Regular: ${isInternational ? "March 23, 2025" : "November 23, 2025"}  
    • Late Registration: ${isInternational ? "March 28, 2025" : "November 30, 2025"}
    
    💰 **Fee:** ${isInternational ? "170-250 AED per subject" : "INR 1700-2700 per subject"}

🌐 **How to Register:**
Visit https://ats.ei.study/ats_registration.php and complete the online form.

    🔗 **Direct Link:** [Register Now](https://ats.ei.study/ats_registration.php)

Would you like me to explain any specific part of the registration process in more detail?`
  }

  // Exam related
  if (message.includes('exam') || message.includes('test') || message.includes('when') || message.includes('format') || message.includes('duration')) {
    return `Here's everything about the Ei ATS ${region} 2025 exam:
    
    📋 **Test Details:**
    • Test Window: ${isInternational ? "March 28-30, 2025" : "November 28 - December 1, 2025"}
    • Format: Online proctored test
    • Duration: 60 minutes per subject
    • Subjects: English, Maths, Science (choose 1, 2, or all 3)
    • Level: Two grades above current level
    • No preparation required, no negative marking
    
    ✅ **Eligibility:**
    • Grades 4-8 students
    • Top 15th percentile in ASSET test
    • OR Stanine 9 in CAT4
    
    🔗 **Registration:** https://ats.ei.study/ats_registration.php
    
    Need more specific information about the exam format or preparation?`
  }
  
  // Universities/Partners
  if (message.includes('university') || message.includes('partner') || message.includes('johns hopkins') || message.includes('northwestern') || message.includes('berkeley') || message.includes('purdue') || message.includes('sig') || message.includes('genwise')) {
    return `Here are the prestigious university partners for Ei ATS ${region}:
    
    🎓 **University Partners:**
    
    1. **Johns Hopkins CTY** - Global leader since 1979
       • Grades 2-12, accredited courses
       • Eligibility: 98th percentile in English/Math
       • Contact: ctyinfo@jhu.edu
       • Website: /programmes/cty
    
    2. **Northwestern CTD** - Top-10 U.S. research university
       • Ages 3-12, residential/online programs
       • Eligibility: ≥90th percentile direct
       • Contact: s-corwith@northwestern.edu
       • Website: /programmes/northwestern
    
    3. **UC Berkeley ATDP** - World's #1 public university
       • Grades 7-10, four-week residential
       • Eligibility: 80th percentile priority
       • Contact: BerkeleyATDP@cfmedu.com
       • Website: /programmes/uc-berkeley
    
    4. **Purdue GER2I** - STEM and humanities focus
       • Grades 5-12, COMET/STAR/PULSAR programs
       • Eligibility: ≥90th percentile direct
       • Contact: geri@purdue.edu
       • Website: /programmes/purdue
    
    5. **SIG** - Prestigious partner institutions
       • Ages 5-17, 2-3 week residential
       • Eligibility: ≥90th percentile
       • Contact: info@giftedstudy.org
       • Website: /programmes/sig
    
    6. **GENWISE** - Computational thinking focus
       • Grades 6-10, residential/online
       • Eligibility: Ei ATS qualification + strong Math/Science
       • Contact: info@genwise.in
       • Website: /programmes/genwise
    
    🔗 **Learn More:** /programmes
    
    Which university program interests you most?`
  }
  
  // Resources
  if (message.includes('resource') || message.includes('sample') || message.includes('paper') || message.includes('preparation') || message.includes('aqad') || message.includes('webinar')) {
    return `Here are the comprehensive resources available for Ei ATS ${region}:
    
    📚 **Study Resources:**
    
    **Sample Papers:**
    • Official Sample Papers: https://ei.study/wp-content/uploads/2025/01/Sample-Questions-Ei-ASSET-Final-File.pdf
    
    **Learning Platforms:**
    • AQAD Platform (Daily questions): https://www.aqad.in
    • Webinars: https://ei.study/ei-webinars/
    • Blog: https://ei.study/blogs/
    
    **Brochures:**
    • ${region} Brochure: https://ats.ei.study/documents/ATS-${isInternational ? "International" : "India"}2024.pdf
    
    **Resources Page:** /resources
    **Articles & Research:** /resources/articles
    
    🔗 **Direct Links:**
    • [Sample Papers](https://ei.study/wp-content/uploads/2025/01/Sample-Questions-Ei-ASSET-Final-File.pdf)
    • [Resources](/resources)
    • [AQAD Platform](https://www.aqad.in)
    
    Which resource would you like to explore?`
  }
  
  // Rewards/Awards
  if (message.includes('reward') || message.includes('award') || message.includes('medal') || message.includes('certificate') || message.includes('scholar')) {
    return `Here are the recognition and awards for Ei ATS ${region}:
    
    🏆 **Recognition & Awards:**
    
    **Scholar Categories:**
    • Bronze Scholar (85-89%): Certificate + Medal
    • Silver Scholar (90-94%): Certificate + Medal
    • Gold Scholar (95-99%): Certificate + Medal
    
    **Top Grade Toppers:**
    • Eligible for iPads, tablets, Kindles, Apple Watches
    
    **Benefits:**
    • International recognition
    • University program eligibility
    • Academic excellence acknowledgment
    • Networking opportunities
    
    The awards are based on performance percentile and provide excellent opportunities for further academic development!
    
    🔗 **Learn More:** /programmes`
  }
  
  // Contact information
  if (message.includes('contact') || message.includes('email') || message.includes('phone') || message.includes('address') || message.includes('office')) {
    return `Here's how to contact Ei ATS ${region}:
    
    📞 **Contact Information:**
    
    **Email:** ${contact}
    ${phone ? `**Phone:** ${phone}` : ''}
    
    **Office Address:**
    The CUBE - Karle Town Center, Bengaluru, India
    CIN: U80211GJ2000PTC038692103
    
    **Business Hours:**
    Monday - Saturday, 9:00 AM - 6:00 PM IST
    
    **Contact Page:** /contact
    • Send messages with name, email, phone, subject, message
    • FAQ section available
    • Immediate help available during business hours
    
    **Schedule Call with Alumni:** /schedule-call
    • Connect with Ei ATS alumni
    • Share experiences and get answers
    • Fill form: Student Name, Email, School, Grade, Questions
    
    🔗 **Direct Links:**
    • [Contact Form](/contact)
    • [Schedule Alumni Call](/schedule-call)
    
    How can we help you today?`
  }
  
  // Fees
  if (message.includes('fee') || message.includes('cost') || message.includes('price') || message.includes('payment')) {
    return `Here are the fees for Ei ATS ${region} 2025:
    
    💰 **Fee Structure:**
    
    **${region} Fees:**
    ${isInternational ? 
      "• 170-250 AED per subject (Late fee: AED 300)" : 
      "• INR 1700 (early), INR 2700 (late) for 1 subject\n• INR 2200-3300 for 2-3 subjects"
    }
    
    **Registration Deadlines:**
    • Early Bird: ${isInternational ? "March 16, 2025" : "November 2, 2025"}
    • Regular: ${isInternational ? "March 23, 2025" : "November 23, 2025"}
    • Late: ${isInternational ? "March 28, 2025" : "November 30, 2025"}
    
    **Payment:**
    • Online payment only
    • Credit/debit cards accepted
    • Secure payment gateway
    
    **School Bulk Registration:**
    • 10% discount available
    • Contact: eitalentsearch@ei.study
    
    🔗 **Register Now:** https://ats.ei.study/ats_registration.php
    
    Need help with payment or registration?`
  }

  // Eligibility
  if (message.includes('eligible') || message.includes('qualify') || message.includes('grade') || message.includes('percentile')) {
    return `Here are the specific eligibility requirements for Ei ATS ${region}:

## Eligibility & Qualification Criteria

### Primary Qualification (ASSET Test)
1. Students who scored more than 85 percentile in either English, Maths, or Science ASSET exam
2. If a student didn't take part in ASSET, they can take ASSET Online test
3. If they score more than 85 percentile in either English, Maths, or Science ASSET exam, they qualify for ATS

### Alternative Qualification (CAT4)
- Students scoring Stanine 9 in CAT4 can also register for ATS

### Registration Process
1. Students must have their ASSET PAN ID to register for the ATS test
2. Students can find their ASSET PAN ID in the student "My Book" report of ASSET test
3. If students are unable to find their PAN, they can use the ASSET PAN ID Retriever tool
4. Fill all required details and submit - PAN ID will be received in popup
5. Take note of PAN ID and enter in registration form with other required details
6. Complete the registration process

### Non-ASSET Students
- Can participate via ASSET Online: https://www.asset.online
- Schools can nominate top 15% students
- Contact: eitalentsearch@ei.study

### School Nomination Process
- Non-ASSET schools can nominate up to top 15% students
- Send student details from official school email
- Download form: /ATS%20Registration%20Form%20for%20non%20ASSET%20schools-2025.xlsx

### Bulk Registration
- Schools with 100+ qualifiers: 25% minimum
- Schools with <100 qualifiers: 50% minimum
- 10% discount on registration fee

## Learn More
- [For Schools](/for-schools)

Are you checking eligibility for yourself or your school?`
  }
  
  // Parents/Students/Schools specific
  if (message.includes('parent') || message.includes('student') || message.includes('school')) {
    return `Here are the specific pages for different audiences:
    
    👥 **Audience-Specific Information:**
    
    **For Parents:** /for-parents
    • Complete test details and format
    • Step-by-step registration guide
    • Non-ASSET student information
    • FAQ section
    
    **For Students:** /for-students
    • Student-specific resources
    • Preparation tips
    • Success stories
    • Student portal access using PAN ID
    
    **For Schools:** /for-schools
    • School dashboard and admin portal
    • Bulk registration (10% discount)
    • Student nomination process
    • Performance analytics
    • Non-ASSET school registration
    
    **School Benefits:**
    • Identify gifted students
    • Access performance analytics
    • Streamlined registration
    • Recognition for achievements
    • Professional development opportunities
    
    🔗 **Direct Links:**
    • [For Parents](/for-parents)
    • [For Students](/for-students)
    • [For Schools](/for-schools)
    
    Which audience page would you like to explore?`
  }
  
  // Legal/Policy information
  if (message.includes('privacy') || message.includes('terms') || message.includes('refund') || message.includes('policy') || message.includes('legal')) {
    return `Here are the legal and policy documents for Ei ATS ${region}:
    
    📋 **Legal & Policy Information:**
    
    **Privacy Policy:** /privacy
    • Information collected: Personal info, payment details, usage data
    • Use: Competition participation, payments, communication, improvements
    • Sharing: Service providers only, no commercial sale
    • Security: Reasonable measures taken
    • Contact: competition@ei.study
    • Governing law: India
    
    **Terms & Conditions:** /terms
    • Registration fee: 250 AED (International) or equivalent
    • Eligibility: Grades 3-10 students
    • User conduct: Respectful and lawful behavior
    • Intellectual property: All content belongs to Educational Initiatives
    • Liability: Limited liability for damages
    • Contact: competition@ei.study
    • Governing law: India (Ahmedabad jurisdiction)
    
    **Refund Policy:** /refund
    • Fee: 250 AED (International) or equivalent
    • Refund eligibility: Only for technical glitches from Educational Initiatives
    • Process: Contact atsinternational@ei.study within 7 days
    • Approval: Within 14 days
    • Payment: Original method (card back to card)
    • No processing fee for technical glitches
    • Currency: Refunds in AED, variations due to fluctuations
    
    🔗 **Direct Links:**
    • [Privacy Policy](/privacy)
    • [Terms & Conditions](/terms)
    • [Refund Policy](/refund)
    
    Which policy would you like to review?`
  }
  
  // Schedule call with alumni
  if (message.includes('alumni') || message.includes('schedule') || message.includes('call')) {
    return `Here's how to schedule a call with Ei ATS alumni:
    
    📞 **Schedule Call with Alumni:** /schedule-call
    
    **Process:**
    • Fill out the online form
    • Connect with Ei ATS alumni
    • Get answers and share alumni experience
    
    **Form Fields:**
    • Student Name
    • Email Address
    • School Name
    • Grade/Class
    • Questions/Topics to discuss
    
    **Purpose:**
    • Get firsthand experience from alumni
    • Ask specific questions about the program
    • Learn about university opportunities
    • Understand the journey and benefits
    
    **Contact:**
    • Alumni will reach out shortly after submission
    • Direct communication with experienced participants
    
    🔗 **Schedule Your Call:** /schedule-call
    
    Would you like to schedule a call with our alumni?`
  }
  
  // School-specific information
  if (message.includes('bulk') || message.includes('nomination') || message.includes('admin') || message.includes('dashboard')) {
    return `Here's comprehensive school information for Ei ATS ${region}:
    
    🏫 **School-Specific Information:**
    
    **School Dashboard:** /for-schools
    • Bulk Registration Tool: Register multiple students, 10% discount
    • School Admin Login: Manage registrations, view results, track qualifiers
    • Student Nomination: Non-ASSET schools can nominate top 15% students
    
    **Bulk Registration Process:**
    • Eligibility: Schools with 100+ qualifiers (25% minimum) or <100 qualifiers (50% minimum)
    • Benefits: 10% discount on registration fee
    • Contact: eitalentsearch@ei.study
    
    **Non-ASSET Schools:**
    • Can nominate up to top 15% academically talented students
    • Process: Send student details from official school email
    • Contact: eitalentsearch@ei.study
    • Download form: /ATS%20Registration%20Form%20for%20non%20ASSET%20schools-2025.xlsx
    
    **School Benefits:**
    • Identify gifted students
    • Access performance analytics
    • Streamlined registration
    • Recognition for achievements
    • Professional development opportunities
    • Partnership with leading programs
    
    **School Admin Portal:** /for-schools/login
    
    🔗 **Direct Links:**
    • [School Dashboard](/for-schools)
    • [Bulk Registration Info](/resources/bulk-registrations)
    • [School Admin Login](/for-schools/login)
    
    Which school service would you like to learn more about?`
  }
  
  // PAN ID and Student Portal related
  if (message.includes('pan id') || message.includes('panid') || message.includes('asset pan') || message.includes('forgot pan') || message.includes('retrieve pan') || message.includes('student portal') || message.includes('results access')) {
    return `Here's how to access your Ei ATS information using your PAN ID:

## Student Tools & PAN ID Access

### Finding Your ASSET PAN ID
- Students can find their ASSET PAN ID in the student "My Book" report of ASSET test
- If students are unable to find their PAN, they can use the ASSET PAN ID Retriever tool

### Ei ASSET PAN ID Retriever
- **Purpose**: Retrieve your unique Ei ASSET PAN ID for Ei ATS registration
- **Process**: Use the online tool to recover your PAN ID if forgotten
- **Link**: https://learn.lab-ei.study/asset/ATS/ASSET_PAN/asset_pan_gpt/forgot_asset_pan.html
- **Features**: Retrieve PAN ID, forgot PAN ID recovery
- **For**: Students who have forgotten their ASSET PAN ID
- **Process**: Fill all required details, submit, receive PAN ID in popup

### Registration Process
1. Students must have their ASSET PAN ID to register for the ATS test
2. Students can find their ASSET PAN ID in the student "My Book" report of ASSET test
3. If students are unable to find their PAN, they can use the ASSET PAN ID Retriever tool
4. Fill all required details and submit - PAN ID will be received in popup
5. Take note of PAN ID and enter in registration form with other required details
6. Complete the registration process

### Student Portal
- Access personalized dashboard
- View test results and track progress
- Practice with mock tests
- Take Ei ATS test
- **Link**: https://ats.ei.study/student_portal/index.php

### Where Students Take the ATS Test
- Once registered for ATS test, students can take the test from Student Test Portal
- **Test Portal Link**: https://ats.ei.study/student_portal/index.php
- Login with credentials shared via email after registration
- Test is conducted online through the student portal
- Students receive login credentials by email after successful registration

### Ei ATS Qualifying Certificate
- Download certificates
- **Link**: https://ats.ei.study/ats_qualifier_certificate.php

### Awards & Recognition
- View complete list of winners and scholars
- See where you stand among the best
- **Link**: https://ats.ei.study/reward_winners_india.php

### Results Access
- Available through student portal using PAN ID
- Contact support if you have access issues

## Direct Links
- [PAN ID Retriever](https://learn.lab-ei.study/asset/ATS/ASSET_PAN/asset_pan_gpt/forgot_asset_pan.html)
- [Student Portal](https://ats.ei.study/student_portal/index.php)
- [Qualifying Certificate](https://ats.ei.study/ats_qualifier_certificate.php)
- [Awards & Recognition](https://ats.ei.study/reward_winners_india.php)

Need help with any specific student tool?`
  }
  
  // Summer programs and university partnerships
  if (message.includes('summer') || message.includes('program') || message.includes('university') || message.includes('partner') || message.includes('visa') || message.includes('camp')) {
    return `Here's information about summer programs and university partnerships for Ei ATS ${region}:

## Summer Programs & University Partnerships

### Summer Program Registration
- Students can directly reach out to University partners using provided contact information
- Can use ATS Score to get admitted in their summer camp programmes
- For International programmes, Ei doesn't help with Visa - students must handle it themselves

### University Partners

1. **Johns Hopkins CTY** - Global leader since 1979
   - Grades 2-12, accredited courses
   - Eligibility: 98th percentile in English/Math
   - Contact: ctyinfo@jhu.edu
   - Website: /programmes/cty

2. **Northwestern CTD** - Top-10 U.S. research university
   - Ages 3-12, residential/online programs
   - Eligibility: ≥90th percentile direct
   - Contact: s-corwith@northwestern.edu
   - Website: /programmes/northwestern

3. **UC Berkeley ATDP** - World's #1 public university
   - Grades 7-10, four-week residential
   - Eligibility: 80th percentile priority
   - Contact: BerkeleyATDP@cfmedu.com
   - Website: /programmes/uc-berkeley

4. **Purdue GER2I** - STEM and humanities focus
   - Grades 5-12, COMET/STAR/PULSAR programs
   - Eligibility: ≥90th percentile direct
   - Contact: geri@purdue.edu
   - Website: /programmes/purdue

5. **SIG** - Prestigious partner institutions
   - Ages 5-17, 2-3 week residential
   - Eligibility: ≥90th percentile
   - Contact: info@giftedstudy.org
   - Website: /programmes/sig

6. **GENWISE** - Computational thinking focus
   - Grades 6-10, residential/online
   - Eligibility: Ei ATS qualification + strong Math/Science
   - Contact: info@genwise.in
   - Website: /programmes/genwise

### Important Notes
- Students should contact universities directly for summer program applications
- Use your ATS Score for admission to summer camp programmes
- For International programmes, visa arrangements are the student's responsibility
- Ei doesn't provide visa assistance for international programs

## Learn More
- [University Programs](/programmes)

Which university program interests you most?`
  }
  
  // If none of the above patterns match, provide a more specific response based on keywords
  if (message.includes('what') || message.includes('how') || message.includes('where') || message.includes('why')) {
    return `I'd be happy to help you with that! However, I need a bit more context about what you're asking about Ei ATS. 
    
    Could you please be more specific? For example:
    • "What are the registration dates?"
    • "How do I register for the test?"
    • "Where can I find sample papers?"
    • "Why should I take Ei ATS?"
    • "How do schools participate?"
    • "What are the contact details?"
    • "How do I schedule a call with alumni?"
    
    🔗 **Quick Access:**
    • [Registration](https://ats.ei.study/ats_registration.php)
    • [University Programs](/programmes)
    • [Resources](/resources)
    • [Contact](/contact)
    • [For Schools](/for-schools)
    • [Schedule Call](/schedule-call)
    
    What specific information are you looking for?`
  }
  
  // Default response - only if nothing else matches
  return `Thank you for your question about Ei ATS ${region}! I'd be happy to help you with specific information about our program.
  
  Could you please ask me something more specific? For example:
  • "What are the registration deadlines?"
  • "How much does the test cost?"
  • "Tell me about university partnerships"
  • "Where can I find sample papers?"
  • "What are the eligibility requirements?"
  • "How do schools participate?"
  • "What are the contact details?"
  • "How do I schedule a call with alumni?"
  
  🔗 **Quick Access:**
  • [Registration](https://ats.ei.study/ats_registration.php)
  • [University Programs](/programmes)
  • [Resources](/resources)
  • [Sample Papers](https://ei.study/wp-content/uploads/2025/01/Sample-Questions-Ei-ASSET-Final-File.pdf)
  • [Contact](/contact)
  • [For Schools](/for-schools)
  • [Schedule Call](/schedule-call)
  
  What would you like to know more about?`
} 