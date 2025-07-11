import { Card, CardContent } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#850101] to-[#650101] text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Terms and Conditions</h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="prose lg:prose-lg prose-ul:list-disc prose-ul:pl-6 max-w-none p-8 space-y-4">
              <p>Welcome to our website. If you continue to browse and use this website you are agreeing to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern Educational Initiatives Pvt Ltd (EI)'s relationship with you in relation to this website and the offering/s which you order through this website.</p>
              <p>The term <strong>"Educational Initiatives Pvt Ltd"</strong> or <strong>"EI"</strong> or <strong>"us"</strong> or <strong>"we"</strong> refers to the owner of the website whose registered office is The CUBE - Karle Town Center, 100 Ft, Nada Prabhu Kempe Gowda Main Rd, Next to Nagavara, Bengaluru, Karnataka 560045. (CIN: U80211GJ2000PTC038692103). The term <strong>"you"</strong> refers to the user/viewer of our website. The use of this website and the products purchased on this website is subject to the following terms of use:</p>

              <h2 className="font-bold">Acceptance of Terms</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>By accessing and using the Ei ATS competition website (the "Site"), you agree to comply with and be bound by these Terms of Use.</li>
              </ul>

              <h2 className="font-bold">Registration and Fees</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>To participate in the Ei ATS competition, you must register on the Site and pay the registration fee, which is 250 AED (United Arab Emirates Dirhams) or an equivalent amount as per your country's currency.</li>
                <li>Only online payment is accepted.</li>
              </ul>

              <h2 className="font-bold">Eligibility</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>The Ei ATS competition is open to students in grades 3 to 10.</li>
              </ul>

              <h2 className="font-bold">User Conduct</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Users of the Site must conduct themselves in a respectful and lawful manner.</li>
                <li>Users are prohibited from engaging in any activity that may harm the Site, its content, or other users.</li>
              </ul>

              <h2 className="font-bold">Intellectual Property</h2>
              <h3 className="font-bold">Property Rights</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>All content on the Site, including text, graphics, logos, images, audio, and video materials, are the property of Educational Initiatives Pvt Limited and are protected by copyright and other intellectual property laws.</li>
                <li>EI reserves the right to cancel, suspend, postpone this competition, rewards, test, promotions, etc. at its discretion and without any prior notice. To qualify for consideration in any award category, there must be a minimum of 300 candidates enrolled and actively participating in each respective grade.</li>
              </ul>

              <h2 className="font-bold">Privacy</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>User information is collected and used in accordance with our <a href="/privacy">Privacy Policy</a>.</li>
              </ul>

              <h2 className="font-bold">Liability</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Educational Initiatives Pvt Limited and its affiliates are not responsible for any direct, indirect, incidental, consequential, or punitive damages arising from the use of the Site or participation in the Ei ATS competition.</li>
              </ul>

              <h2 className="font-bold">Modification of Terms</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Educational Initiatives Pvt Limited reserves the right to modify or amend these Terms of Use at any time. It is your responsibility to regularly review these terms to stay informed of any changes.</li>
              </ul>

              <h2 className="font-bold">Termination</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Educational Initiatives Pvt Limited reserves the right to terminate or suspend your access to the Site and the Ei ATS competition at its discretion, without prior notice.</li>
              </ul>

              <h2 className="font-bold">Governing Law</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>These Terms of Use are governed by and construed in accordance with the laws of India, and jurisdiction is Ahmedabad in India.</li>
              </ul>

              <h2 className="font-bold">Contact Information</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>If you have any questions or concerns regarding these Terms of Use, please contact us at <a href="mailto:competition@ei.study">competition@ei.study</a>.</li>
                <li>By using the Site, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
} 