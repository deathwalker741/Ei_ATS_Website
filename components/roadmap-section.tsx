"use client"

import React from "react"
import { useRegion } from "@/components/region-context"

export const RoadmapSection = () => {
  const { region } = useRegion()
  const imgSrc = region === "INT" ? "/media/ATS-journey-INT.png" : "/ats-journey-2025.jpg"
  return (
    <section id="roadmap" className="py-20 bg-[#FFF7F7] relative overflow-x-auto">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <svg width="100%" height="100%" preserveAspectRatio="none" className="opacity-20">
          <defs>
            <pattern id="bg-lines" width="200" height="200" patternUnits="userSpaceOnUse">
              <path d="M0 200 Q100 100 200 200" fill="none" stroke="#e5e5e5" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#bg-lines)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <img
          src={imgSrc}
          alt="Ei ATS Roadmap"
          className="w-full h-auto rounded-lg shadow-lg"
        />
      </div>
    </section>
  )
} 