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
    
    // Check if OpenAI is configured
    const openaiKey = process.env.OPENAI_API_KEY
    
    if (!openaiKey) {
      console.warn('OpenAI API key not configured, using fallback responses')
      return NextResponse.json({
        response: generateFallbackResponse(userMessage)
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
        return NextResponse.json({
          response: generateFallbackResponse(userMessage)
        })
      }

      const data = await response.json()
      const aiResponse = data.choices?.[0]?.message?.content || generateFallbackResponse(userMessage)

      return NextResponse.json({
        response: aiResponse
      })
    } catch (apiError) {
      console.warn('OpenAI API request failed, using fallback')
      return NextResponse.json({
        response: generateFallbackResponse(userMessage)
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
function generateFallbackResponse(userMessage: string): string {
  const message = userMessage.toLowerCase()
  
  // Registration related
  if (message.includes('register') || message.includes('registration') || message.includes('apply')) {
    return `Great question about registration! Here's what you need to know:

📅 **Registration Deadlines for Ei ATS 2025:**
• Early Bird: November 2, 2025
• Regular: November 23, 2025  
• Late Registration: November 30, 2025

💰 **Fee:** 250 AED or equivalent in local currency

🌐 **How to Register:**
Visit https://ats.ei.study/ats_registration.php and complete the online form.

✅ **Eligibility:** Students in grades 4-8 who scored in the top 15th percentile in any subject (English, Math, or Science).

Would you like me to explain any specific part of the registration process in more detail?`
  }

  // Exam related
  if (message.includes('exam') || message.includes('test') || message.includes('assessment') || message.includes('dates')) {
    return `Here are the complete exam details for Ei ATS 2025:

🗓️ **Test Window:** November 28 - December 1, 2025
🏠 **Format:** Online test taken from home
⏱️ **Duration:** 3 hours total

📚 **Subjects & Time:**
• English: 60 minutes
• Mathematics: 60 minutes  
• Science: 60 minutes

🎯 **Who Can Take It:**
Students in grades 4-8 who are in the top 15th percentile in any subject.

📝 **Sample Papers:** Available at https://ei.study/wp-content/uploads/2025/01/Sample-Questions-Ei-ASSET-Final-File.pdf

Need help with exam preparation tips or have specific questions about the test format?`
  }

  // Universities/Programs
  if (message.includes('university') || message.includes('universities') || message.includes('college') || message.includes('program')) {
    return `Excellent question! Ei ATS partners with prestigious institutions globally:

🏛️ **University Partners:**

**Johns Hopkins CTY**
• Programs for grades 2-12
• Requires 98th percentile for direct admission
• Online and campus-based courses

**UC Berkeley ATDP**  
• Summer residential programs
• Grades 7-10
• 80%+ percentile gets priority; 50-79% with portfolio

**Northwestern CTD**
• Programs for ages 3-12
• 90%+ percentile for direct admission
• Online and residential options

**Purdue GER2I**
• COMET, STAR & PULSAR programs  
• Grades 5-12
• 90%+ direct admission; 50-89% with portfolio

**SIG (Summer Institute for the Gifted)**
• 2-3 week residential programs
• Ages 5-17
• Requires 90th percentile

Which university program interests you most? I can provide more specific details!`
  }

  // Rewards/Recognition
  if (message.includes('reward') || message.includes('medal') || message.includes('certificate') || message.includes('recognition')) {
    return `Here's how Ei ATS recognizes outstanding performance:

🏆 **Scholar Recognition Levels:**

**🥇 Gold Scholar (95-99th percentile)**
• Gold medal + certificate
• Highest level of recognition

**🥈 Silver Scholar (90-94th percentile)** 
• Silver medal + certificate
• High achievement recognition

**🥉 Bronze Scholar (85-89th percentile)**
• Bronze medal + certificate  
• Achievement recognition

**📜 Participation Certificate**
• All participants receive official recognition
• Acknowledges academic participation

✨ **Important:** Minimum 300 participants required per grade for award qualification.

These achievements are recognized by our university partners and can enhance your academic profile. What other aspects of the recognition program would you like to know about?`
  }

  // Contact/Support
  if (message.includes('contact') || message.includes('support') || message.includes('help') || message.includes('phone') || message.includes('email')) {
    return `I'm here to help! Here are the ways you can get support:

📧 **Email:** eitalentsearch@ei.study
📞 **Phone:** +91 80 4718 7451
🕐 **Hours:** Monday-Saturday, 9AM-6PM IST

🏢 **Office Address:**
Educational Initiatives Pvt Ltd
The CUBE - Karle Town Center
Bengaluru, India

💬 **Quick Contact:** You can also use the contact form at https://ats.ei.study/contact

🌐 **Website:** https://ats.ei.study

Our support team is very responsive and will help you with any specific questions about registration, exam preparation, or university programs. Is there something specific I can help you with right now?`
  }

  // Fee related
  if (message.includes('fee') || message.includes('cost') || message.includes('price') || message.includes('payment')) {
    return `Here's the complete fee information for Ei ATS 2025:

💰 **Registration Fee:** 250 AED (or equivalent in local currency)

🎁 **What's Included:**
• Comprehensive assessment across 3 subjects
• Detailed performance analysis and reports
• Access to all educational resources
• University partnership opportunities  
• Certificates and recognition
• Ongoing academic support

💡 **Early Bird Benefit:**
Register by November 2, 2025 for additional benefits and priority support.

The fee is very reasonable considering the world-class educational opportunities and university partnerships you gain access to. Do you have questions about payment methods or need assistance with the registration process?`
  }

  // Eligibility
  if (message.includes('eligible') || message.includes('eligibility') || message.includes('qualify') || message.includes('requirements')) {
    return `Here are the eligibility requirements for Ei ATS 2025:

✅ **Grade Requirements:**
Students currently in grades 4, 5, 6, 7, or 8

📊 **Academic Requirements:**  
Top 15th percentile in ANY subject:
• English OR
• Mathematics OR  
• Science

🌍 **Geographic Scope:**
Open to students worldwide - no geographic restrictions!

📈 **Assessment Basis:**
• Based on academic potential, not just current performance
• We encourage all passionate learners to apply
• School assessments or standardized test scores can demonstrate percentile ranking

💡 **Important:** If you're unsure about your percentile ranking, we encourage you to apply anyway. Our assessment is designed to identify potential and passion for learning.

Do you have questions about checking your percentile ranking or any other eligibility concerns?`
  }

  // General greeting
  if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.includes('good morning') || message.includes('good afternoon')) {
    return `Hello! Welcome to Ei ATS (Educational Initiatives Academic Talent Search)! 

I'm your AI assistant specifically designed to help with Ei ATS questions only.

🌟 **I can help you with Ei ATS topics like:**
• Registration process and deadlines
• Exam format and preparation tips  
• University partnerships (Johns Hopkins CTY, UC Berkeley ATDP, Northwestern CTD, etc.)
• Recognition and rewards system
• Eligibility requirements
• Contact information and support

What specific aspect of Ei ATS would you like to know more about?`
  }

  // Handle non-Ei ATS questions
  if (!message.includes('ats') && !message.includes('register') && !message.includes('exam') && !message.includes('test') && 
      !message.includes('university') && !message.includes('college') && !message.includes('program') && 
      !message.includes('reward') && !message.includes('medal') && !message.includes('certificate') && 
      !message.includes('eligible') && !message.includes('fee') && !message.includes('contact') && 
      !message.includes('support') && !message.includes('deadline') && !message.includes('date') &&
      !message.includes('johns hopkins') && !message.includes('uc berkeley') && !message.includes('northwestern') &&
      !message.includes('purdue') && !message.includes('sig') && !message.includes('genwise') &&
      !message.includes('educational initiatives') && !message.includes('ei ') && !message.includes('talent search')) {
    return `I'm specifically designed to help with Ei ATS (Educational Initiatives Academic Talent Search) questions only. 

Could you ask me something about our Academic Talent Search program instead? For example:
• Registration process and deadlines
• Exam details and preparation
• University partnerships
• Eligibility requirements
• Rewards and recognition

What would you like to know about Ei ATS?`
  }

  // Default comprehensive response
  return `Thank you for your question about Ei ATS! While I'd love to provide more specific information, here's a comprehensive overview:

🎯 **Ei ATS 2025 Key Information:**

**Registration:** Open until November 30, 2025 (Early Bird: Nov 2)
**Test Window:** November 28 - December 1, 2025  
**Fee:** 250 AED or equivalent
**Eligibility:** Grades 4-8, top 15th percentile in any subject

**University Partners:** Johns Hopkins CTY, UC Berkeley ATDP, Northwestern CTD, Purdue GER2I, SIG

**Recognition:** Gold/Silver/Bronze Scholar medals and certificates based on performance

📞 **Need Specific Help?**
Contact our support team at:
• Email: eitalentsearch@ei.study  
• Phone: +91 80 4718 7451

I'm here to answer any specific questions you have about registration, exams, university programs, or anything else related to Ei ATS! What would you like to know more about?`
} 