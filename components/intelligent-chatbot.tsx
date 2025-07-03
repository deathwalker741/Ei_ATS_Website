"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { MessageCircle, Send, X, Bot, User, Minimize2, Maximize2 } from 'lucide-react'

interface Message {
  id: string
  text: string
  isBot: boolean
  timestamp: Date
  suggestions?: string[]
}

interface ChatbotKnowledge {
  [key: string]: {
    keywords: string[]
    response: string
    suggestions?: string[]
  }
}

const chatbotKnowledge: ChatbotKnowledge = {
  // Comprehensive ATS Program Information
  ats_program: {
    keywords: ["what is ats", "ats program", "talent search", "academic talent search", "program overview", "ei asset"],
    response: "ATS (Academic Talent Search) by Educational Initiatives is a comprehensive platform for identifying and nurturing academically gifted students through rigorous assessment and world-class educational opportunities.\n\nProgram Highlights:\n• 15+ years of excellence in talent identification\n• 1000+ alumni from 100+ schools globally\n• 100+ courses delivered since inception\n• Identifying the top 2% of gifted students worldwide",
    suggestions: ["Tell me about universities", "How to register?", "What are the statistics?"]
  },

  // Detailed Exam Information
  exam_details: {
    keywords: ["exam", "test", "assessment", "dates", "schedule", "when is exam", "format", "subjects", "duration"],
    response: "ATS 2025 Exam Details:\n\nTest Schedule:\n• Test Window: November 28 - December 1, 2025\n• Format: Online test at home\n• Duration: 3 hours total\n\nSubjects & Format:\n• English: 60 minutes\n• Math: 60 minutes\n• Science: 60 minutes\n\nEligibility:\n• Grades 4-8 students\n• Top 15th percentile in any subject\n\nRegistration Deadlines:\n• Early Bird: November 9, 2025\n• Final Deadline: November 30, 2025",
    suggestions: ["Sample papers?", "How to prepare?", "Registration process?"]
  },

  // Detailed Registration Process
  registration: {
    keywords: ["register", "registration", "how to apply", "sign up", "enrollment", "join ats", "deadline"],
    response: "ATS 2025 Registration Process:\n\nStep-by-Step Process:\n1. Visit https://ats.ei.study/ats_registration.php\n2. Complete online registration form\n3. Submit required documents\n4. Pay registration fee (250 AED or equivalent)\n5. Take the assessment test\n\nImportant Dates:\n• Early Bird Deadline: November 9, 2025\n• Final Deadline: November 30, 2025\n• Test Window: November 28 - December 1, 2025",
    suggestions: ["What documents needed?", "Payment methods?", "Test preparation?"]
  },

  // Comprehensive University Partnerships
  universities: {
    keywords: ["universities", "colleges", "partners", "johns hopkins", "northwestern", "uc berkeley", "purdue", "sig", "genwise"],
    response: "ATS University Partners:\n\nJohns Hopkins CTY:\n• Grades 2-12 programs\n• Online and campus-based courses\n• Eligibility: 98th percentile required\n\nUC Berkeley ATDP:\n• Summer residential program\n• Grades 7-10\n• Eligibility: 80%+ priority, 50-79% with portfolio\n\nNorthwestern CTD:\n• Ages 3-12 programs\n• Online and residential options\n• Eligibility: 90%+ direct, below 90% with portfolio\n\nPurdue GER²I:\n• COMET, STAR & PULSAR programs\n• Grades 5-12\n• Eligibility: 90%+ direct, 50-89% with portfolio\n\nSummer Institute for the Gifted (SIG):\n• 2-3 week residential programs\n• Ages 5-17\n• Eligibility: 90th percentile\n\nGENWISE Programme:\n• Computational thinking focus\n• Math puzzles and science investigations\n• Higher-order skill development",
    suggestions: ["Eligibility criteria?", "Application process?", "Program details?"]
  },

  // Detailed Rewards Structure
  rewards: {
    keywords: ["rewards", "medals", "certificates", "bronze", "silver", "gold", "scholar", "recognition"],
    response: "ATS Rewards Structure:\n\nGold Scholar (95-99 percentile):\n• Medal + Certificate\n• Highest recognition level\n\nSilver Scholar (90-94 percentile):\n• Medal + Certificate\n• High achievement recognition\n\nBronze Scholar (85-89 percentile):\n• Medal + Certificate\n• Achievement recognition\n\nParticipation Certificate:\n• All participants receive official recognition\n• Acknowledges academic participation\n\nImportant Note:\n• Minimum 300 participants required per grade for award qualification",
    suggestions: ["How are percentiles calculated?", "When do I receive awards?", "What's the selection criteria?"]
  },

  // Comprehensive Resources
  resources: {
    keywords: ["resources", "preparation", "study materials", "sample papers", "practice tests", "aqad", "brochure"],
    response: "ATS Resources Available:\n\nSample Papers:\n• Official ATS format with answer keys\n• All subjects covered\n• Download: https://ei.study/wp-content/uploads/2025/01/Sample-Questions-Ei-ASSET-Final-File.pdf\n\nAQAD Platform:\n• Performance analytics & personalized insights\n• Access: www.aqad.in\n• Detailed progress tracking\n\nATS Brochure:\n• Complete program guide\n• Download: https://ats.ei.study/documents/ATS-India2024.pdf\n\nArticles & Insights:\n• Success stories & expert guidance\n• Study tips and university guides\n• Access: https://ei.study/blogs/\n\nVideo Testimonials:\n• 200+ testimonials from students, parents & schools\n• Real success stories and experiences",
    suggestions: ["Download sample papers", "Access AQAD platform", "View testimonials"]
  },

  // Detailed Contact Information
  contact: {
    keywords: ["contact", "phone", "email", "address", "support", "help", "bengaluru", "schedule a call", "schedule call", "call", "appointment"],
    response: "Contact Information:\n\nTo Schedule a Call or Send a Message:\n• Visit our contact form: /contact#send-message\n• Fill out the contact form with your details\n• Our team will respond within 24 hours\n\nDirect Contact:\n• Email: eitalentsearch@ei.study\n• Phone: +91 80 4718 7451\n• Hours: Monday-Saturday, 9AM-6PM\n\nOffice Address:\nEducational Initiatives Pvt Ltd\nThe CUBE - Karle Town Center\nBengaluru, India\n\nWebsite: https://ats.ei.study\nCompany CIN: U80211GJ2000PTC038692103",
    suggestions: ["Send message", "Visit office", "Live webinars"]
  },

  // Fees and Payment
  fees: {
    keywords: ["fee", "cost", "price", "payment", "how much", "charges", "250 aed"],
    response: "ATS Registration Fee:\n\nCost: 250 AED or equivalent in local currency\n\nFee Includes:\n• Comprehensive assessment\n• Performance analysis\n• Certificates and recognition\n• Access to all resources\n• University partnership opportunities\n• Ongoing support\n\nEarly Bird Benefits:\n• Register by November 9, 2025 for additional benefits\n• Enhanced support and priority access",
    suggestions: ["Payment methods?", "Refund policy?", "Financial assistance?"]
  },

  // Detailed Eligibility
  eligibility: {
    keywords: ["age", "grade", "eligibility", "who can apply", "requirements", "15th percentile"],
    response: "Eligibility Criteria:\n\nGrade Requirements:\n• Students in grades 4-8 are eligible\n\nAcademic Requirements:\n• Top 15th percentile in any subject (English, Math, or Science)\n• Based on school assessments\n\nGeographic Scope:\n• Open to students globally\n• No geographic restrictions\n\nAssessment Philosophy:\n• Based on academic potential\n• Not just current performance\n• All students with passion for learning encouraged to apply",
    suggestions: ["How to check percentile?", "Grade-wise programs?", "International students?"]
  },

  // Success Stories & Statistics
  success_stories: {
    keywords: ["success", "testimonials", "results", "achievements", "stories", "alumni", "1000+"],
    response: "ATS Success Statistics:\n\nAlumni Network:\n• 1000+ alumni from 100+ schools globally\n• Students across multiple countries\n\nProgram Achievements:\n• 100+ courses delivered since inception\n• 15+ years of excellence in talent identification\n• Top 2% global reach in identifying gifted students\n\nSuccess Stories:\n• 200+ video testimonials from students, parents, and schools\n• Students admitted to top universities worldwide\n• Scholarship recipients and academic achievers\n• International competition winners",
    suggestions: ["Watch testimonials", "Alumni achievements", "University admissions"]
  },

  // AQAD Platform Details
  aqad: {
    keywords: ["aqad", "platform", "analytics", "performance", "dashboard", "insights"],
    response: "AQAD Platform (Advanced Question Analysis Dashboard):\n\nKey Features:\n• Detailed performance analytics\n• Personalized learning insights\n• Progress tracking\n• Skill assessment\n\nAccess Information:\n• Website: www.aqad.in\n• Login with student credentials\n• Secure student dashboard\n\nBenefits:\n• Performance analysis\n• Learning insights\n• Progress tracking\n• Personalized reports\n\nPurpose:\n• Optimize learning paths\n• Identify strengths and weaknesses\n• Guide academic development",
    suggestions: ["How to login?", "Platform tutorial?", "Performance reports?"]
  },

  // Webinars & Support
  webinars: {
    keywords: ["webinar", "online session", "live class", "workshop", "expert"],
    response: "ATS Webinars & Support:\n\nWebinar Features:\n• Regular sessions on exam preparation\n• University application guidance\n• Career guidance sessions\n• Expert-led educational content\n\nAccess Information:\n• Free for registered students\n• Website: https://ei.study/webinars/\n• Live and recorded sessions available\n\nTopics Covered:\n• Study strategies and preparation tips\n• University partnerships and applications\n• Success stories and motivation\n• Academic planning and career guidance\n\nSchedule:\n• Check website for upcoming sessions\n• Access to past recordings\n• Regular updates on new content",
    suggestions: ["Upcoming webinars?", "Register for session", "Past recordings?"]
  },

  // FAQ Information
  faq: {
    keywords: ["faq", "frequently asked", "common questions", "doubts", "clarification"],
    response: "Frequently Asked Questions:\n\nWho is eligible?\n• Students in grades 4-8 with top 15th percentile in any subject\n\nWhat is the exam format?\n• Computer-based test: English, Math, Science (60 minutes each)\n\nWhat are the university benefits?\n• Access to Johns Hopkins CTY, UC Berkeley, Northwestern programs\n\nWhat rewards are available?\n• Bronze (85-89%), Silver (90-94%), Gold (95-99%) scholars get medals + certificates\n\nWhat is the registration fee?\n• 250 AED or equivalent in local currency\n\nWhen are the important dates?\n• Early Bird: November 9, 2025\n• Final Deadline: November 30, 2025\n• Test Window: November 28 - December 1, 2025",
    suggestions: ["Detailed eligibility?", "Exam preparation?", "University partnerships?"]
  },

  // Technical Support
  technical_support: {
    keywords: ["technical", "login", "website", "error", "access", "problem"],
    response: "Technical Support:\n\nWebsite Issues:\n• Clear browser cache and try again\n• Use updated browser versions\n• Check internet connection\n\nLogin Problems:\n• Use registered email address\n• Reset password if needed\n• Contact support for account issues\n\nAQAD Platform Access:\n• Use student credentials\n• Contact support if access issues persist\n\nContact for Technical Help:\n• Email: eitalentsearch@ei.study\n• Phone: +91 80 4718 7451\n• Hours: Monday-Saturday, 9AM-6PM",
    suggestions: ["Contact technical support", "Clear browser cache", "Reset password"]
  }
}

