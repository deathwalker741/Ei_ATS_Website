"use client"

export function GiftednessSection() {
  return (
    <section id="giftedness" className="py-20 bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-hover-glow animate-fade-in-up">
          Why Giftedness is Important
        </h2>
        <div className="max-w-4xl mx-auto animate-fade-in-up" style={{animationDelay:'0.2s'}}>
          <div className="bg-white/70 backdrop-blur-md border border-gray-200 shadow-professional-lg rounded-2xl p-6 md:p-10">
            <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6">
              Giftedness, defined by psychologist <strong className="text-[#850101]">Joseph Renzulli</strong> as the intersection of above-average ability, creativity, and task commitment, plays a critical role in individual and societal progress. Despite the myth that gifted students will succeed on their own and only weaker students need help, research shows gifted individuals often face challenges—social isolation, uneven academic performance, or emotional struggles—and require specialised support.
            </p>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              Investing in gifted education pays off significantly. For example, every <strong className="text-[#850101]">IIT</strong> graduate—selected and nurtured through a system that identifies giftedness—has, on average, created <strong className="text-[#850101]">100 jobs</strong>. Moreover, <strong className="text-[#850101]">54%</strong> of India's top 500 companies have at least one IIT alumnus on their board. Globally, structured gifted programmes have produced leaders in technology, arts, and science, including founders of Google and Facebook, and Nobel Laureates. Recognising and nurturing the top 1–2% talent during formative years (ages 12–13) is not just beneficial—it's vital for national development.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
} 