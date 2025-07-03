"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"

const faqs = [
  {
    question: "Who is eligible for the ATS exam?",
    answer:
      "Students in grades 4-8 who have scored in the top 15th percentile in any subject (English, Math, or Science) in their school assessments are eligible to take the ATS exam.",
  },
  {
    question: "What is the format of the ATS exam?",
    answer:
      "The ATS exam is a computer-based test covering English, Math, and Science. Each subject has a duration of 60 minutes, making it a comprehensive 3-hour assessment.",
  },
  {
    question: "How are the university partnerships beneficial?",
    answer:
      "Our university partnerships with institutions like Johns Hopkins CTY, UC Berkeley ATDP, and Northwestern CTD provide qualified students with access to advanced academic programs, summer courses, and college preparation opportunities.",
  },
  {
    question: "What rewards can students expect?",
    answer:
      "Students receive recognition based on their performance: Bronze Scholars (85-89 percentile), Silver Scholars (90-94 percentile), and Gold Scholars (95-99 percentile). All participants receive certificates, and scholars receive medals.",
  },
  {
    question: "When is the registration deadline?",
    answer:
      "Early bird registration is available until November 9, 2025, with the final registration deadline on November 30, 2025. The test window is November 28 - December 1, 2025.",
  },
  {
    question: "What is the registration fee?",
    answer:
      "The registration fee is 250 AED or equivalent in local currency. This fee covers the comprehensive assessment and all associated materials.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600">Get answers to common questions about the ATS program</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="border border-gray-200">
              <CardContent className="p-0">
                <button
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFAQ(index)}
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-[#850101] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-[#850101] flex-shrink-0" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
