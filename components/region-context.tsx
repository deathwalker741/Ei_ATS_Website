"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

type Region = "IND" | "INT"

interface RegionContextValue {
  region: Region
  toggleRegion: () => void
}

const RegionContext = createContext<RegionContextValue | undefined>(undefined)

export function RegionProvider({ children }: { children: React.ReactNode }) {
  const [region, setRegion] = useState<Region>("IND")

  // read from localStorage on mount (client only)
  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("ats_region") : null
    if (stored === "IND" || stored === "INT") {
      setRegion(stored)
    } else {
      // Auto-detect via IP lookup (runs once on first load)
      fetch("https://ipapi.co/json/")
        .then((res) => res.ok ? res.json() : null)
        .then((data) => {
          if (!data) return
          const countryCode = data.country_code as string | undefined
          if (countryCode && countryCode.toUpperCase() !== "IN") {
            setRegion("INT")
            localStorage.setItem("ats_region", "INT")
          }
        })
        .catch(() => {})
    }
  }, [])

  const toggleRegion = () => {
    setRegion((prev) => {
      const next = prev === "IND" ? "INT" : "IND"
      if (typeof window !== "undefined") {
        localStorage.setItem("ats_region", next)
      }
      return next
    })
  }

  return (
    <RegionContext.Provider value={{ region, toggleRegion }}>
      {children}
    </RegionContext.Provider>
  )
}

export function useRegion() {
  const ctx = useContext(RegionContext)
  if (!ctx) throw new Error("useRegion must be used within RegionProvider")
  return ctx
} 