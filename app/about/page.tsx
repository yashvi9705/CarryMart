'use client'

import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Check, Users, Zap, Globe } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header cartCount={0} onCartClick={() => {}} />
      
      <main className="flex-1 bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-blue-50 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">About CarryMart</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your trusted partner for fast, reliable grocery delivery. We bring fresh products to your doorstep with unbeatable prices.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                At CarryMart, we believe that quality groceries should be accessible to everyone. Our mission is to revolutionize grocery shopping by providing the freshest products at the most competitive prices, delivered right to your home.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                We partner with local farmers and premium suppliers to ensure that every item you receive meets our strict quality standards. With our innovative platform and dedicated team, we're committed to making grocery shopping faster, easier, and more affordable.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Whether you're looking for fresh vegetables, dairy products, or pantry staples, CarryMart has everything you need with lightning-fast delivery.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
                <p className="text-gray-600 text-sm">Happy Customers</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-3xl font-bold text-blue-600 mb-2">2M+</div>
                <p className="text-gray-600 text-sm">Orders Delivered</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                <p className="text-gray-600 text-sm">Product Varieties</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                <p className="text-gray-600 text-sm">Customer Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Core Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
              <Check className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality First</h3>
              <p className="text-gray-600 text-sm">
                We guarantee the freshest, highest-quality products sourced from trusted suppliers.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
              <Zap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Lightning Fast</h3>
              <p className="text-gray-600 text-sm">
                Experience ultra-fast delivery with our efficient logistics network and dedicated team.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Customer Centric</h3>
              <p className="text-gray-600 text-sm">
                Your satisfaction is our priority. We provide 24/7 support and hassle-free returns.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
              <Globe className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Sustainable</h3>
              <p className="text-gray-600 text-sm">
                We're committed to eco-friendly practices and reducing our environmental impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      {/* <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet Our Team</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold">
                JD
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">John Doe</h3>
              <p className="text-gray-600 mb-3">Founder & CEO</p>
              <p className="text-gray-500 text-sm">
                Visionary entrepreneur with 10+ years of experience in e-commerce and logistics.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold">
                SA
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">Sarah Anderson</h3>
              <p className="text-gray-600 mb-3">Chief Operations Officer</p>
              <p className="text-gray-500 text-sm">
                Operations expert dedicated to optimizing delivery networks and customer experience.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold">
                MK
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">Michael Kumar</h3>
              <p className="text-gray-600 mb-3">Head of Technology</p>
              <p className="text-gray-500 text-sm">
                Tech innovator building scalable platforms to enhance our delivery ecosystem.
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-6">Join the CarryMart Community</h2>
          <p className="text-lg text-blue-900 mb-8 max-w-2xl mx-auto">
            Experience the future of grocery shopping. Download our app or visit our store to start saving today.
          </p>
          <Link
            href="/"
            className="inline-block bg-blue-800 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  )
}
