"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, Clock, MapPin, Send } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
    // You can add actual form submission logic here
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      details: "eitalentsearch@ei.study",
      description: "Send us your questions anytime",
    },
    {
      icon: Phone,
      title: "Phone",
      details: "+91 80 4718 7451",
      description: "Call us for immediate assistance",
    },
    {
      icon: Clock,
      title: "Working Hours",
      details: "Mon-Sat, 9 AM – 6 PM IST",
      description: "We're here to help during business hours",
    },
    {
      icon: MapPin,
      title: "Location",
      details: "Bengaluru, India",
      description: "Educational Initiatives Pvt Ltd",
    },
  ]

  const faqs = [
    {
      question: "When is the registration deadline?",
      answer: "Early bird registration ends November 9, 2025. Final deadline is November 30, 2025.",
    },
    {
      question: "What is the exam format?",
      answer: "Online computer-based test with English, Math, and Science (60 minutes each).",
    },
    {
      question: "Who is eligible for ATS?",
      answer: "Students in grades 4-8 who scored in the top 15th percentile in any subject.",
    },
    {
      question: "How can I access my results?",
      answer: "Results are available through the student portal using your PAN ID.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#850101] to-[#650101] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-gray-100 max-w-3xl mx-auto">
            Have questions about ATS 2025? We're here to help you navigate your academic journey. Reach out to our
            expert team for guidance and support.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Multiple ways to reach us for all your ATS-related queries
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-[#850101] rounded-full flex items-center justify-center mx-auto mb-4">
                    <info.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-[#850101] mb-2">{info.title}</h3>
                  <p className="text-gray-900 font-semibold mb-2">{info.details}</p>
                  <p className="text-gray-600 text-sm">{info.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and FAQ */}
      <section id="send-message" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="border-gray-300 focus:border-[#850101] focus:ring-[#850101]"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="border-gray-300 focus:border-[#850101] focus:ring-[#850101]"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          className="border-gray-300 focus:border-[#850101] focus:ring-[#850101]"
                        />
                      </div>
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                          Subject *
                        </label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          className="border-gray-300 focus:border-[#850101] focus:ring-[#850101]"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        rows={6}
                        required
                        value={formData.message}
                        onChange={handleChange}
                        className="border-gray-300 focus:border-[#850101] focus:ring-[#850101]"
                        placeholder="Please describe your question or concern in detail..."
                      />
                    </div>

                    <Button type="submit" className="w-full bg-[#850101] hover:bg-[#650101] text-white">
                      Send Message <Send className="h-4 w-4 ml-2" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* FAQ Section */}
            <div id="faq">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <Card key={index} className="border border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-lg text-[#850101]">{faq.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="mt-8 bg-[#850101] text-white border-0">
                <CardContent className="p-8 text-center">
                  <h3 className="text-xl font-bold mb-4">Need Immediate Help?</h3>
                  <p className="mb-6">Call us directly during business hours for immediate assistance</p>
                  <Button className="bg-white text-[#850101] hover:bg-gray-100">
                    <Phone className="h-4 w-4 mr-2" />
                    +91 80 4718 7451
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Office Information */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Office</h2>
            <p className="text-xl text-gray-600">Educational Initiatives Pvt Ltd</p>
          </div>

          <Card className="max-w-4xl mx-auto border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-xl font-bold text-[#850101] mb-4">Office Details</h3>
                  <div className="space-y-3">
                    <p className="text-gray-700">
                      <strong>Address:</strong> The CUBE - Karle Town Center, Bengaluru, India
                    </p>
                    <p className="text-gray-700">
                      <strong>CIN:</strong> U80211GJ2000PTC038692103
                    </p>
                    <p className="text-gray-700">
                      <strong>Email:</strong> eitalentsearch@ei.study
                    </p>
                    <p className="text-gray-700">
                      <strong>Phone:</strong> +91 80 4718 7451
                    </p>
                    <p className="text-gray-700">
                      <strong>Hours:</strong> Monday - Saturday, 9:00 AM - 6:00 PM IST
                    </p>
                  </div>
                </div>
                <div>
                  <img
                    src="/ei-image.png"
                    alt="Educational Initiatives Office"
                    className="rounded-lg shadow-md w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#850101] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Begin Your ATS Journey?</h2>
          <p className="text-xl text-gray-200 mb-8">
            Don't wait! Register now for ATS 2025 and unlock your academic potential
          </p>
          <Button size="lg" className="bg-white text-[#850101] hover:bg-gray-100 font-semibold" asChild>
            <a href="https://ats.ei.study/ats_registration.php" target="_blank" rel="noopener noreferrer">
              Register for ATS 2025
            </a>
          </Button>
        </div>
      </section>
    </div>
  )
}
