"use client"

import React from "react"
import { useRegion } from "@/components/region-context"

const regionMessages = {
  IND: [
    "Early Registration Close Date: Sunday, 2 Nov, 2025",
    "Regular Registration Close Date: Sunday, 23 Nov, 2025",
    "Late Registration Close Date: Sunday, 30 Nov, 2025",
    "Test Dates: Friday, 28 Nov – Monday, 1 Dec, 2025",
  ],
  INT: [
    "Early Registration Close Date: Sunday, 16 Mar, 2025",
    "Regular Registration Close Date: Sunday, 23 Mar, 2025",
    "Late Registration Close Date: Friday, 28 Mar, 2025",
    "Test Dates: Tuesday, 25 Mar – Saturday, 29 Mar, 2025",
  ],
} as const

export default function NotificationBar() {
  const { region } = useRegion()
  const messages = React.useMemo(() => {
    if (region === "INT") {
      return regionMessages.INT.map((m) => m.replace(/November/g, "March"))
    }
    return regionMessages[region] || []
  }, [region])
  return (
    <div className="bg-[#650101] text-white overflow-hidden whitespace-nowrap fixed top-16 left-0 right-0 z-40 h-8 flex items-center">
      <div className="inline-block animate-[marquee_25s_linear_infinite] px-4">
        <span className="font-semibold mr-4">Important Dates:</span>
        {messages.map((msg, idx) => (
          <span key={idx} className="mr-10">
            {msg}
          </span>
        ))}
      </div>
    </div>
  )
} 