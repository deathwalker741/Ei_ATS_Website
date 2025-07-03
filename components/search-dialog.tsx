"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

// Define the structure for search results
interface SearchResult {
  title: string
  description: string
  url: string
  type: "page" | "section" | "content" | "resource" | "partner" | "feature"
  category?: string
}

// Comprehensive website content for search
const websiteContent: SearchResult[] = [
  // Home Page Content
  {
    title: "Home",
    description: "Main page of Ei ASSET Talent Search",
    url: "/",
    type: "page",
  },
  {
    title: "Is Your Child Academically Gifted?",
    description: "Find out by enrolling your child for the Ei ASSET Talent Search 2025",
    url: "/#hero",
    type: "section",
    category: "Hero",
  },
  {
    title: "Ei ASSET Talent Search 2025",
    description: "Educational Initiatives' talent identification program",
    url: "/#hero",
    type: "content",
    category: "Program",
  },
  {
    title: "Register Now",
    description: "Registration for Ei ASSET Talent Search 2025",
    url: "/#hero",
    type: "content",
    category: "Registration",
  },
  {
    title: "1000+ Alumni from 100+ schools",
    description: "Statistics about our global alumni network",
    url: "/#about",
    type: "content",
    category: "Statistics",
  },
  {
    title: "100+ Courses delivered",
    description: "Number of courses delivered through our programs",
    url: "/#about",
    type: "content",
    category: "Statistics",
  },
  {
    title: "15+ Years of excellence",
    description: "Years of experience in talent identification",
    url: "/#about",
    type: "content",
    category: "Statistics",
  },
  // Media Carousel Content
  {
    title: "Ei ASSET identifies top 2% of talented students",
    description: "Media showcase of exceptional students and their journey",
    url: "/#media-carousel",
    type: "section",
    category: "Media",
  },
  {
    title: "Success Stories Videos",
    description: "Video testimonials and success stories from top performers",
    url: "/#media-carousel",
    type: "content",
    category: "Media",
  },
  {
    title: "Student Achievement Gallery",
    description: "Photos and videos of student achievements and ceremonies",
    url: "/#media-carousel",
    type: "content",
    category: "Media",
  },
  {
    title: "University Partnership Videos",
    description: "Videos showcasing university partnership programs",
    url: "/#media-carousel",
    type: "content",
    category: "Media",
  },

  // University Partners
  {
    title: "Johns Hopkins Center for Talented Youth",
    description: "CTY - Programs for grades 2-12 with online and campus-based courses",
    url: "/programmes#johns-hopkins",
    type: "partner",
    category: "University Partner",
  },
  {
    title: "Johns Hopkins CTY",
    description: "World-renowned programs for academically gifted students - 98th percentile requirement",
    url: "/programmes#johns-hopkins",
    type: "partner",
    category: "University Partner",
  },
  {
    title: "UC Berkeley ATDP",
    description: "Academic Talent Development Program - Summer residential and online programs",
    url: "/programmes#uc-berkeley",
    type: "partner",
    category: "University Partner",
  },
  {
    title: "UC Berkeley Academic Talent Development Program",
    description: "College preparation for grades 7-10 - 80%+ priority admission, 50-79% with portfolio",
    url: "/programmes#uc-berkeley",
    type: "partner",
    category: "University Partner",
  },
  {
    title: "Northwestern University CTD",
    description: "Center for Talent Development - Programs for children age 3-12",
    url: "/programmes#northwestern",
    type: "partner",
    category: "University Partner",
  },
  {
    title: "Northwestern CTD",
    description: "Online and residential options for gifted children - 90%+ direct admission, <90% with portfolio",
    url: "/programmes#northwestern",
    type: "partner",
    category: "University Partner",
  },
  {
    title: "Purdue University GER²I",
    description: "Gifted Education Research Institute - COMET, STAR & PULSAR programs",
    url: "/programmes#purdue",
    type: "partner",
    category: "University Partner",
  },
  {
    title: "Purdue GER2I",
    description: "Programs for grades 5-12 with STEM focus",
    url: "/programmes#purdue",
    type: "partner",
    category: "University Partner",
  },
  {
    title: "Summer Institute for the Gifted",
    description: "SIG - 2-3 week residential programs at top universities",
    url: "/programmes#sig",
    type: "partner",
    category: "University Partner",
  },
  {
    title: "SIG",
    description: "Intensive residential programs for ages 5-17",
    url: "/programmes#sig",
    type: "partner",
    category: "University Partner",
  },
  {
    title: "GENWISE Programme",
    description: "Focus on computational thinking, math puzzles and science investigations",
    url: "/programmes#genwise",
    type: "partner",
    category: "University Partner",
  },
  {
    title: "GenWise",
    description: "Higher-order skill development program",
    url: "/programmes#genwise",
    type: "partner",
    category: "University Partner",
  },

  // Rewards Structure
  {
    title: "Participation Certificate",
    description: "Certificate for all participants in Ei ASSET Talent Search",
    url: "/#rewards",
    type: "content",
    category: "Rewards",
  },
  {
    title: "Bronze Scholar",
    description: "85-89 Percentile - Medal + Certificate recognition",
    url: "/#rewards",
    type: "content",
    category: "Rewards",
  },
  {
    title: "Silver Scholar",
    description: "90-94 Percentile - Medal + Certificate recognition",
    url: "/#rewards",
    type: "content",
    category: "Rewards",
  },
  {
    title: "Gold Scholar",
    description: "95-99 Percentile - Medal + Certificate recognition",
    url: "/#rewards",
    type: "content",
    category: "Rewards",
  },

  // Exam Information
  {
    title: "Online test at home",
    description: "Take the Ei ASSET exam from the comfort of your home",
    url: "/#exam-info",
    type: "content",
    category: "Exam",
  },
  {
    title: "English Math Science",
    description: "Subjects covered in the exam - 60 minutes each",
    url: "/#exam-info",
    type: "content",
    category: "Exam",
  },
  {
    title: "Grades 4 to 8",
    description: "Eligibility criteria - top 15 percentile in any subject",
    url: "/#exam-info",
    type: "content",
    category: "Exam",
  },
  {
    title: "November 28 December 1 2025",
    description: "Test window for Ei ASSET Talent Search 2025",
    url: "/#exam-info",
    type: "content",
    category: "Exam",
  },
  {
    title: "Early Bird Deadline November 9",
    description: "Early bird registration deadline",
    url: "/#exam-info",
    type: "content",
    category: "Registration",
  },
  {
    title: "Final Registration Deadline November 30",
    description: "Final deadline for registration",
    url: "/#exam-info",
    type: "content",
    category: "Registration",
  },

  // Pages
  {
    title: "Programmes",
    description: "University partner programmes and opportunities",
    url: "/programmes",
    type: "page",
  },
  {
    title: "For Students",
    description: "Student resources, portal access, and tools",
    url: "/for-students",
    type: "page",
  },
  {
    title: "For Schools",
    description: "School administration tools and resources",
    url: "/for-schools",
    type: "page",
  },
  {
    title: "Resources",
    description: "Educational resources, webinars, and support materials",
    url: "/resources",
    type: "page",
  },
  {
    title: "Contact",
    description: "Contact information and support",
    url: "/contact",
    type: "page",
  },

  // Student Resources
  {
    title: "Student Portal",
    description: "Access your personalized dashboard and test results",
    url: "/for-students#student-tools",
    type: "resource",
    category: "Student Tools",
  },
  {
    title: "PAN ID Retriever",
    description: "Retrieve your unique PAN ID for registration and access using ASSET PAN GPT tool",
    url: "https://learn.lab-ei.study/asset/ATS/ASSET_PAN/asset_pan_gpt/forgot_asset_pan.html",
    type: "resource",
    category: "Student Tools",
  },
  {
    title: "ASSET PAN GPT",
    description: "AI-powered tool to retrieve your ASSET PAN ID",
    url: "https://learn.lab-ei.study/asset/ATS/ASSET_PAN/asset_pan_gpt/forgot_asset_pan.html",
    type: "resource",
    category: "Student Tools",
  },
  {
    title: "Certificate Downloader",
    description: "Download your official certificates and awards",
    url: "/for-students#student-tools",
    type: "resource",
    category: "Student Tools",
  },
  {
    title: "Awards Recognition",
    description: "View winners list and achievement gallery",
    url: "/for-students#student-tools",
    type: "resource",
    category: "Student Tools",
  },

  // School Resources
  {
    title: "Bulk Registration Tool",
    description: "Register multiple students efficiently and save 10% on registration costs",
    url: "/for-schools#bulk-registration",
    type: "resource",
    category: "School Tools",
  },
  {
    title: "School Admin Login",
    description: "Secure login portal for school administrators",
    url: "/for-schools/login",
    type: "resource",
    category: "School Tools",
  },
  {
    title: "School Dashboard",
    description: "View registration statistics and year-over-year comparisons",
    url: "/for-schools/dashboard",
    type: "resource",
    category: "School Tools",
  },
  {
    title: "Student Management",
    description: "View and manage all registered students with detailed information",
    url: "/for-schools/students",
    type: "resource",
    category: "School Tools",
  },
  {
    title: "Results Qualifiers",
    description: "Download performance reports and qualification lists",
    url: "/for-schools#school-tools",
    type: "resource",
    category: "School Tools",
  },
  {
    title: "School Portal System",
    description: "Comprehensive school administration and student management system",
    url: "/for-schools/login",
    type: "resource",
    category: "School Tools",
  },
  {
    title: "Nominate Students",
    description: "Non-ASSET schools can nominate their top 25% performing students via email",
    url: "/for-schools#non-asset-schools",
    type: "resource",
    category: "School Tools",
  },
  {
    title: "Bulk Registration of ATS Qualifiers",
    description: "Schools can do bulk registration of qualified students and save 10% on registration fees",
    url: "/for-schools#bulk-registration",
    type: "section",
    category: "School Features",
  },
  {
    title: "Non ASSET Schools",
    description: "Registration process for Non ASSET Schools through student nomination via email",
    url: "/for-schools#non-asset-schools",
    type: "section",
    category: "School Features",
  },
  {
    title: "Bulk Registrations",
    description: "Comprehensive bulk registration system for schools with Excel template and 10% cost savings",
    url: "/resources/bulk-registrations",
    type: "page",
    category: "Resources",
  },
  {
    title: "Bulk Registration Excel Template",
    description: "Download Excel template for bulk student registration with detailed instructions",
    url: "/resources/bulk-registrations",
    type: "resource",
    category: "Registration Tools",
  },
  {
    title: "School Bulk Registration Process",
    description: "4-step process for schools to register multiple students efficiently",
    url: "/resources/bulk-registrations",
    type: "content",
    category: "Registration Process",
  },
  {
    title: "Student Nomination Email Process",
    description: "Email-based nomination process for Non ASSET Schools with required student details",
    url: "/for-schools#non-asset-schools",
    type: "content",
    category: "Registration Process",
  },
  {
    title: "Top 25% Student Nomination",
    description: "Schools can nominate up to top 25% academically talented students",
    url: "/for-schools#non-asset-schools",
    type: "content",
    category: "Nomination Criteria",
  },

  // Resources Page Content
  {
    title: "Webinars",
    description: "Expert-led webinars covering exam preparation and university applications",
    url: "/resources#quick-access",
    type: "resource",
    category: "Learning Resources",
  },
  {
    title: "Blog",
    description: "Insightful articles about gifted education and success stories",
    url: "/resources#resources",
    type: "resource",
    category: "Learning Resources",
  },
  {
    title: "Sample Papers",
    description: "Official sample papers to understand exam format and difficulty",
    url: "/resources#quick-access",
    type: "resource",
    category: "Learning Resources",
  },
  {
    title: "AQAD",
    description: "Advanced Question Analysis Dashboard for performance analytics and learning insights",
    url: "/resources#quick-access",
    type: "resource",
    category: "Analytics Platform",
  },
  {
    title: "AQAD Platform",
    description: "Access detailed performance analytics and personalized learning insights",
    url: "/resources#quick-access",
    type: "resource",
    category: "Analytics Platform",
  },
  {
    title: "Advanced Question Analysis Dashboard",
    description: "Comprehensive analytics platform for performance tracking",
    url: "/resources#quick-access",
    type: "resource",
    category: "Analytics Platform",
  },
  {
    title: "Brochure",
    description: "Comprehensive program brochure with detailed information",
    url: "/resources#resources",
    type: "resource",
    category: "Learning Resources",
  },
  {
    title: "ATS Brochure",
    description: "Download the complete program guide and information",
    url: "/resources#resources",
    type: "resource",
    category: "Learning Resources",
  },

  // Contact Information
  {
    title: "eitalentsearch@ei.study",
    description: "Contact email for Ei ASSET Talent Search support",
    url: "/#contact",
    type: "content",
    category: "Contact",
  },
  {
    title: "+91 80 4718 7451",
    description: "Phone number for immediate assistance",
    url: "/#contact",
    type: "content",
    category: "Contact",
  },
  {
    title: "Mon-Sat 9AM-6PM",
    description: "Working hours for support team",
    url: "/#contact",
    type: "content",
    category: "Contact",
  },
  {
    title: "Educational Initiatives",
    description: "Organization behind Ei ASSET Talent Search",
    url: "/#contact",
    type: "content",
    category: "Organization",
  },
  {
    title: "Bengaluru India",
    description: "Office location of Educational Initiatives",
    url: "/#contact",
    type: "content",
    category: "Location",
  },
  {
    title: "Schedule a Call",
    description: "Schedule a call or send us a message through our contact form",
    url: "/contact#send-message",
    type: "content",
    category: "Contact",
  },
  {
    title: "Send us a Message",
    description: "Contact form to send messages and schedule calls with our team",
    url: "/contact#send-message",
    type: "content",
    category: "Contact",
  },

  // Additional searchable terms
  {
    title: "Gifted Students",
    description: "Programs designed for academically gifted students",
    url: "/",
    type: "content",
    category: "Education",
  },
  {
    title: "Talent Search",
    description: "Comprehensive talent identification program",
    url: "/",
    type: "content",
    category: "Program",
  },
  {
    title: "Academic Excellence",
    description: "Recognition and development of academic excellence",
    url: "/#rewards",
    type: "content",
    category: "Education",
  },
  {
    title: "University Partnerships",
    description: "Access to world-class university programs",
    url: "/programmes",
    type: "content",
    category: "Partnerships",
  },
  {
    title: "Online Exam",
    description: "Computer-based online examination system",
    url: "/#exam-info",
    type: "content",
    category: "Exam",
  },
  {
    title: "Registration Process",
    description: "Complete registration process for ATS 2025 exam",
    url: "/#exam-info",
    type: "content",
    category: "Registration",
  },
  {
    title: "Top 2% Students",
    description: "Identifying the top 2% gifted students globally",
    url: "/",
    type: "content",
    category: "Program",
  },

  // Additional Features & Content
  {
    title: "For Students Image",
    description: "Visual representation of student success and celebration",
    url: "/for-students",
    type: "content",
    category: "Student Experience",
  },
  {
    title: "Why Join ATS",
    description: "Benefits of joining ATS including university access and recognition",
    url: "/for-students#why-join-ats",
    type: "content",
    category: "Student Benefits",
  },
  {
    title: "Student Tools & Resources",
    description: "Comprehensive collection of tools for student success",
    url: "/for-students#student-tools",
    type: "section",
    category: "Student Tools",
  },
  {
    title: "Video Testimonials",
    description: "Complete collection of student, parent, and school video testimonials",
    url: "/resources#testimonials",
    type: "section",
    category: "Testimonials",
  },
  {
    title: "Testimonials Gallery",
    description: "Watch real success stories from our ATS community",
    url: "/resources#testimonials",
    type: "section",
    category: "Testimonials",
  },
  {
    title: "Student Success Videos",
    description: "Video stories from successful ATS participants and their achievements",
    url: "/resources#testimonials",
    type: "content",
    category: "Testimonials",
  },
  {
    title: "Video Testimonials",
    description: "Real success stories from students, parents, and schools",
    url: "/resources",
    type: "content",
    category: "Testimonials",
  },
  {
    title: "Success Stories",
    description: "Hear from our ATS community about their achievements",
    url: "/resources",
    type: "content",
    category: "Testimonials",
  },
  {
    title: "Alumni Network",
    description: "Connect with 1000+ alumni from 100+ schools globally",
    url: "/#alumni-cta",
    type: "content",
    category: "Community",
  },
  {
    title: "Speak With Alumni",
    description: "Schedule calls and join the alumni network",
    url: "/#alumni-cta",
    type: "section",
    category: "Community",
  },
  {
    title: "University Programs Access",
    description: "Direct access to programs at Johns Hopkins, UC Berkeley, Northwestern, and more",
    url: "/programmes",
    type: "content",
    category: "University Access",
  },
  {
    title: "School Code Login",
    description: "Login using your school code for secure access",
    url: "/for-schools/login",
    type: "resource",
    category: "School Authentication",
  },
  {
    title: "Registration Statistics",
    description: "View current year vs last year registration data",
    url: "/for-schools/dashboard",
    type: "content",
    category: "School Analytics",
  },
  {
    title: "Qualified Students List",
    description: "Complete list of students who qualified with percentiles",
    url: "/for-schools/students",
    type: "content",
    category: "School Analytics",
  },
  {
    title: "High Performers",
    description: "Students with 90%+ percentile highlighted for recognition",
    url: "/for-schools/students",
    type: "content",
    category: "School Analytics",
  },
  {
    title: "Intelligent Chatbot",
    description: "AI assistant with comprehensive knowledge about ATS program",
    url: "/",
    type: "feature",
    category: "Support",
  },
  {
    title: "ATS Assistant",
    description: "Get instant answers about exam details, registration, and universities",
    url: "/",
    type: "feature",
    category: "Support",
  },
  {
    title: "Quick Questions",
    description: "Fast access to common ATS questions and information",
    url: "/",
    type: "feature",
    category: "Support",
  },
]

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const router = useRouter()

  // Enhanced search function with fuzzy matching
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setResults([])
      return
    }

    const query = searchQuery.toLowerCase().trim()
    const words = query.split(/\s+/)

    const filteredResults = websiteContent.filter((item) => {
      const searchableText = `${item.title} ${item.description} ${item.category || ""}`.toLowerCase()

      // Exact phrase match gets highest priority
      if (searchableText.includes(query)) {
        return true
      }

      // All words must be found somewhere in the searchable text
      return words.every((word) => searchableText.includes(word))
    })

    // Sort results by relevance
    const sortedResults = filteredResults.sort((a, b) => {
      const aText = `${a.title} ${a.description}`.toLowerCase()
      const bText = `${b.title} ${b.description}`.toLowerCase()

      // Exact title match gets highest priority
      if (a.title.toLowerCase().includes(query) && !b.title.toLowerCase().includes(query)) return -1
      if (b.title.toLowerCase().includes(query) && !a.title.toLowerCase().includes(query)) return 1

      // Then by how early the match appears
      const aIndex = aText.indexOf(query)
      const bIndex = bText.indexOf(query)

      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
      if (aIndex !== -1) return -1
      if (bIndex !== -1) return 1

      return 0
    })

    setResults(sortedResults.slice(0, 10)) // Limit to top 10 results
  }, [searchQuery])

  // Handle result click
  const handleResultClick = (url: string) => {
    router.push(url)
    onOpenChange(false)
    setSearchQuery("")
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onOpenChange(false)
      setSearchQuery("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0" onKeyDown={handleKeyDown}>
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search everything on the website..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-lg"
              autoFocus
            />
            {searchQuery && (
              <Button variant="ghost" size="icon" onClick={() => setSearchQuery("")} className="h-5 w-5 p-0">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {results.length > 0 ? (
          <div className="max-h-[500px] overflow-y-auto p-2">
            <div className="text-xs text-gray-500 px-3 py-2">
              {results.length} result{results.length !== 1 ? "s" : ""} found
            </div>
            {results.map((result, index) => (
              <div
                key={index}
                className="p-4 hover:bg-gray-50 rounded-md cursor-pointer border-b border-gray-100 last:border-b-0"
                onClick={() => handleResultClick(result.url)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-[#850101] text-sm">{result.title}</h3>
                      {result.category && (
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                          {result.category}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{result.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{result.url}</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-[#850101] text-white rounded-full capitalize flex-shrink-0">
                    {result.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : searchQuery ? (
          <div className="p-8 text-center">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No results found for "{searchQuery}"</p>
            <p className="text-sm text-gray-400 mt-2">
              Try different keywords, check spelling, or browse the navigation menu
            </p>
            <div className="mt-4 text-xs text-gray-400">
              <p>Search tips:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Try searching for "AQAD", "webinars", "Johns Hopkins", "school portal", etc.</li>
                <li>Use specific terms like "Bronze Scholar", "exam dates", "PAN ID", "chatbot"</li>
                <li>Search for university names like "UC Berkeley", "Northwestern", or "Purdue"</li>
                <li>Look for "video testimonials", "alumni network", or "school dashboard"</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Start typing to search</p>
            <p className="text-sm text-gray-400 mt-2">
              Search for pages, sections, partners, resources, or any content on the website
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-50 p-2 rounded">
                <p className="font-medium text-gray-700">Popular searches:</p>
                <p className="text-gray-500">AQAD, Johns Hopkins, School Portal, PAN ID</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <p className="font-medium text-gray-700">Quick access:</p>
                <p className="text-gray-500">Registration, Video Testimonials, Chatbot</p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
