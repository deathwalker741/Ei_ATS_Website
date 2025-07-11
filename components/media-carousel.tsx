"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, X, Maximize } from "lucide-react"

interface MediaItem {
  id: number
  type: "image" | "video" | "youtube"
  src: string
  youtubeId?: string
  thumbnail: string
  title: string
  description: string
  duration?: string
}

// Helper function to extract YouTube video ID from URL
const getYouTubeId = (url: string): string => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : ''
}

// Helper function to get YouTube thumbnail
const getYouTubeThumbnail = (videoId: string): string => {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
}

// Debug function to check image loading (disabled for production)
const debugImageLoad = (src: string, type: string) => {
  // Debug logging disabled for production
  // if (process.env.NODE_ENV === 'development') {
  //   console.log(`Loading ${type} image:`, src)
  //   const img = new Image()
  //   img.onload = () => console.log(`✅ Successfully loaded ${type}:`, src)
  //   img.onerror = () => console.log(`❌ Failed to load ${type}:`, src)
  //   img.src = src
  // }
}

const mediaItems: MediaItem[] = [
  // First 5 YouTube videos from your list
  {
    id: 1,
    type: "youtube",
    src: "https://www.youtube.com/watch?v=1YQ5a04xwVs",
    youtubeId: "1YQ5a04xwVs",
    thumbnail: getYouTubeThumbnail("1YQ5a04xwVs"),
  },
  {
    id: 2,
    type: "youtube",
    src: "https://www.youtube.com/watch?v=UgRI1PpDnBA",
    youtubeId: "UgRI1PpDnBA",
    thumbnail: getYouTubeThumbnail("UgRI1PpDnBA"),
  },
  {
    id: 3,
    type: "youtube",
    src: "https://www.youtube.com/watch?v=2g1_Lv08CSY",
    youtubeId: "2g1_Lv08CSY",
    thumbnail: getYouTubeThumbnail("2g1_Lv08CSY"),
  },
  {
    id: 4,
    type: "youtube",
    src: "https://www.youtube.com/watch?v=gu632GxLlts",
    youtubeId: "gu632GxLlts",
    thumbnail: getYouTubeThumbnail("gu632GxLlts"),
  },
  {
    id: 5,
    type: "youtube",
    src: "https://www.youtube.com/watch?v=3cDx0llkItM",
    youtubeId: "3cDx0llkItM",
    thumbnail: getYouTubeThumbnail("3cDx0llkItM"),
  },
  // Additional quality videos from second batch
  {
    id: 11,
    type: "youtube",
    src: "https://www.youtube.com/watch?v=hczA9M2bU1E",
    youtubeId: "hczA9M2bU1E",
    thumbnail: getYouTubeThumbnail("hczA9M2bU1E"),
    title: "Student Testimonial: University Preparation",
    description: "Students discuss how early identification prepared them for university success",
    duration: "4:30",
  },
  {
    id: 12,
    type: "youtube",
    src: "https://www.youtube.com/watch?v=ZNHJBeTzLrY",
    youtubeId: "ZNHJBeTzLrY",
    thumbnail: getYouTubeThumbnail("ZNHJBeTzLrY"),
    title: "Parent Perspectives",
    description: "Parents share how the programme revealed their child's exceptional capabilities",
    duration: "3:45",
  },
  {
    id: 13,
    type: "youtube",
    src: "https://www.youtube.com/watch?v=5QVCcMoE-5w",
    youtubeId: "5QVCcMoE-5w",
    thumbnail: getYouTubeThumbnail("5QVCcMoE-5w"),
    title: "Student Success: Advanced Learning Programmes",
    description: "Hear how students thrived in challenging academic environments",
    duration: "4:20",
  },
  {
    id: 14,
    type: "youtube",
    src: "https://www.youtube.com/watch?v=3bApdGVwq-8",
    youtubeId: "3bApdGVwq-8",
    thumbnail: getYouTubeThumbnail("3bApdGVwq-8"),
    title: "Parent Testimonial: Academic Excellence Journey",
    description: "Families reflect on their journey toward academic excellence and achievement",
    duration: "5:15",
  },
  {
    id: 15,
    type: "youtube",
    src: "https://www.youtube.com/watch?v=qopgHA9FXF0",
    youtubeId: "qopgHA9FXF0",
    thumbnail: getYouTubeThumbnail("qopgHA9FXF0"),
    title: "Student Achievement: International Recognition",
    description: "Students who gained international recognition through their academic achievements",
    duration: "3:55",
  },
  {
    id: 16,
    type: "youtube",
    src: "https://www.youtube.com/watch?v=8G0MbpNPq_0",
    youtubeId: "8G0MbpNPq_0",
    thumbnail: getYouTubeThumbnail("8G0MbpNPq_0"),
    title: "Parent & Student: STEM Excellence",
    description: "Families share their success stories in science, technology, engineering, and mathematics",
    duration: "4:45",
  },
  {
    id: 17,
    type: "youtube",
    src: "https://www.youtube.com/watch?v=MOygUsrkk9c",
    youtubeId: "MOygUsrkk9c",
    thumbnail: getYouTubeThumbnail("MOygUsrkk9c"),
    title: "Student Testimonial: Research Opportunities",
    description: "How talent identification opened doors to advanced research opportunities",
    duration: "4:10",
  },
  {
    id: 18,
    type: "youtube",
    src: "https://www.youtube.com/watch?v=_PoOWP6YLMQ",
    youtubeId: "_PoOWP6YLMQ",
    thumbnail: getYouTubeThumbnail("_PoOWP6YLMQ"),
    title: "Parent Interview: Educational Transformation",
    description: "Parents discuss the comprehensive transformation in their child's educational journey",
    duration: "5:30",
  },
  {
    id: 19,
    type: "youtube",
    src: "https://www.youtube.com/watch?v=CS76lx4rGZ8",
    youtubeId: "CS76lx4rGZ8",
    thumbnail: getYouTubeThumbnail("CS76lx4rGZ8"),
    title: "Student Success: University Scholarships",
    description: "Students who earned prestigious university scholarships through the programme",
    duration: "4:25",
  },
  {
    id: 20,
    type: "youtube",
    src: "https://www.youtube.com/watch?v=uVKZ-_VFUNM",
    youtubeId: "uVKZ-_VFUNM",
    thumbnail: getYouTubeThumbnail("uVKZ-_VFUNM"),
    title: "Building Confidence",
    description: "How the programme built confidence and academic self-esteem in gifted children",
    duration: "3:40",
  },
  {
    id: 21,
    type: "youtube",
    src: "https://www.youtube.com/watch?v=ccy1XVWfThU",
    youtubeId: "ccy1XVWfThU",
    thumbnail: getYouTubeThumbnail("ccy1XVWfThU"),
    title: "Student Interview: Future Leaders",
    description: "Meet the future leaders who started their journey with talent identification",
    duration: "4:50",
  },
  {
    id: 22,
    type: "youtube",
    src: "https://www.youtube.com/watch?v=Cud46eSXwEs",
    youtubeId: "Cud46eSXwEs",
    thumbnail: getYouTubeThumbnail("Cud46eSXwEs"),
    title: "Parent & Student: Global Opportunities",
    description: "Families share how the programme opened global educational opportunities",
    duration: "5:20",
  },
  {
    id: 23,
    type: "youtube",
    src: "https://www.youtube.com/watch?v=FpdbYIMh7c0",
    youtubeId: "FpdbYIMh7c0",
    thumbnail: getYouTubeThumbnail("FpdbYIMh7c0"),
    title: "Student Testimonial: Creative Excellence",
    description: "Students who excelled in creative and artistic fields through early identification",
    duration: "3:35",
  },
  {
    id: 24,
    type: "youtube",
    src: "https://www.youtube.com/watch?v=OlwJreipL0w",
    youtubeId: "OlwJreipL0w",
    thumbnail: getYouTubeThumbnail("OlwJreipL0w"),
    title: "Parent Interview: Supporting Gifted Children",
    description: "Parents share strategies for supporting and nurturing gifted children's potential",
    duration: "4:15",
  },
  {
    id: 25,
    type: "youtube",
    src: "https://www.youtube.com/watch?v=AM5ye-7S7eQ",
    youtubeId: "AM5ye-7S7eQ",
    thumbnail: getYouTubeThumbnail("AM5ye-7S7eQ"),
    title: "Student Success: Academic Achievement",
    description: "Outstanding academic achievements through comprehensive talent development",
    duration: "4:05",
  },
  {
    id: 26,
    type: "youtube",
    src: "https://www.youtube.com/watch?v=jsnrysIM_gY",
    youtubeId: "jsnrysIM_gY",
    thumbnail: getYouTubeThumbnail("jsnrysIM_gY"),
    title: "Parent Testimonial: Educational Impact",
    description: "Long-term educational impact and life-changing experiences",
    duration: "4:35",
  },
  {
    id: 27,
    type: "youtube",
    src: "https://www.youtube.com/watch?v=3LQsUyaYR7U",
    youtubeId: "3LQsUyaYR7U",
    thumbnail: getYouTubeThumbnail("3LQsUyaYR7U"),
    title: "Innovation & Leadership",
    description: "Students developing innovation and leadership skills through the programme",
    duration: "3:50",
  },
  {
    id: 28,
    type: "youtube",
    src: "https://www.youtube.com/watch?v=0hKIiG_oMvU",
    youtubeId: "0hKIiG_oMvU",
    thumbnail: getYouTubeThumbnail("0hKIiG_oMvU"),
    title: "Parent & Student: Life Transformation",
    description: "Complete life transformation through early talent identification and development",
    duration: "5:10",
  },

  {
    id: 29,
    type: "image",
    src: "/media/testimonialphoto_vedika.png",
    thumbnail: "/media/testimonialphoto_vedika.png",
    title: "Student Success: Vedika's Achievement",
    description: "Meet Vedika, who achieved remarkable success through early talent identification",
  },
  {
    id: 30,
    type: "image",
    src: "/media/testimonialphoto_shivani.png",
    thumbnail: "/media/testimonialphoto_shivani.png",
    title: "Academic Excellence: Shivani's Journey",
    description: "Shivani's inspiring journey from talent identification to academic excellence",
  },
  {
    id: 31,
    type: "image",
    src: "/media/testimonialphoto_tejash.png",
    thumbnail: "/media/testimonialphoto_tejash.png",
    title: "STEM Success: Tejash's Story",
    description: "Tejash's remarkable achievements in science, technology, engineering, and mathematics",
  },
  {
    id: 32,
    type: "image",
    src: "/media/testimonialphoto_yamini.png",
    thumbnail: "/media/testimonialphoto_yamini.png",
    title: "Research Excellence: Yamini's Experience",
    description: "Yamini's journey into advanced research and academic recognition",
  },
  {
    id: 33,
    type: "youtube",
    src: "https://www.youtube.com/watch?v=1YQ5a04xwVs",
    youtubeId: "1YQ5a04xwVs",
    thumbnail: getYouTubeThumbnail("1YQ5a04xwVs"),
    title: "Success Stories Compilation",
    description: "Watch inspiring success stories from students who excelled through our programmes",
    duration: "4:30",
  },
  {
    id: 34,
    type: "youtube",
    src: "https://www.youtube.com/watch?v=UgRI1PpDnBA",
    youtubeId: "UgRI1PpDnBA",
    thumbnail: getYouTubeThumbnail("UgRI1PpDnBA"),
    title: "Student Achievements",
    description: "Comprehensive overview of student achievements and programme successes",
    duration: "5:15",
  },
  {
    id: 48,
    type: "youtube",
    src: "https://www.youtube.com/watch?v=2g1_Lv08CSY",
    youtubeId: "2g1_Lv08CSY",
    thumbnail: getYouTubeThumbnail("2g1_Lv08CSY"),
    title: "Educational Excellence",
    description: "Showcasing educational excellence and student achievements",
    duration: "3:45",
  },
  {
    id: 49,
    type: "youtube",
    src: "https://www.youtube.com/watch?v=gu632GxLlts",
    youtubeId: "gu632GxLlts",
    thumbnail: getYouTubeThumbnail("gu632GxLlts"),
    title: "Talent Development",
    description: "Talent development and academic recognition through ATS programmes",
    duration: "4:20",
  },
  {
    id: 50,
    type: "youtube",
    src: "https://www.youtube.com/watch?v=3cDx0llkItM",
    youtubeId: "3cDx0llkItM",
    thumbnail: getYouTubeThumbnail("3cDx0llkItM"),
    title: "Student Success Stories",
    description: "Inspiring success stories from students who excelled through our programmes",
    duration: "3:55",
  },
  // ATS Posts - Educational content and achievements
  {
    id: 35,
    type: "image",
    src: "/ATS Posts/1.png",
    thumbnail: "/ATS Posts/1.png",
    title: "Educational Insights",
    description: "Educational insights and achievements from ATS programme participants",
  },
  {
    id: 36,
    type: "image",
    src: "/ATS Posts/2.png",
    thumbnail: "/ATS Posts/2.png",
    title: "Academic Excellence",
    description: "Academic excellence and programme highlights from talented students",
  },
  {
    id: 37,
    type: "image",
    src: "/ATS Posts/3.png",
    thumbnail: "/ATS Posts/3.png",
    title: "Talent Development",
    description: "Talent development and academic recognition through ATS programmes",
  },
  {
    id: 38,
    type: "image",
    src: "/ATS Posts/4.png",
    thumbnail: "/ATS Posts/4.png",
    title: "Student Achievements",
    description: "Student achievements and educational excellence in ATS programmes",
  },
  {
    id: 39,
    type: "image",
    src: "/ATS Posts/5.png",
    thumbnail: "/ATS Posts/5.png",
    title: "Educational Insights",
    description: "Educational insights and programme achievements from ATS participants",
  },
  {
    id: 40,
    type: "image",
    src: "/ATS Posts/6.png",
    thumbnail: "/ATS Posts/6.png",
    title: "Talent Identification",
    description: "Talent identification and academic excellence through ATS programmes",
  },
  {
    id: 41,
    type: "image",
    src: "/ATS Posts/7.png",
    thumbnail: "/ATS Posts/7.png",
    title: "Academic Recognition",
    description: "Academic recognition and programme highlights from talented students",
  },
  {
    id: 42,
    type: "image",
    src: "/ATS Posts/8.png",
    thumbnail: "/ATS Posts/8.png",
    title: "Educational Excellence",
    description: "Educational excellence and achievement recognition in ATS programmes",
  },
  {
    id: 43,
    type: "image",
    src: "/ATS Posts/9.png",
    thumbnail: "/ATS Posts/9.png",
    title: "Student Success Stories",
    description: "Student success stories and educational achievements in ATS",
  },
  {
    id: 44,
    type: "image",
    src: "/ATS Posts/10.png",
    thumbnail: "/ATS Posts/10.png",
    title: "Academic Recognition",
          description: "Academic recognition and programme highlights from talented students",
  },
  {
    id: 45,
    type: "image",
    src: "/ATS Posts/11.png",
    thumbnail: "/ATS Posts/11.png",
    title: "Educational Excellence",
    description: "Educational excellence and achievement recognition in ATS programmes",
  },
  {
    id: 46,
    type: "image",
    src: "/ATS Posts/12.png",
    thumbnail: "/ATS Posts/12.png",
    title: "Student Achievements",
    description: "Student achievements and academic milestones through ATS",
  },
  {
    id: 47,
    type: "image",
    src: "/ATS Posts/13.png",
    thumbnail: "/ATS Posts/13.png",
    title: "Talent Development",
    description: "Talent development and educational success stories from ATS",
  },

] as MediaItem[]