const quickQuestions = [
  "What is ATS program?",
  "How to register for ATS 2025?",
  "When are the exam dates?",
  "Which universities partner with ATS?",
  "What are the rewards and recognition?",
  "What resources are available?",
  "What's the registration fee?",
  "Who is eligible for ATS?",
  "How can I contact support?",
  "What is AQAD platform?",
  "Are there webinars available?",
  "What are the success statistics?"
]

export default function IntelligentChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your comprehensive ATS assistant with detailed knowledge about every aspect of our Academic Talent Search program.\n\nI can help you with:\n• Program details & statistics\n• Exam dates & format\n• University partnerships\n• Rewards structure\n• Fees & registration\n• Resources & AQAD platform\n• Contact information\n• Webinars & support\n\nAsk me anything!",
      isBot: true,
      timestamp: new Date(),
      suggestions: quickQuestions.slice(0, 3)
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const findBestResponse = (userMessage: string): { response: string; suggestions?: string[] } => {
    const lowerMessage = userMessage.toLowerCase()
    
    // Find the best matching knowledge entry
    let bestResponse = ""
    let bestSuggestions: string[] | undefined = undefined
    let highestScore = 0
    
    Object.entries(chatbotKnowledge).forEach(([key, knowledge]) => {
      const score = knowledge.keywords.reduce((acc, keyword) => {
        if (lowerMessage.includes(keyword.toLowerCase())) {
          return acc + keyword.length
        }
        return acc
      }, 0)
      
      if (score > highestScore) {
        highestScore = score
        bestResponse = knowledge.response
        bestSuggestions = knowledge.suggestions
      }
    })
    
    if (bestResponse && highestScore > 0) {
      return {
        response: bestResponse,
        suggestions: bestSuggestions
      }
    }
    
    // Enhanced fallback responses for common interactions
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || lowerMessage.includes('good morning') || lowerMessage.includes('good afternoon')) {
      return {
        response: "Hello! Welcome to ATS (Academic Talent Search). I'm your comprehensive assistant with detailed knowledge about every aspect of our program.\n\nWhat would you like to know about ATS 2025?",
        suggestions: ["What is ATS program?", "Exam dates and format", "Registration process"]
      }
    }
    
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks') || lowerMessage.includes('appreciate')) {
      return {
        response: "You're very welcome! I'm always here to provide detailed information about ATS.\n\nIs there anything else you'd like to know about our program, registration, universities, or resources?",
        suggestions: ["View testimonials", "University partnerships", "Contact support"]
      }
    }
    
    if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye') || lowerMessage.includes('see you')) {
      return {
        response: "Goodbye! Best wishes for your ATS journey.\n\nRemember, you can always reach us for additional support:\n• Email: eitalentsearch@ei.study\n• Phone: +91 80 4718 7451\n\nGood luck!",
        suggestions: ["Register now", "Contact support", "Download resources"]
      }
    }
    
    return {
      response: "I have comprehensive knowledge about every detail of the ATS website and program.\n\nFor specific questions not in my database, please contact our support team:\n• Email: eitalentsearch@ei.study\n• Phone: +91 80 4718 7451\n\nHere are the main topics I can help with:",
      suggestions: quickQuestions.slice(0, 4)
    }
  }

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isBot: false,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI thinking time
    setTimeout(() => {
      const { response, suggestions } = findBestResponse(text)
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isBot: true,
        timestamp: new Date(),
        suggestions
      }

      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000) // Random delay between 1-2 seconds
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-[#850101] hover:bg-[#650101] shadow-lg z-50"
        size="lg"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
    }`}>
      <Card className="h-full shadow-2xl border-2 border-[#850101]">
        <CardHeader className="bg-[#850101] text-white p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <CardTitle className="text-lg">ATS Assistant</CardTitle>
              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                Online
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-[#650101] h-8 w-8 p-0"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-[#650101] h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            <CardContent className="p-0 flex-1 h-[480px]">
              <ScrollArea className="h-full p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                      <div className={`flex items-start gap-2 max-w-[80%] ${message.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.isBot ? 'bg-[#850101] text-white' : 'bg-gray-300 text-gray-700'
                        }`}>
                          {message.isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                        </div>
                        <div className="space-y-2">
                          <div className={`rounded-lg p-3 ${
                            message.isBot 
                              ? 'bg-gray-100 text-gray-800' 
                              : 'bg-[#850101] text-white'
                          }`}>
                            <p className="text-sm whitespace-pre-line">{message.text}</p>
                          </div>
                          {message.suggestions && (
                            <div className="flex flex-wrap gap-2">
                              {message.suggestions.map((suggestion, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSuggestionClick(suggestion)}
                                  className="text-xs h-7 border-[#850101] text-[#850101] hover:bg-[#850101] hover:text-white"
                                >
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#850101] text-white flex items-center justify-center">
                          <Bot className="h-4 w-4" />
                        </div>
                        <div className="bg-gray-100 rounded-lg p-3">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>
            </CardContent>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything about ATS..."
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                  className="flex-1"
                />
                <Button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-[#850101] hover:bg-[#650101]"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  )
} 