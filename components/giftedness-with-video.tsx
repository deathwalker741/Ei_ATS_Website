"use client"

import { useState } from "react"

export function GiftednessWithVideo() {
  const [videoError, setVideoError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleVideoError = () => {
    setVideoError(true)
    setIsLoading(false)
  }

  const handleVideoLoad = () => {
    setIsLoading(false)
  }

  return (
    <section id="giftedness" className="py-10 bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center animate-fade-in-up">
          {/* Giftedness Copy */}
          <div>
            <h2 className="text-4xl font-bold mb-6 text-hover-glow">
              Importance of Nurturing Giftedness
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-gray-800 bg-white/70 backdrop-blur-md border border-gray-200 shadow-professional-lg rounded-2xl p-6">
              Giftedness, as defined by psychologist <strong className="text-[#850101]">Joseph Renzulli</strong>, combines above-average ability, creativity, and task commitment. Contrary to the myth that gifted students thrive without help, they often face social, emotional, and academic challenges needing specialised support. Investing in gifted education yields significant returns—each <strong className="text-[#850101]">IIT</strong> graduate, selected through such nurturing, generates around <strong className="text-[#850101]">100 jobs</strong>, and <strong className="text-[#850101]">54%</strong> of India's top 500 companies have IIT alumni on their boards. Globally, gifted programmes have produced leaders in science, technology, and the arts. Identifying and supporting the top 1–2% talent in early adolescence is essential for national progress.
            </p>
          </div>

          {/* SRR Video */}
          <div className="flex flex-col items-center gap-4">
            {videoError ? (
              <div className="w-full max-w-[200px] md:max-w-[260px] lg:max-w-[300px] h-32 bg-gray-100 rounded-xl shadow-professional-lg flex items-center justify-center">
                <div className="text-center p-4">
                  <div className="text-gray-500 text-sm mb-1">Video unavailable</div>
                  <div className="text-xs text-gray-400">
                    Check back later
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative">
                {isLoading && (
                  <div className="absolute inset-0 bg-gray-100 rounded-xl flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#850101]"></div>
                  </div>
                )}
                <video
                  src="/media/SRR.mp4"
                  controls
                  className="w-full max-w-[200px] md:max-w-[260px] lg:max-w-[300px] rounded-xl shadow-professional-lg bg-black"
                  preload="metadata"
                  onError={handleVideoError}
                  onLoadedData={handleVideoLoad}
                  onCanPlay={handleVideoLoad}
                />
              </div>
            )}
            <h3 className="text-lg md:text-xl font-semibold text-center leading-snug">
              Listen to <span className="text-[#850101] font-bold">Sridhar Rajagopalan</span>,<br />
              Co-founder of Educational Initiatives,<br />
              Explains why discovering and supporting gifted students is crucial.
            </h3>
          </div>
        </div>
      </div>
    </section>
  )
} 