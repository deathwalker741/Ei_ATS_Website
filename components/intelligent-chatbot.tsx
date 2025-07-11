"use client"

import React, { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, X, Bot, User, Loader2, Star, BarChart3 } from "lucide-react"
import { chatStorage, saveChatMessage, getChatHistory, endChatSession, clearChatData } from "@/lib/chat-storage"
import type { ChatMessage } from "@/lib/chat-storage"

interface Props {
  open: boolean
  onOpenChange: (o: boolean) => void
}

// Create a comprehensive knowledge base from website content
const createKnowledgeBase = () => {
  return `You are an intelligent assistant EXCLUSIVELY for Ei ATS (Educational Initiatives Academic Talent Search). You can ONLY answer questions related to Ei ATS content and information.

STRICT GUIDELINES:
- ONLY answer questions about Ei ATS, registration, exams, universities, programmes, eligibility, dates, fees, or contact information
- If asked about ANYTHING unrelated to Ei ATS, politely decline and redirect to Ei ATS topics
- Do NOT answer general questions about education, other programmes, personal advice, or any non-Ei ATS topics
- Do NOT provide information outside your knowledge base below

KEY EI ATS INFORMATION:

TEST DETAILS & DATES:
- India 2025: November 28-30, 2025
- International (UAE & GCC) 2025: March 25-29, 2025
- Format: Online proctored test, 60 minutes per subject
- Subjects: English, Maths, Science (choose 1, 2, or all 3)
- Level: Two grades above student's current level
- No preparation required, no negative marking

ELIGIBILITY:
- Grades 4-8 students who score in top 15 percentile in ASSET test
- OR attain Stanine 9 in CAT4

FEES:
- India: INR 1700 (early), INR 2700 (late) for 1 subject; INR 2200-3300 for 2-3 subjects
- International: AED 170-250 per subject (Late fee: AED 300)

REGISTRATION DEADLINES (International 2025):
- Early Registration: Until March 16, 2025
- Regular Registration: Until March 23, 2025
- Late Registration: Until March 28, 2025

RECOGNITION & AWARDS:
- Bronze Scholar (85-89%): Certificate + Medal
- Silver Scholar (90-94%): Certificate + Medal  
- Gold Scholar (95-99%): Certificate + Medal
- Top grade toppers: Eligible for iPads, tablets, Kindles, Apple Watches

UNIVERSITY PARTNERS: Johns Hopkins CTY, UC Berkeley ATDP, Northwestern CTD, Purdue GER2I, SIG, GenWise

CONTACT:
- India: eitalentsearch@ei.study, +91 80 4718 7451
- International: atsinternational@ei.study
- Website: www.ats.ei.study

RESPONSE RULES:
- For Ei ATS questions: Provide detailed, helpful answers using the knowledge base
- For non-Ei ATS questions: Say "I'm specifically designed to help with Ei ATS questions only. Could you ask me something about our Academic Talent Search programme, registration, exams, or university partnerships instead?"
- Always stay focused on Ei ATS content
- Be professional, encouraging, and supportive about the Ei ATS programme

Remember: You ONLY discuss Ei ATS. Redirect all other topics back to Ei ATS-related questions.`;
}

const SYSTEM_PROMPT = createKnowledgeBase();

