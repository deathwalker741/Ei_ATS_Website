import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Users, GraduationCap, Award } from "lucide-react"

const partners = [
  {
    id: "johns-hopkins",
    name: "Johns Hopkins Center for Talented Youth (CTY)",
    description:
      "World-renowned programs for academically gifted students with online and campus-based courses covering advanced topics in mathematics, science, humanities, and more.",
    eligibility: "98th percentile or higher in English or Math",
    applicationProcess: "Submit ATS scores, complete CTY application, provide academic transcripts",
    website: "https://cty.jhu.edu/",
    image: "/John-Hopkins-CTY.png",
    grades: "Grades 2-12",
    features: ["Online courses", "Summer programs", "Advanced curriculum"],
  },
  {
    id: "uc-berkeley",
    name: "UC Berkeley Academic Talent Development Program (ATDP)",
    description:
      "Summer residential and online programs designed to challenge academically talented students with college-level coursework and research opportunities.",
    eligibility: "80%+ priority admission, 50-79% with portfolio review",
    applicationProcess: "ATS qualification, application form, academic portfolio submission",
    website: "https://atdp.berkeley.edu/",
    image: "/UC Berkeley ATDP.png",
    grades: "Grades 7-10",
    features: ["Residential programs", "College prep", "Research projects"],
  },
  {
    id: "northwestern",
    name: "Northwestern Center for Talent Development (CTD)",
    description:
      "Comprehensive programs for gifted children including online courses, summer programs, and family workshops designed to nurture academic talent.",
    eligibility: "90%+ direct admission, <90% with portfolio review",
    applicationProcess: "ATS scores, CTD application, recommendation letters",
    website: "https://www.ctd.northwestern.edu/",
    image: "/Northwestern CTD.png",
    grades: "Ages 3-12",
    features: ["Family programs", "Online learning", "Talent development"],
  },
  {
    id: "purdue",
    name: "Purdue University Gifted Education Research Institute (GER²I)",
    description:
      "COMET, STAR & PULSAR programs offering advanced learning opportunities in STEM fields with hands-on research and project-based learning.",
    eligibility: "90%+ direct admission, 50-89% with portfolio review",
    applicationProcess: "ATS qualification, program-specific application, academic portfolio",
    website: "https://www.education.purdue.edu/geri/",
    image: "/Purdue GERI.png",
    grades: "Grades 5-12",
    features: ["STEM focus", "Research projects", "Advanced coursework"],
  },
  {
    id: "sig",
    name: "Summer Institute for the Gifted (SIG)",
    description:
      "Intensive 2-3 week residential programs at prestigious universities offering academic enrichment and social experiences for gifted students.",
    eligibility: "90th percentile or higher in standardized tests",
    applicationProcess: "ATS scores, SIG application, health forms, recommendations",
    website: "https://www.giftedstudy.org/",
    image: "/sig.jpg",
    grades: "Ages 5-17",
    features: ["Residential experience", "University campuses", "Social development"],
  },
  {
    id: "genwise",
    name: "GENWISE Programme",
    description:
      "Innovative program focusing on computational thinking, mathematical problem-solving, and scientific investigation to develop higher-order thinking skills.",
    eligibility: "ATS qualification with strong performance in Math/Science",
    applicationProcess: "ATS scores, GENWISE application, aptitude assessment",
    website: "https://www.genwise.in/",
    image: "/genwise.png",
    grades: "Grades 6-10",
    features: ["Computational thinking", "Problem solving", "Scientific inquiry"],
  },
]

export default function ProgrammesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section id="hero" className="bg-gradient-to-br from-[#850101] to-[#650101] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">University Partner Programmes</h1>
          <p className="text-xl text-gray-100 max-w-3xl mx-auto">
            Access world-class educational opportunities through our prestigious university partnerships. Each program
            is designed to challenge and nurture academically gifted students.
          </p>
        </div>
      </section>

      {/* Partners Grid */}
      <section id="programmes" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {partners.map((partner, index) => (
              <Card key={index} id={partner.id} className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <img
                    src={partner.image || "/placeholder.svg"}
                    alt={partner.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <CardTitle className="text-xl text-[#850101]">{partner.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">{partner.description}</p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-[#850101]" />
                        <span className="font-medium text-sm">{partner.grades}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-[#850101]" />
                        <span className="text-sm text-gray-600">Eligibility: {partner.eligibility}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {partner.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <GraduationCap className="h-3 w-3 text-[#850101]" />
                          <span className="text-xs text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-sm text-[#850101] mb-2">Application Process:</h4>
                    <p className="text-sm text-gray-600">{partner.applicationProcess}</p>
                  </div>

                  <div className="flex gap-3">
                    <Button asChild className="bg-[#850101] hover:bg-[#650101] flex-1">
                      <a href={partner.website} target="_blank" rel="noopener noreferrer">
                        Visit Website <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      className="border-[#850101] text-[#850101] hover:bg-[#850101] hover:text-white"
                    >
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="programmes-cta" className="py-16 bg-[#850101] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Access These Programs?</h2>
          <p className="text-xl text-gray-200 mb-8">
            Register for ATS 2025 and unlock opportunities at world's leading universities
          </p>
          <Button size="lg" className="bg-white text-[#850101] hover:bg-gray-100 font-semibold" asChild>
            <a href="https://ats.ei.study/ats_registration.php" target="_blank" rel="noopener noreferrer">
              Register for ATS 2025
            </a>
          </Button>
        </div>
      </section>
    </div>
  )
}
