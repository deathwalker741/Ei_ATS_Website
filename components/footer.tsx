import Link from "next/link"
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-[#850101] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">Ei</span>
              </div>
              <span className="font-bold text-lg">Ei ASSET Talent Search</span>
            </div>
            <p className="text-gray-400 text-sm">
              Identifying the top 2% gifted students globally through comprehensive talent assessment.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/programmes" className="text-gray-400 hover:text-white">
                  Programmes
                </Link>
              </li>
              <li>
                <Link href="/for-students" className="text-gray-400 hover:text-white">
                  For Students
                </Link>
              </li>
              <li>
                <Link href="/for-schools" className="text-gray-400 hover:text-white">
                  For Schools
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-gray-400 hover:text-white">
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-gray-400 hover:text-white">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>eitalentsearch@ei.study</p>
              <p>+91 80 4718 7451</p>
              <p>Mon-Sat, 9AM-6PM</p>
            </div>
            <div className="flex space-x-4 mt-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Linkedin className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 Educational Initiatives Pvt Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