export default function IntelligentChatbot({ open, onOpenChange }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [userRating, setUserRating] = useState<number | null>(null)
  const [showRating, setShowRating] = useState(true)
  const logRef = useRef<HTMLDivElement>(null)

  // Initialize with welcome message and load history
  useEffect(() => {
    const initializeChat = async () => {
      // Load chat history
      try {
        const history = await getChatHistory(20)
        if (history.length > 0) {
          setMessages(history)
        } else {
          // Set welcome message if no history
          setMessages([{
            id: 'welcome',
            text: "Hello! I'm your intelligent Ei ATS assistant. I can help you with questions about our Academic Talent Search programme, registration process, exam details, university partnerships, and much more. What would you like to know?",
            isBot: true,
            timestamp: new Date()
          }])
        }
      } catch (error) {
        console.warn('Failed to load chat history:', error)
        // Fallback to welcome message
        setMessages([{
          id: 'welcome',
          text: "Hello! I'm your intelligent Ei ATS assistant. How can I help you today?",
          isBot: true,
          timestamp: new Date()
        }])
      }
    }

    if (open) {
      initializeChat()
    }
  }, [open])

  useEffect(() => {
    if (open) setTimeout(() => logRef.current?.scrollIntoView({ behavior: "smooth" }), 100)
  }, [messages, open])

  const addMessage = (msg: ChatMessage) => {
    setMessages((m) => [...m, msg])
    // Save to storage
    saveChatMessage(msg).catch(error => {
      console.warn('Failed to save message:', error)
    })
  }

  const callAI = async (userMessage: string): Promise<string> => {
    const startTime = Date.now()
    
    try {
      // Build conversation context
      const recentMessages = messages
        .slice(-6) // Last 6 messages for context
        .map(m => ({
          role: m.isBot ? "assistant" : "user",
          content: m.text
        }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...recentMessages,
            { role: "user", content: userMessage }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }

      const data = await response.json();
      const responseTime = Date.now() - startTime
      
      // Add response time metadata to the response
      if (data.response) {
        return data.response;
      }
      
      return "I'm sorry, I couldn't process that request. Please try again.";
    } catch (error) {
      console.warn('AI API Error:', error)
      return "I'm experiencing some technical difficulties right now. For immediate assistance, please contact our support team at eitalentsearch@ei.study or call +91 80 4718 7451.";
    }
  }

  const send = async () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return

    const startTime = Date.now()

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: trimmed,
      isBot: false,
      timestamp: new Date()
    }
    addMessage(userMessage)
    setInput("")
    setIsLoading(true)

    try {
      // Get AI response
      const aiResponse = await callAI(trimmed)
      const responseTime = Date.now() - startTime
      
      // Add bot response with metadata
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isBot: true,
        timestamp: new Date(),
        metadata: {
          responseTime,
          confidence: 0.95 // You could implement actual confidence scoring
        }
      }
      addMessage(botMessage)
    } catch (error) {
      console.warn('Error getting AI response:', error)
      addMessage({
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm having trouble connecting right now. Please contact our support team directly at eitalentsearch@ei.study for immediate assistance.",
        isBot: true,
        timestamp: new Date()
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRating = (rating: number) => {
    setUserRating(rating)
    setShowRating(false)
    endChatSession(rating)
  }

  const dismissRating = () => {
    setShowRating(false)
  }

  const clearChat = () => {
    setMessages([{
      id: 'welcome-new',
      text: "Hello! I'm your intelligent Ei ATS assistant. How can I help you today?",
      isBot: true,
      timestamp: new Date()
    }])
    setUserRating(null)
    setShowRating(true)
    clearChatData()
  }

  const handleClose = () => {
    // End session when closing
    if (userRating) {
      endChatSession(userRating)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] flex flex-col h-[80vh]">
        <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-[#850101]" />
            <DialogTitle className="text-lg font-semibold">Ei ATS AI Assistant</DialogTitle>
            {/* Removed session number from header */}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearChat}
              className="text-xs"
            >
              Clear Chat
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4" aria-live="polite">
                  {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.isBot ? 'justify-start' : 'justify-end'}`}
            >
              {message.isBot && (
                <div className="w-8 h-8 rounded-full bg-[#850101] flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                        </div>
              )}
              <div className={`max-w-[80%] rounded-lg px-3 py-2 ${
                            message.isBot 
                  ? 'bg-gray-100 text-gray-900' 
                              : 'bg-[#850101] text-white'
                          }`}>
                <div className="text-sm whitespace-pre-wrap">{message.text}</div>
                <div className="text-xs opacity-70 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString()}
                  {/* Removed response time (xxx ms) from message UI */}
                </div>
                      </div>
              {!message.isBot && (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
              )}
                    </div>
                  ))}
                  
          {isLoading && (
            <div className="flex justify-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#850101] flex items-center justify-center">
                <Loader2 className="h-4 w-4 text-white animate-spin" />
                        </div>
              <div className="bg-gray-100 rounded-lg px-3 py-2">
                <div className="text-sm text-gray-600">AI is thinking...</div>
                          </div>
                        </div>
          )}
          <div ref={logRef} />
        </div>

        {/* Rating Section */}
        {messages.length > 2 && !userRating && showRating && (
          <div className="p-3 bg-blue-50 border-t">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">How helpful was this conversation?</div>
              <Button
                variant="ghost"
                size="sm"
                onClick={dismissRating}
                className="h-6 w-6 p-0 hover:bg-gray-200"
                aria-label="Dismiss rating"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRating(rating)}
                  className="p-1"
                >
                  <Star className="h-4 w-4" />
                </Button>
              ))}
            </div>
          </div>
        )}

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about Ei ATS..."
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
              disabled={isLoading}
                  className="flex-1"
                />
                <Button
              onClick={send}
              disabled={isLoading || !input.trim()}
              size="icon"
                  className="bg-[#850101] hover:bg-[#650101]"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
          <div className="text-xs text-gray-500 mt-2 text-center">
            Chat history is automatically saved. Database: {chatStorage.isDatabaseEnabled() ? '✅' : '❌'}
            </div>
    </div>
      </DialogContent>
    </Dialog>
  )
} 