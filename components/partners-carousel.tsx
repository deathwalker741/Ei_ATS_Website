"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"

const partners = [
  {
    name: "Johns Hopkins Center for Talented Youth (CTY)",
    description: "Programs for grades 2-12 with online and campus-based courses",
    eligibility: "98th percentile in English/Math",
    image: "/John-Hopkins-CTY.png",
    id: "johns-hopkins",
  },
  {
    name: "UC Berkeley ATDP",
    description: "Summer residential program and college preparation for grades 7-10",
    eligibility: "80%+ priority, 50-79% with portfolio",
    image: "/UC Berkeley ATDP.png",
    id: "uc-berkeley",
  },
  {
    name: "Northwestern University CTD",
    description: "Programs for children age 3-12 with online and residential options",
    eligibility: "90%+ direct, <90% with portfolio",
    image: "/Northwestern CTD.png",
    id: "northwestern",
  },
  {
    name: "Purdue University GER²I",
    description: "COMET, STAR & PULSAR programs for grades 5-12",
    eligibility: "90%+ direct, 50-89% with portfolio",
    image: "/Purdue GERI.png",
    id: "purdue",
  },
  {
    name: "Summer Institute for the Gifted (SIG)",
    description: "2-3 week residential programs at top universities, ages 5-17",
    eligibility: "90th percentile",
    image: "/sig.jpg",
    id: "sig",
  },
  {
    name: "GENWISE Programme",
    description: "Focus on computational thinking, math puzzles and science investigations",
    eligibility: "Higher-order skill development",
    image: "/genwise.png",
    id: "genwise",
  },
]

export function PartnersCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const partnersPerSlide = 3
  const totalSlides = Math.ceil(partners.length / partnersPerSlide)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  // Auto-advance slides every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide()
    }, 6000)
    return () => clearInterval(timer)
  }, [totalSlides])

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const getCurrentPartners = () => {
    const start = currentSlide * partnersPerSlide
    return partners.slice(start, start + partnersPerSlide)
  }

  return (
    <section id="partners" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-hover-glow">University Partners</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access world-class educational opportunities through our prestigious university partnerships
          </p>
        </div>

        <div className="relative">
          <div className="grid md:grid-cols-3 gap-4">
            {getCurrentPartners().map((partner, index) => (
              <Card
                key={index}
                id={partner.id}
                className="card-hover group shadow-professional hover:shadow-professional-xl transition-all duration-500 border-0 overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <img
                      src={partner.image || "/placeholder.svg"}
                      alt={partner.name}
                      className="w-full h-32 object-contain bg-white transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                      <ExternalLink className="h-5 w-5 text-white" />
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-base font-semibold text-[#850101] mb-2 transition-all duration-300 group-hover:text-[#650101] text-hover-glow">
                      {partner.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 transition-colors duration-300 group-hover:text-gray-800">
                      {partner.description}
                    </p>
                    <div className="bg-gray-50 p-2 rounded-lg transition-all duration-300 group-hover:bg-[#850101]/5 group-hover:border group-hover:border-[#850101]/20">
                      <p className="text-xs font-medium text-gray-700 transition-colors duration-300 group-hover:text-[#850101]">
                        <span className="text-[#850101] font-semibold">Eligibility:</span> {partner.eligibility}
                      </p>
                    </div>
                    <div className="mt-3">
                      <Button
                        variant="outline"
                        className="w-full border-[#850101] text-xs text-[#850101] hover:bg-[#850101] hover:text-white btn-hover-lift transition-all duration-300 group-hover:shadow-lg"
                        asChild
                      >
                        <a href={`/programmes#${partner.id}`}>
                          Read More
                          <ExternalLink className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Navigation Arrows */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white border-[#850101] text-[#850101] hover:bg-[#850101] hover:text-white btn-hover-lift shadow-professional transition-all duration-300"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white border-[#850101] text-[#850101] hover:bg-[#850101] hover:text-white btn-hover-lift shadow-professional transition-all duration-300"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Slide Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                  index === currentSlide ? "bg-[#850101] animate-glow" : "bg-gray-300 hover:bg-[#850101]/60"
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
