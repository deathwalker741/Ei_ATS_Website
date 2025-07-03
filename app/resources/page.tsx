"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Video, BookOpen, FileText, Globe, Download, ExternalLink, Users, GraduationCap, School } from "lucide-react"
import { useState, useEffect } from "react"

interface Testimonial {
  id: string
  title: string
  description: string
  isLocal?: boolean
  src?: string
}

const resources = [
  {
    title: "Webinars",
    description:
      "Join our expert-led webinars covering exam preparation strategies, university applications, and academic excellence tips.",
    icon: Video,
    link: "https://ei.study/webinars/",
    color: "bg-red-100 text-red-700",
    type: "Live Sessions",
    features: ["Expert guidance", "Interactive Q&A", "Recorded sessions", "Certificate of participation"],
  },
  {
    title: "Blog",
    description:
      "Read insightful articles about gifted education, success stories, university partnerships, and academic trends.",
    icon: BookOpen,
    link: "https://ei.study/blogs/",
    color: "bg-blue-100 text-blue-700",
    type: "Articles & Insights",
    features: ["Success stories", "Expert insights", "Study tips", "University guides"],
  },
  {
    title: "Sample Papers",
    description:
      "Download official ATS sample papers to understand the exam format, question types, and difficulty level.",
    icon: FileText,
    link: "https://ei.study/wp-content/uploads/2025/01/Sample-Questions-Ei-ASSET-Final-File.pdf",
    color: "bg-green-100 text-green-700",
    type: "PDF Download",
    features: ["Official format", "All subjects", "Answer keys", "Preparation guide"],
  },
  {
    title: "Bulk Registrations",
    description:
      "Schools can efficiently register multiple students with our bulk registration program and save 10% on registration costs.",
    icon: Users,
    link: "/resources/bulk-registrations",
    color: "bg-orange-100 text-orange-700",
    type: "School Registration",
    features: ["10% cost savings", "Excel template", "Streamlined process", "Dedicated support"],
  },
  {
    title: "AQAD Platform",
    description:
      "Access the Advanced Question Analysis Dashboard for detailed performance analytics and personalized learning insights.",
    icon: Globe,
    link: "https://www.aqad.in",
    color: "bg-purple-100 text-purple-700",
    type: "Analytics Platform",
    features: ["Performance analysis", "Learning insights", "Progress tracking", "Personalized reports"],
  },
  {
    title: "ATS Brochure",
    description:
      "Download the comprehensive ATS brochure with detailed information about the program, benefits, and registration process.",
    icon: Download,
    link: "https://ats.ei.study/documents/ATS-India2024.pdf",
    color: "bg-yellow-100 text-yellow-700",
    type: "PDF Brochure",
    features: ["Program overview", "University partners", "Registration guide", "Success metrics"],
  },
]

const testimonials: Testimonial[] = [
  // All actual YouTube video IDs from the provided links - no titles/descriptions yet
  { id: "1YQ5a04xwVs", title: "", description: "" },
  { id: "UgRI1PpDnBA", title: "", description: "" },
  { id: "0hexQQvE1us", title: "", description: "" },
  { id: "Y-_yNZtHdLo", title: "", description: "" },
  { id: "OXvbg02TCs0", title: "", description: "" },
  { id: "FURhmUrdIK4", title: "", description: "" },
  { id: "ulVMBK_B2G8", title: "", description: "" },
  { id: "XHXl_Xxnf1I", title: "", description: "" },
  { id: "-EfEfBYzeVE", title: "", description: "" },
  { id: "2g1_Lv08CSY", title: "", description: "" },
  { id: "gu632GxLlts", title: "", description: "" },
  { id: "3cDx0llkItM", title: "", description: "" },
  { id: "QA0v6DzsCOg", title: "", description: "" },
  { id: "UWZ00Unyx3g", title: "", description: "" },
  { id: "hczA9M2bU1E", title: "", description: "" },
  { id: "ZNHJBeTzLrY", title: "", description: "" },
  { id: "5QVCcMoE-5w", title: "", description: "" },
  { id: "3bApdGVwq-8", title: "", description: "" },
  { id: "qopgHA9FXF0", title: "", description: "" },
  { id: "8G0MbpNPq_0", title: "", description: "" },
  { id: "MOygUsrkk9c", title: "", description: "" },
  { id: "_PoOWP6YLMQ", title: "", description: "" },
  { id: "CS76lx4rGZ8", title: "", description: "" },
  { id: "uVKZ-_VFUNM", title: "", description: "" },
  { id: "MITNthKqm2M", title: "", description: "" },
  { id: "m8lNR2A140o", title: "", description: "" },
  { id: "9iqxlCQ22ck", title: "", description: "" },
  { id: "R9-GSEQiYoA", title: "", description: "" },
  { id: "8BZx_QI2KpM", title: "", description: "" },
  { id: "9ytIlZXisz8", title: "", description: "" }
]

