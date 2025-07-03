"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Search, ChevronDown } from "lucide-react"
import { SearchDialog } from "@/components/search-dialog"

// Navigation menu structure with page sections
const navigationMenus = {
  home: {
    title: "Home",
    href: "/",
    sections: [
      { name: "Success Stories", href: "/#media-carousel" },
      { name: "About ATS", href: "/#about" },
      { name: "History & Evolution", href: "/#history" },
      { name: "University Partners", href: "/#partners" },
      { name: "Recognition & Rewards", href: "/#rewards" },
      { name: "Exam Information", href: "/#exam-info" },
      { name: "Testimonials", href: "/#testimonials" },
      { name: "Alumni Network", href: "/#alumni-cta" },
      { name: "FAQ", href: "/#faq" },
      { name: "Contact", href: "/#contact" }
    ]
  },
  programmes: {
    title: "Programmes",
    href: "/programmes",
    sections: [
      { name: "Overview", href: "/programmes#hero" },
      { name: "All Programmes", href: "/programmes#programmes" },
      { name: "Johns Hopkins CTY", href: "/programmes#johns-hopkins" },
      { name: "Northwestern CTD", href: "/programmes#northwestern" },
      { name: "UC Berkeley ATDP", href: "/programmes#uc-berkeley" },
      { name: "Purdue GERI", href: "/programmes#purdue" },
      { name: "Summer Programs", href: "/programmes#summer-programs" }
    ]
  },
  forStudents: {
    title: "For Students",
    href: "/for-students",
    sections: [
      { name: "Student Tools", href: "/for-students#student-tools" },
      { name: "Student Portal", href: "https://ats.ei.study/student_portal/index.php" },
      { name: "Register for ATS", href: "https://ats.ei.study/ats_registration.php" },
      { name: "Why Join ATS", href: "/for-students#why-join-ats" }
    ]
  },
  forSchools: {
    title: "For Schools",
    href: "/for-schools",
    sections: [
      { name: "Overview", href: "/for-schools#hero" },
      { name: "Administration Tools", href: "/for-schools#school-tools" },
      { name: "Bulk Registration", href: "/for-schools#bulk-registration" },
      { name: "Non ASSET Schools", href: "/for-schools#non-asset-schools" },
      { name: "Why Partner with ATS", href: "/for-schools#why-partner-ats" }
    ]
  },
  resources: {
    title: "Resources",
    href: "/resources",
    sections: [
      { name: "Available Resources", href: "/resources#resources" },
      { name: "Bulk Registrations", href: "/resources/bulk-registrations" },
      { name: "Video Testimonials", href: "/resources#testimonials" },
      { name: "Quick Access", href: "/resources#quick-access" },
      { name: "Sample Papers", href: "https://ei.study/wp-content/uploads/2025/01/Sample-Questions-Ei-ASSET-Final-File.pdf" },
      { name: "Webinars", href: "https://ei.study/webinars/" }
    ]
  },
  contact: {
    title: "Contact",
    href: "/contact",
    sections: [
      { name: "Send Message", href: "/contact#send-message" },
      { name: "Contact Information", href: "/contact" },
      { name: "FAQ", href: "/contact#faq" }
    ]
  }
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  // Close dropdown when clicking outside
  const handleDropdownEnter = (menuKey: string) => {
    setActiveDropdown(menuKey)
  }

  const handleDropdownLeave = () => {
    setActiveDropdown(null)
  }

  return (
    <>
      <header className="bg-white shadow-professional border-b border-gray-200 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-[#850101] rounded-lg flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:scale-110 group-hover:bg-[#650101]">
                <span className="text-white font-bold text-lg">Ei</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-[#850101] transition-all duration-300 group-hover:text-[#650101] text-hover-glow">
                  Ei ASSET Talent Search
                </h1>
                <p className="text-xs text-gray-600 transition-colors duration-300 group-hover:text-gray-800">
                  Educational Initiatives
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {Object.entries(navigationMenus).map(([key, menu]) => (
                <div
                  key={key}
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter(key)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <Link
                    href={menu.href}
                    className="flex items-center gap-1 text-gray-700 hover:text-[#850101] font-medium nav-hover transition-all duration-300 py-2"
                  >
                    {menu.title}
                    <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${
                      activeDropdown === key ? 'rotate-180' : ''
                    }`} />
                  </Link>
                  
                  {/* Dropdown Menu */}
                  {activeDropdown === key && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-professional-lg border border-gray-200 py-2 z-50 animate-fade-in-up">
                      {menu.sections.map((section, index) => (
                        <Link
                          key={index}
                          href={section.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:text-[#850101] hover:bg-gray-50 transition-all duration-200"
                        >
                          {section.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Search and Register Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-500 hover:text-[#850101] transition-all duration-300 rounded-lg hover:bg-gray-100 icon-hover-bounce focus-ring"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              <Button
                asChild
                className="bg-[#850101] hover:bg-[#650101] text-white btn-hover-lift btn-hover-glow transition-all duration-300"
              >
                <a href="https://ats.ei.study/ats_registration.php" target="_blank" rel="noopener noreferrer">
                  Register
                </a>
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-500 hover:text-[#850101] transition-all duration-300 rounded-lg hover:bg-gray-100 icon-hover-bounce focus-ring"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              <button
                className="p-2 transition-all duration-300 rounded-lg hover:bg-gray-100 focus-ring"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6 transition-transform duration-300 rotate-90" />
                ) : (
                  <Menu className="h-6 w-6 transition-transform duration-300 hover:scale-110" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 animate-fade-in-up">
              <nav className="flex flex-col space-y-4">
                {Object.entries(navigationMenus).map(([key, menu]) => (
                  <div key={key} className="space-y-2">
                    <div
                      className="text-gray-700 hover:text-[#850101] font-medium transition-all duration-300 hover:pl-2 flex items-center justify-between cursor-pointer"
                      onClick={() => setActiveDropdown(activeDropdown === key ? null : key)}
                    >
                      {menu.title}
                      <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${
                        activeDropdown === key ? 'rotate-180' : ''
                      }`} />
                    </div>
                    
                    {/* Mobile Dropdown */}
                    {activeDropdown === key && (
                      <div className="ml-4 space-y-2 border-l-2 border-gray-200 pl-4">
                        {menu.sections.map((section, index) => (
                          <Link
                            key={index}
                            href={section.href}
                            className="block text-sm text-gray-600 hover:text-[#850101] transition-all duration-200"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {section.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <Button
                  asChild
                  className="bg-[#850101] hover:bg-[#650101] text-white w-full btn-hover-glow transition-all duration-300 mt-4"
                >
                  <a href="https://ats.ei.study/ats_registration.php" target="_blank" rel="noopener noreferrer">
                    Register
                  </a>
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Search Dialog */}
      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  )
}
