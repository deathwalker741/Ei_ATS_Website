import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import IntelligentChatbot from "@/components/intelligent-chatbot"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ei ASSET Talent Search - Identifying Gifted Students Globally",
  description:
    "Educational Initiatives' comprehensive platform for identifying and nurturing academically gifted students through rigorous assessment and world-class educational opportunities.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <Header />
        {children}
        <Footer />
        <IntelligentChatbot />
      </body>
    </html>
  )
}
