import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Medal, Award, Star } from "lucide-react"

const rewards = [
  {
    icon: Trophy,
    title: "Gold Scholar",
    percentile: "95-99 Percentile",
    benefit: "Medal + Certificate",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    icon: Medal,
    title: "Silver Scholar",
    percentile: "90-94 Percentile",
    benefit: "Medal + Certificate",
    color: "bg-gray-200 text-gray-700",
  },
  {
    icon: Award,
    title: "Bronze Scholar",
    percentile: "85-89 Percentile",
    benefit: "Medal + Certificate",
    color: "bg-amber-100 text-amber-700",
  },
  {
    icon: Star,
    title: "Participation Certificate",
    description: "All participants",
    benefit: "Official participation certificate",
    color: "bg-gray-100 text-gray-700",
  },
]

export function RewardsSection() {
  return (
    <section id="rewards" className="py-20 bg-[#FFF7F7] border-t border-[#850101]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Rewards Structure</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Recognition and rewards for academic excellence across different achievement levels
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {rewards.map((reward, index) => (
            <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${reward.color}`}>
                  <reward.icon className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-bold text-[#850101] mb-2">{reward.title}</h3>
                {reward.percentile && <p className="text-lg font-semibold text-gray-700 mb-3">{reward.percentile}</p>}
                {reward.description && <p className="text-gray-600 mb-3">{reward.description}</p>}
                <p className="text-sm font-medium text-gray-800 bg-white p-3 rounded-lg">{reward.benefit}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 max-w-2xl mx-auto">
            <span className="font-semibold text-[#850101]">Note:</span> Minimum 300 participants required per grade for
            award qualification. All participants receive recognition for their academic achievement.
          </p>
        </div>
      </div>
    </section>
  )
}