// Add function to load remaining videos dynamically
const additionalVideoIds = [
  "aBlE7PfOlfw", "lNIoLrOsEmw", "kWxmlsLwYss", "KqLBYKisjVY", "ccy1XVWfThU",
  "Cud46eSXwEs", "FpdbYIMh7c0", "OlwJreipL0w", "AM5ye-7S7eQ", "jsnrysIM_gY",
  "_wPdh0X6HYs", "3LQsUyaYR7U", "0hKIiG_oMvU", "bjjOTc7Div0", "aoCn-PTmwlg",
  "6GgPDOMeZ80", "f1DHgHS3ULo", "1rcLrMXnV8s", "1ohIpxXwcIk", "RSVXq_7DatA",
  "K0g_esbMxww", "qMzqCepsMRY", "Nfhz8P5k2qc", "bmjfUQQDeLM", "d1XsBL52nos",
  "0GOtR2acxb4", "KgKZI6Gvidc", "tvCBHmBC8gA", "0fKS7zIPZDg", "Ii7sW7b8YKE",
  "nJpwUdgguwY", "X4nQRuRaRIk", "RkRtzEKKfwY", "3g28ekPYQFg", "-IZDJeeGL6s",
  "53r6xYS384g", "9g0Jdq2-uaU", "MlYbDgexFdA", "3OOm8AuMtb4", "bVxR6nns7hs",
  "-GOnoTPMnI4", "Pngl8TNgrP8", "mjsh8pGUtyc", "puh4xE2UsK4", "yeOH78_XYAg",
  "0CnC9sreYnE", "-5xNoviJZ7s", "d0TnGY_kd4o", "ymEhvMMZobs", "htj3MfxVCRk",
  "eU0AsHfaYe0", "3Ysuf2el23I", "cnRpaMdyZ5o", "Get3Jm4wLa8", "zYI383pJKUI",
  "zYpvYw9Ozw0", "sC-_mluHmn4", "_HgrqsWPV7w", "rXZvFzhHkMI", "qAz3jPRnx9k",
  "lcI7XS2yspE", "XmRwMiEfvWo", "XgyNvW2iMYU", "DkqW17RDXro", "BGCFCMCquPI",
  "B1zY-NLnogc", "7-5HZKsbDck", "64Dqa1tCraA", "HtqQJwbDrOk", "pWM0lMCMEO0",
  "99fweqyaC80", "KIrNXej4KC0", "5_LFbSN9fDI", "z5waGiUfgVs", "IWN2xhFGStM",
  "XUeBcV2aEn8", "9FXf1n4ireE", "3kHVmde3ySc", "zTzOlXMIotI", "vvNXTAeI3DQ",
  "G53Ytdn5rbo", "8vcYGprZgBw", "aWHzirBmLCk", "JtHqsBEXPdk", "lFep69vm0wU",
  "b9ROYD_Vc18", "RfMj3OLD5pY", "kfR13dcxfqQ", "X0UJKiJKdtY", "RJGumZH5TS8",
  "90aMXnp6erM", "VkxD81tRKbo", "oSGn7n_4Ocg", "mPpI-f0hDBE", "_8jC6VLD-0I",
  "JAKTFuJW3uo", "redKZq8seXw", "aoEG0ShtIX8", "QjWboHqe4Yw", "ak2QDoeOneU",
  "w73FN1hevT8", "15o0FuZWLrU", "aRUX1yKzdTQ", "9fFzgYkRILY", "ZQo_HpGUYrc",
  "PscAazkTYOE", "N4UDyzTNVv8", "gNafnLx7XRY", "iYUGuTorLq0", "2JlcFvIhVJ8",
  "6fbxqeI8q1Q", "x0nv-Tq_jXo", "O_taBXN0ht8", "PkhDJ8gjAbs", "7WCRrM6ZXsk",
  "fZc_E3DkFGE", "xLszGEjTN30", "7DVa1YuOajY", "a8F-Phs3hgk", "GYdRKdT_uvE",
  "0glpcxzgajM", "q0Zi0OSNmsg", "U-IAliO2Gco", "RWcyiHE9MIE", "h2UOuFjwjjs",
  "herKSUz0iK0", "pA5EEICF-xE", "qMIa64dyWxc", "upVu00AaJjQ", "LbCtB-BXpdA",
  "mGcE8uv_0xQ", "KivlDFLC_p8", "RpPAuVlo9aY", "eG31pjH4930", "YHL04sMfXl8",
  "5g8A9KtRDQU", "hp_xpUXQrEM", "Ik2bp1TYvtI", "cx1C3LhmFg8", "oUE5OiviChM",
  "NRQMaP-Mqqc", "5YS11CCYw0s", "YrPSfgpWuVg", "TBi57Oj-PLs", "LwpyJhlDRJk",
  "gxHpKxVGXEI", "lI_M_BvAZl0", "JMtLfXJOMi0", "E-a289pqDvA", "Opwe0fw_rI8",
  "yJZe0TGuYKw", "caGXDQzOv1s", "7uhkjtUWQRY", "r_WwHBDnPQw", "UW_TtTu5zyM",
  "lFoVmRQ4aGI", "By4TxgTrUV0", "jgcfvz24LYA", "lAFWtdnXaec", "pKjG2ZlU6xQ",
  "sWX4f6QH_ys", "KYegOAKraNE", "1IW2iXUPsHE", "O_HS8G7_6Zo", "kCvCtwbh2AA",
  "ytVewqLm64c", "ZL_UuYIs4Ho", "cg7I63o5woU", "pfQaHSKPj_M", "4zXdAqAceyk",
  "TWlMZT-sA0c", "ujFolfQ3Ryc", "wqwPqbxgY3Q", "UkVzlOFKwQA", "4hO3BVVNHss",
  "jWQwlky0lTM", "RRGlynLIBVs", "fm5k-IdwgM8", "MKqX2foroOQ", "WYWduLnjsVE",
  "9lYOA-zY39w", "c2nfg32IzuU", "7VUK2DO4WkM", "2qjv_ejIUHM", "trW1EMJkuL0",
  "X0olrupA6xk", "ee9smf7rLd8", "xcFclPB89pk", "nvliRiYSTxg", "bKtoungXEFY",
  "h2uYPy6jlJE", "oo4fE2_0l9A", "5MiOLZlYDcE", "QV3UbkUKb5g", "eWWRXit5F9E",
  "P3lZgJu920E", "HXSpNP1zAV8", "LEK_n3akZrk", "1MQgIxS4CJk", "laQA-65Kdfg",
  "hygC2lQbswc", "OuR0chdg0Qg", "qxtEOpd0Hlw", "TknouE3wqnE", "U0JgsSi_tJU",
  "H9evNz9_yI0", "fxdIAYQRnHs", "4EudwhIGCMM", "5IEd67FnuPY", "mwzcJy4sXVk",
  "VRYGeyboD0U", "oyTJP1V0YUs", "jSbEoL77ufQ", "U9PmJ0R8zus", "G5FqTHvNCxw",
  "nfE9c0yO8p4", "s0wolxDX-PM", "CjnckiSY3D0", "NpVj9DqbzQ8", "XlYa1sIyNPE",
  "LagGb2YAiyM", "WqqiSfhug-w", "Dk20GLGbZ_I", "VlaT7syAcEw", "XhAl6c4isBw"
]

