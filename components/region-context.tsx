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
  const [isLoading, setIsLoading] = useState(true)

  // read from localStorage on mount (client only)
  useEffect(() => {
    try {
      const stored = typeof window !== "undefined" ? localStorage.getItem("ats_region") : null
      console.log("Loading region from localStorage:", stored)
      if (stored === "IND" || stored === "INT") {
        console.log("Setting region to stored value:", stored)
        setRegion(stored)
      } else {
        // Default to IND without IP lookup to avoid chunk loading issues
        console.log("No stored region, defaulting to IND")
        setRegion("IND")
        localStorage.setItem("ats_region", "IND")
      }
      setIsLoading(false)
    } catch (error) {
      console.log("Region detection error, defaulting to IND:", error)
      setRegion("IND")
      setIsLoading(false)
    }
  }, [])

  // Debug region changes
  useEffect(() => {
    console.log("Region changed to:", region)
  }, [region])

  const toggleRegion = () => {
    console.log("Toggle region called, current region:", region)
    setRegion((prev) => {
      const next = prev === "IND" ? "INT" : "IND"
      console.log("Switching from", prev, "to", next)
      if (typeof window !== "undefined") {
        localStorage.setItem("ats_region", next)
        console.log("Saved to localStorage:", next)
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