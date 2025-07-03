import { MediaCarousel } from "@/components/media-carousel"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { GiftednessSection } from "@/components/giftedness-section"
import { RewardsSection } from "@/components/rewards-section"
import { HistorySection } from "@/components/history-section"
import { PartnersCarousel } from "@/components/partners-carousel"
import { ExamInfo } from "@/components/exam-info"
import { TestimonialsCarousel } from "@/components/testimonials-carousel"
import { AlumniCTA } from "@/components/alumni-cta"
import { FAQSection } from "@/components/faq-section"
import { ContactSection } from "@/components/contact-section"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <MediaCarousel />
      <HeroSection />
      <GiftednessSection />
      <AboutSection />
      <RewardsSection />
      <HistorySection />
      <PartnersCarousel />
      <ExamInfo />
      <TestimonialsCarousel />
      <AlumniCTA />
      <FAQSection />
      <ContactSection />
    </main>
  )
}
