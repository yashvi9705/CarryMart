
import { CheckCircle, Phone, Mail, Clock, Facebook, Instagram, Twitter, ArrowRight } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-blue-950 text-white">
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Brand */}
        <div>
          <h3 className="text-2xl font-bold mb-3">
            <span className="text-yellow-300">Carry</span><span className="text-white">Mart</span>
          </h3>
          <p className="text-sm text-blue-100 mb-4">Your trusted wholesale partner for bulk products, premium quality, and exceptional service.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-yellow-300 transition-colors"><Facebook className="w-5 h-5" /></a>
            <a href="#" className="hover:text-yellow-300 transition-colors"><Instagram className="w-5 h-5" /></a>
            <a href="#" className="hover:text-yellow-300 transition-colors"><Twitter className="w-5 h-5" /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-4 text-yellow-300">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-yellow-300 transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-yellow-300 transition-colors">Products</a></li>
            <li><a href="#" className="hover:text-yellow-300 transition-colors">Delivery Info</a></li>
            <li><a href="#" className="hover:text-yellow-300 transition-colors">Contact</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-semibold mb-4 text-yellow-300">Contact & Hours</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <Phone className="w-4 h-4 mt-1 flex-shrink-0 text-yellow-300" />
              <a href="tel:+16472982309" className="hover:text-yellow-300 transition-colors">(+1) 647-298-2309</a>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="w-4 h-4 mt-1 flex-shrink-0 text-yellow-300" />
              <a href="mailto:hello@carrymart.ca" className="hover:text-yellow-300 transition-colors">hello@carrymart.ca</a>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="w-4 h-4 mt-1 flex-shrink-0 text-yellow-300" />
              <span className="text-blue-100">24/7 Availability</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-blue-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-blue-100">
        <p>&copy; 2026 CarryMart. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-yellow-300 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-yellow-300 transition-colors">Terms & Conditions</a>
        </div>
      </div>
    </div>
  </footer>
  )
}
