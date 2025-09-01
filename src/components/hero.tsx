'use client'

import { Users, Star, Clock, Phone, UserCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-24 items-start">
          
          {/* Left Side - Hero Content */}
          <div className="space-y-10">
            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Discover the Right{' '}
                <span className="block">Creative Course</span>
                <span className="block">for You</span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl">
              Learn industry-relevant skills, grow with a creative community, and unlock your potential, all in one beautiful, supportive space.
            </p>

            {/* CTA Button */}
            <div className="pt-2">
              <Button 
                size="lg"
                className="bg-gray-900 hover:bg-gray-800 text-white rounded-[50px] px-8 py-4 text-lg font-medium"
              >
                Explore Courses
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center space-x-4 pt-2">
              {/* Profile Pictures */}
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium text-sm">
                  A
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white font-medium text-sm">
                  B
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-400 to-red-500 flex items-center justify-center text-white font-medium text-sm">
                  C
                </div>
              </div>
              <div className="text-gray-600">
                Joined <span className="font-semibold text-gray-900">210k+</span> people already
              </div>
            </div>
          </div>

                    {/* Right Side - Single Hero Image */}
          <div className="flex justify-end items-end h-full w-full">
            <Image
              src="/img/hero-img2.png"
              alt="Hero image"
              width={1800}
              height={1200}
              className="rounded-2xl w-full h-full object-cover scale-110"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
