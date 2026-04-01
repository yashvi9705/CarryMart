import { ChevronRight, Play } from 'lucide-react'
import Image from 'next/image'

export default function Hero() {
  return (
    <div className="w-full bg-primary text-white py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div>
              <p className="text-sm font-light tracking-widest text-accent mb-2">WE ARE DELICACY</p>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white mb-2">
                Choose Delicacy
              </h1>
              <h2 className="text-3xl md:text-4xl font-light text-white">
                The Best <span className="text-accent font-semibold">Healthy</span> Way to Life
              </h2>
            </div>
            
            <p className="text-white/80 text-base leading-relaxed max-w-md font-light">
              Fresh, organic groceries delivered to your doorstep. Shop the finest selection of fruits, vegetables, and essentials.
            </p>

            <div className="flex items-center gap-4 pt-4">
              <button className="bg-accent text-white px-8 py-3 rounded hover:opacity-90 transition-opacity font-medium">
                Shop Now
              </button>
              <button className="flex items-center gap-2 text-white hover:text-accent transition-colors border-b border-white pb-1">
                <Play className="w-4 h-4" />
                <span className="text-sm font-light">Watch Video</span>
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-96 md:h-full">
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src="https://images.unsplash.com/photo-1488459716781-6c3571cedfe3?w=600&h=400&fit=crop"
                alt="Fresh produce"
                width={600}
                height={400}
                className="object-contain drop-shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
