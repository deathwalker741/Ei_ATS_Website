"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Parent",
    location: "Dubai, UAE",
    content:
      "ATS helped identify my daughter's exceptional abilities in mathematics. The program opened doors to Johns Hopkins CTY, which has been transformative for her academic growth.",
    rating: 5,
  },
  {
    name: "Dr. Michael Chen",
    role: "School Principal",
    location: "Singapore",
    content:
      "We've been partnering with ATS for 3 years. Their assessment is comprehensive and the university partnerships provide our gifted students with unparalleled opportunities.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Student",
    location: "Mumbai, India",
    content:
      "Being recognized as a Gold Scholar through ATS was life-changing. I'm now part of the UC Berkeley ATDP program and couldn't be more grateful for this opportunity.",
    rating: 5,
  },
  {
    name: "James Wilson",
    role: "Parent",
    location: "London, UK",
    content:
      "The detailed assessment report helped us understand our son's strengths better. The guidance for university programs has been invaluable for his academic journey.",
    rating: 5,
  },
]

export function TestimonialsCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Community Says</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from parents, students, and educators who have experienced the ATS difference
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <Card className="border-0 shadow-xl">
            <CardContent className="p-12">
              <Quote className="h-12 w-12 text-[#850101] mb-6 mx-auto" />
              <blockquote className="text-xl text-gray-700 text-center mb-8 leading-relaxed">
                "{testimonials[currentSlide].content}"
              </blockquote>
              <div className="text-center">
                <h4 className="font-bold text-[#850101] text-lg">{testimonials[currentSlide].name}</h4>
                <p className="text-gray-600">
                  {testimonials[currentSlide].role} • {testimonials[currentSlide].location}
                </p>
                <div className="flex justify-center mt-4">
                  {Array.from({ length: testimonials[currentSlide].rating }).map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Arrows */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 bg-white border-[#850101] text-[#850101] hover:bg-[#850101] hover:text-white"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 bg-white border-[#850101] text-[#850101] hover:bg-[#850101] hover:text-white"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Slide Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? "bg-[#850101]" : "bg-gray-300"
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
