import { Card, CardContent } from "@/components/ui/card"

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#850101] to-[#650101] text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Refund Policy</h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="prose lg:prose-lg prose-ul:list-disc prose-ul:pl-6 max-w-none p-8 space-y-4">
              <h2 className="font-bold">Registration Fee Structure</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>The registration fee is 250 AED (United Arab Emirates Dirham).</li>
                <li>Fees for participants from other countries will be adjusted based on the equivalent of 250 AED according to the conversion rate of their respective currencies.</li>
              </ul>

              <h2 className="font-bold">Refund Eligibility</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Refund requests will be considered solely in cases of technical glitches originating from Educational Initiatives, preventing participation.</li>
              </ul>

              <h2 className="font-bold">Refund Process</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Initiate a refund request by contacting customer support at <a href="mailto:atsinternational@ei.study">atsinternational@ei.study</a> within 7 days from the competition start.</li>
                <li>Include the participant’s full name, registration details, and a description of the technical glitch experienced.</li>
              </ul>

              <h2 className="font-bold">Refund Approval and Payment</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Refund requests are reviewed and approved within 14 days.</li>
                <li>Refunds are processed using the original payment method: back to the card for credit/debit card payments, or an alternative agreed method for other payments.</li>
              </ul>

              <h2 className="font-bold">Deductions and Charges</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>No processing fee is charged for refunds due to technical glitches caused by Educational Initiatives.</li>
              </ul>

              <h2 className="font-bold">Currency Conversion and Variations</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Refunds are issued in AED. Variations in local currency amounts may occur due to currency fluctuations for participants whose fees were adjusted.</li>
              </ul>

              <h2 className="font-bold">Payment Gateway Considerations</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>We collaborate with our payment gateway partners to ensure a smooth refund process.</li>
                <li>Participants are advised to contact their payment provider for any concerns regarding refund transactions.</li>
              </ul>

              <p>
                By registering, participants and parents/guardians acknowledge and accept this refund policy. Please email <a href="mailto:atsinternational@ei.study">atsinternational@ei.study</a> for further policy clarification or questions. We’re excited for an enjoyable competition experience for all!
              </p>

              <h2 className="font-bold">Cancellation Policy</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>No cancellation is available if there is no policy.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
} 