// Generate testimonials for all remaining videos with empty titles/descriptions
additionalVideoIds.forEach(videoId => {
  testimonials.push({
    id: videoId,
    title: "",
    description: ""
  })
})

// Add local videos
testimonials.push(
  {
    id: "local-video1",
    title: "",
    description: "",
    isLocal: true,
    src: "/media/video1.mp4"
  },
  {
    id: "local-video2", 
    title: "",
    description: "",
    isLocal: true,
    src: "/media/video2.mp4"
  }
)



// Function to fetch YouTube video data
const fetchYouTubeVideoData = async (videoId: string) => {
  try {
    // Note: You'll need to add your YouTube API key to environment variables
    const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
    if (!API_KEY) {
      return {
        title: `YouTube Video ${videoId}`,
        description: "Click to watch this testimonial video"
      }
    }
    
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${API_KEY}&part=snippet`
    )
    const data = await response.json()
    
    if (data.items && data.items.length > 0) {
      const snippet = data.items[0].snippet
      return {
        title: snippet.title,
        description: snippet.description.substring(0, 150) + "..."
      }
    }
  } catch (error) {
    console.error('Error fetching YouTube data:', error)
  }
  
  return {
    title: `YouTube Video ${videoId}`,
    description: "Click to watch this testimonial video"
  }
}

export default function ResourcesPage() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  const getYouTubeEmbedUrl = (videoId: string) => {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`
  }

  const getYouTubeThumbnail = (videoId: string) => {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement
    const videoId = img.getAttribute('data-video-id')
    
    if (videoId) {
      // Try medium quality if high quality fails
      if (img.src.includes('hqdefault')) {
        img.src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
      }
      // Try default quality if medium quality fails
      else if (img.src.includes('mqdefault')) {
        img.src = `https://img.youtube.com/vi/${videoId}/default.jpg`
      }
      // Use placeholder if all YouTube thumbnails fail
      else {
        img.src = '/placeholder.jpg'
      }
    }
  }

  const VideoModal = ({ videoSrc, onClose }: { videoSrc: string; onClose: () => void }) => {
    const isLocal = videoSrc.startsWith('/')
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="relative w-full max-w-4xl">
          <button
            onClick={onClose}
            className="absolute -top-10 right-0 text-white text-2xl hover:text-gray-300"
          >
            ✕
          </button>
          <div className="relative w-full h-0 pb-[56.25%]">
            {isLocal ? (
              <video
                src={videoSrc}
                className="absolute inset-0 w-full h-full rounded-lg"
                controls
                autoPlay
              />
            ) : (
              <iframe
                src={videoSrc}
                className="absolute inset-0 w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section id="hero" className="bg-gradient-to-br from-[#850101] to-[#650101] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Resources & Support</h1>
          <p className="text-xl text-gray-100 max-w-3xl mx-auto">
            Access comprehensive resources to help you prepare for ATS 2025, understand university programs, and
            maximize your academic potential.
          </p>
        </div>
      </section>



      {/* Main Resources */}
      <section id="resources" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Available Resources</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access all the tools and materials you need for ATS success
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {resources.map((resource, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${resource.color}`}>
                      <resource.icon className="h-8 w-8" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-[#850101]">{resource.title}</CardTitle>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{resource.type}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">{resource.description}</p>

                  <div className="grid md:grid-cols-2 gap-2">
                    {resource.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-[#850101] rounded-full"></div>
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button asChild className="w-full bg-[#850101] hover:bg-[#650101]">
                    {resource.link.startsWith('/') ? (
                      <a href={resource.link}>
                        Access {resource.title} <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    ) : (
                    <a href={resource.link} target="_blank" rel="noopener noreferrer">
                      Access {resource.title} <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Testimonials from Students, Parents & Schools
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear real success stories from our ATS community - students achieving their dreams, 
              parents sharing their experiences, and schools partnering with us for excellence
            </p>
          </div>

          {/* Video Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                <div 
                  className="relative aspect-video overflow-hidden"
                  onClick={() => {
                    if (testimonial.isLocal) {
                      setSelectedVideo(testimonial.src!)
                    } else {
                      setSelectedVideo(getYouTubeEmbedUrl(testimonial.id))
                    }
                  }}
                >
                  <img
                    src={testimonial.isLocal ? "/placeholder.jpg" : getYouTubeThumbnail(testimonial.id)}
                    alt={testimonial.title || "Video thumbnail"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    data-video-id={testimonial.isLocal ? undefined : testimonial.id}
                    onError={testimonial.isLocal ? undefined : handleImageError}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                      <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  {testimonial.title && (
                    <h3 className="font-semibold text-[#850101] mb-2 group-hover:text-[#650101] transition-colors">
                      {testimonial.title}
                    </h3>
                  )}
                  {testimonial.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {testimonial.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-3xl font-bold text-[#850101] mb-2">{testimonials.length}</div>
              <div className="text-gray-600">Student Success Stories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal
          videoSrc={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}

      {/* Quick Access Section */}
      <section id="quick-access" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Access</h2>
            <p className="text-xl text-gray-600">Most popular resources for ATS preparation</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <FileText className="h-12 w-12 text-[#850101] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Sample Papers</h3>
                <p className="text-gray-600 text-sm mb-4">Official ATS sample questions</p>
                <Button asChild className="bg-[#850101] hover:bg-[#650101]">
                  <a
                    href="https://ei.study/wp-content/uploads/2025/01/Sample-Questions-Ei-ASSET-Final-File.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download PDF
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <Video className="h-12 w-12 text-[#850101] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Live Webinars</h3>
                <p className="text-gray-600 text-sm mb-4">Expert-led preparation sessions</p>
                <Button asChild className="bg-[#850101] hover:bg-[#650101]">
                  <a href="https://ei.study/webinars/" target="_blank" rel="noopener noreferrer">
                    Join Webinar
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <Users className="h-12 w-12 text-[#850101] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Bulk Registration</h3>
                <p className="text-gray-600 text-sm mb-4">Schools register multiple students</p>
                <Button asChild className="bg-[#850101] hover:bg-[#650101]">
                  <a href="/resources/bulk-registrations">
                    Learn More
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <Globe className="h-12 w-12 text-[#850101] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">AQAD Platform</h3>
                <p className="text-gray-600 text-sm mb-4">Performance analytics dashboard</p>
                <Button asChild className="bg-[#850101] hover:bg-[#650101]">
                  <a href="https://www.aqad.in" target="_blank" rel="noopener noreferrer">
                    Access Platform
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="resources-cta" className="py-16 bg-[#850101] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Need More Support?</h2>
          <p className="text-xl text-gray-200 mb-8">
            Our team is here to help you make the most of these resources and succeed in ATS 2025
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-[#850101] hover:bg-gray-100 font-semibold">
              Contact Support
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white bg-transparent hover:bg-white hover:text-[#850101] font-semibold"
              asChild
            >
              <a href="https://ats.ei.study/ats_registration.php" target="_blank" rel="noopener noreferrer">
                Register for ATS 2025
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
