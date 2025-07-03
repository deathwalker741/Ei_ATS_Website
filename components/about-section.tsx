import { Card, CardContent } from "@/components/ui/card"
import { Users, BookOpen, Clock, Globe } from "lucide-react"

export function AboutSection() {
  const stats = [
    {
      icon: Users,
      number: "1000+",
      label: "Alumni",
      description: "From 100+ schools globally",
    },
    {
      icon: BookOpen,
      number: "100+",
      label: "Courses",
      description: "Delivered since inception",
    },
    {
      icon: Clock,
      number: "15+",
      label: "Years",
      description: "Of excellence in talent identification",
    },
    {
      icon: Globe,
      number: "Top 2%",
      label: "Global Reach",
      description: "Identifying gifted students worldwide",
    },
  ]

  return (
    <section id="about" className="py-20 bg-white border-b border-[#850101]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-hover-glow">
            About Ei ASSET Talent Search
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Educational Initiatives' comprehensive platform for identifying and nurturing academically gifted students
            through rigorous assessment and world-class educational opportunities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="text-center border-0 shadow-professional hover:shadow-professional-xl card-hover group transition-all duration-500"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-[#850101] rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-500 group-hover:scale-110 group-hover:bg-[#650101] group-hover:shadow-lg icon-hover-bounce">
                  <stat.icon className="h-8 w-8 text-white transition-transform duration-300 group-hover:rotate-12" />
                </div>
                <h3 className="text-3xl font-bold text-[#850101] mb-2 transition-all duration-300 group-hover:scale-110 text-hover-glow">
                  {stat.number}
                </h3>
                <h4 className="text-lg font-semibold text-gray-900 mb-2 transition-colors duration-300 group-hover:text-[#850101]">
                  {stat.label}
                </h4>
                <p className="text-gray-600 transition-colors duration-300 group-hover:text-gray-800">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