export function MediaCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0) // Start at first item
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [fullscreenItem, setFullscreenItem] = useState<MediaItem | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [hasPlayedFirstFive, setHasPlayedFirstFive] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Un-mute and set volume to 40 % after the first user interaction
  useEffect(() => {
    const unmuteOnFirstGesture = () => {
      setIsMuted(false)
      if (videoRef.current) {
        videoRef.current.muted = false
        videoRef.current.volume = 0.4 // 40 % volume
      }
      window.removeEventListener("pointerdown", unmuteOnFirstGesture)
      window.removeEventListener("keydown", unmuteOnFirstGesture)
    }

    // Attach once so it removes itself automatically
    window.addEventListener("pointerdown", unmuteOnFirstGesture, { once: true })
    window.addEventListener("keydown", unmuteOnFirstGesture, { once: true })

    return () => {
      window.removeEventListener("pointerdown", unmuteOnFirstGesture)
      window.removeEventListener("keydown", unmuteOnFirstGesture)
    }
  }, [])

  // Ensure volume stays at 40 % whenever the current video changes and audio is un-muted
  useEffect(() => {
    if (!isMuted && videoRef.current) {
      videoRef.current.volume = 0.4
    }
  }, [isMuted, currentIndex])

  const currentItem = mediaItems[currentIndex]

  // Debug image loading when component mounts (disabled for production)
  useEffect(() => {
    // console.log('🔍 Testing image accessibility...')
    // mediaItems.forEach((item, index) => {
    //   if (item.type === 'image' || item.type === 'video') {
    //     debugImageLoad(item.thumbnail, `thumbnail-${index}`)
    //   }
    // })
  }, [])

  // Auto-advance for non-video content only (images, YouTube videos with no end detection)
  useEffect(() => {
    if (!isFullscreen && !isHovered && currentItem.type !== "video") {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          if (!hasPlayedFirstFive && prev < 4) {
            return prev + 1
          } else if (!hasPlayedFirstFive && prev === 4) {
            setHasPlayedFirstFive(true)
            return 5 // jump to the next item after the first five
          } else {
            return (prev + 1) % mediaItems.length
          }
        })
      }, 6000)
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isFullscreen, isHovered, hasPlayedFirstFive, currentItem.type])

  // Reset to video 5 and replay first five on reload
  useEffect(() => {
    setCurrentIndex(4)  // Start with video 5 (index 4)
    setHasPlayedFirstFive(false)
  }, [])

  // Handle video play/pause
  useEffect(() => {
    if (videoRef.current && currentItem.type === "video") {
      // Auto-play when video becomes current item
      setIsPlaying(true)
      videoRef.current.play().catch((error) => {
        // Auto-play failed, set playing to false
        setIsPlaying(false)
      })
    }
  }, [currentIndex])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % mediaItems.length)
    setIsPlaying(false)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length)
    setIsPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsPlaying(false)
  }

  const openFullscreen = (item: MediaItem) => {
    setFullscreenItem(item)
    setIsFullscreen(true)
  }

  const closeFullscreen = () => {
    setIsFullscreen(false)
    setFullscreenItem(null)
  }

  // Create YouTube embed URL with autoplay
  const getYouTubeEmbedUrl = (videoId: string, autoplay: boolean = true, muted: boolean = true) => {
    const params = new URLSearchParams({
      autoplay: autoplay ? '1' : '0',
      mute: muted ? '1' : '0',
      controls: '1',
      rel: '0',
      modestbranding: '1',
      playsinline: '1',
      enablejsapi: '1'
    })
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft") {
        prevSlide()
      } else if (e.code === "ArrowRight") {
        nextSlide()
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [currentItem, isPlaying])

  // Auto-advance slides every 10 seconds for non-video content
  useEffect(() => {
    if (currentItem.type === "image") {
      const timer = setInterval(() => {
        nextSlide()
      }, 10000)
      return () => clearInterval(timer)
    }
  }, [currentIndex, currentItem.type])

  // Handle video end event for auto-advance
  useEffect(() => {
    const video = videoRef.current
    if (video && currentItem.type === "video") {
      const handleEnded = () => {
        // Auto-advance to next video when current video ends
        setCurrentIndex((prev) => {
          if (!hasPlayedFirstFive && prev < 4) {
            return prev + 1
          } else if (!hasPlayedFirstFive && prev === 4) {
            setHasPlayedFirstFive(true)
            return 5 // jump to the next item after the first five
          } else {
            return (prev + 1) % mediaItems.length
          }
        })
        setIsPlaying(false)
      }
      
      video.addEventListener("ended", handleEnded)
      
      return () => {
        video.removeEventListener("ended", handleEnded)
      }
    }
  }, [currentItem, hasPlayedFirstFive])

  return (
    <>
      <section
        id="media-carousel"
        className="py-10 bg-gradient-to-b from-[#262626] via-[#262626] to-[#850101] text-white overflow-hidden relative"
      >
        {/* Removed floating background circles for cleaner design */}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in-up group">
            <h2 className="text-4xl font-bold mb-4 text-hover-glow">
              Ei ASSET Talent Search identifies top 2% of talented students
            </h2>
            <p className="text-xl font-medium text-white bg-[#850101]/90 max-w-3xl mx-auto px-4 py-2 rounded-lg transition-transform duration-300 group-hover:scale-110">
              Discover your child's true potential with the Ei ASSET Talent Search test. Unlock exclusive global opportunities through our prestigious partners like Johns Hopkins CTY and Northwestern CTD - and take the first step in nurturing exceptional talent by enrolling for the test.
            </p>
          </div>

          {/* Main Carousel */}
          <div className="relative animate-scale-in">
            {/* Main Media Display */}
            <div
              className="relative h-[500px] rounded-2xl overflow-hidden bg-black/20 backdrop-blur-sm border border-white/10 card-hover-glow group cursor-pointer"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={(e) => {
                // For local videos, only allow fullscreen if clicking on the video content area (not controls)
                if (currentItem.type === "video") {
                  const target = e.target as HTMLElement
                  const video = target.closest('video')
                  
                  // If clicking on the video element itself, check if it's in the controls area
                  if (video) {
                    const rect = video.getBoundingClientRect()
                    const clickY = e.clientY
                    const controlsHeight = 40 // Approximate height of video controls
                    
                    // If clicking in the bottom area where controls are, don't open fullscreen
                    if (clickY > rect.bottom - controlsHeight) {
                      return
                    }
                  }
                  
                  // If clicking on any control-related elements, don't open fullscreen
                  if (target.tagName === "VIDEO" || target.closest("video")) {
                    // Only open fullscreen if clicking on the main video area, not controls
                    const rect = (target.closest("video") as HTMLVideoElement).getBoundingClientRect()
                    const clickY = e.clientY
                    const controlsHeight = 40
                    
                    if (clickY > rect.bottom - controlsHeight) {
                      return
                    }
                  }
                }
                
                openFullscreen(currentItem)
              }}
            >
              <div className="absolute inset-0">
                {currentItem.type === "image" ? (
                  <img
                    src={currentItem.src || "/placeholder.svg"}
                    alt={currentItem.title}
                    className="w-full h-full object-contain img-hover-zoom"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg";
                    }}
                    loading="eager"
                  />
                ) : currentItem.type === "youtube" && currentItem.youtubeId ? (
                  <div className="relative w-full h-full">
                    <iframe
                      src={getYouTubeEmbedUrl(currentItem.youtubeId, true, true)}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={currentItem.title}
                    />
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <video
                      ref={videoRef}
                      src={currentItem.src}
                      className="w-full h-full object-contain bg-black"
                      controls
                      autoPlay
                      muted={isMuted}
                      preload="metadata"
                      style={{ outline: 'none' }}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onClick={(e) => {
                        // Allow native video control interactions
                        e.stopPropagation()
                      }}
                    />

                  </div>
                )}
              </div>

              {/* Fullscreen Icon (images & YouTube only) */}
              {currentItem.type !== "video" && (
              <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="bg-black/50 text-white p-2 rounded-lg hover:bg-black/70 transition-colors duration-300">
                  <Maximize className="h-4 w-4" />
                </div>
              </div>
              )}

              {/* Media Controls Overlay - Only for YouTube videos */}
              {currentItem.type === "youtube" && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex items-end justify-between">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-2 text-hover-glow">{currentItem.title}</h3>
                        <p className="text-gray-200 max-w-2xl">{currentItem.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Arrows */}
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  prevSlide()
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm btn-hover-lift transition-all duration-300 opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  nextSlide()
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm btn-hover-lift transition-all duration-300 opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>

            {/* Thumbnail Navigation */}
            <div className="mt-8">
              <div className="flex justify-center gap-4 overflow-x-auto pb-4">
                {mediaItems.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => goToSlide(index)}
                    className={`relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 card-hover-scale ${
                      index === currentIndex
                        ? "border-white scale-110 shadow-professional-lg"
                        : "border-white/30 hover:border-white/60 hover:scale-105"
                    }`}
                  >
                    <img
                      src={item.thumbnail || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-contain transition-transform duration-300 hover:scale-110"
                      onLoad={() => {
                        // Thumbnail loaded successfully
                      }}
                      onError={(e) => {
                        // Thumbnail failed to load
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.svg";
                      }}
                      loading="lazy"
                    />
                    {(item.type === "video" || item.type === "youtube") && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black/50 rounded-full p-1 transition-all duration-300 hover:bg-black/70 hover:scale-110">
                          <Play className="h-3 w-3 text-white" />
                        </div>
                      </div>
                    )}
                    {index === currentIndex && <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>}
                  </button>
                ))}
              </div>
            </div>

            {/* Progress Indicators */}
            <div className="flex justify-center mt-6 gap-2">
              {mediaItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                    index === currentIndex ? "bg-white animate-glow" : "bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Fullscreen Modal */}
      <Dialog open={isFullscreen} onOpenChange={closeFullscreen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black border-0 animate-scale-in">
          {fullscreenItem && (
            <div className="relative w-full h-[95vh] group">
              <Button
                variant="ghost"
                size="icon"
                onClick={closeFullscreen}
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white btn-hover-lift transition-all duration-300"
              >
                <X className="h-6 w-6" />
              </Button>

              {fullscreenItem.type === "image" ? (
                <img
                  src={fullscreenItem.src || "/placeholder.svg"}
                  alt={fullscreenItem.title}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
              ) : fullscreenItem.type === "youtube" && fullscreenItem.youtubeId ? (
                <iframe
                  src={getYouTubeEmbedUrl(fullscreenItem.youtubeId, false, false)}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={fullscreenItem.title}
                />
              ) : (
                <video 
                  src={fullscreenItem.src} 
                  controls 
                  autoPlay 
                  className="w-full h-full object-contain bg-black" 
                  style={{ outline: 'none' }}
                />
              )}

              {/* Fullscreen Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-2xl font-bold text-white mb-2 text-hover-glow">{fullscreenItem.title}</h3>
                <p className="text-gray-200">{fullscreenItem.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}