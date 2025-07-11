"use client"

export function SrrVideoSection() {
  return (
    <section id="srr-video" className="py-10 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900 md:w-1/2 leading-snug">
            Listen to <span className="text-[#850101] font-bold">Sridhar Rajagopalan</span>,<br />
            Co-founder of Educational Initiatives,<br />
            Explains why discovering and supporting gifted students is crucial.
          </h3>

          <div className="md:w-1/2 w-full flex justify-center">
            <video
              src="/media/SRR.mp4"
              controls
              className="w-full max-w-xs md:max-w-sm lg:max-w-md rounded-xl shadow-professional-lg bg-black"
              preload="metadata"
            />
          </div>
        </div>
      </div>
    </section>
  )
} 