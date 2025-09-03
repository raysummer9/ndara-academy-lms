'use client'

import { Button } from '@/components/ui/button'
import { Users, Star, Clock, Phone, UserCheck } from 'lucide-react'
import Image from 'next/image'

export default function Hero() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center">
        {/* Left Column - Content */}
        <div className="space-y-6 md:space-y-8">
          {/* Headline */}
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight md:leading-tight">
              Discover the Right Creative Course for You
            </h1>
          </div>

          {/* Description */}
          <div>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Learn industry-relevant skills, grow with a creative community, and unlock your potential, all in one beautiful, supportive space.
            </p>
          </div>

          {/* CTA Button */}
          <div className="pt-2">
            <Button 
              size="lg"
              className="w-full md:w-auto px-8 py-3 text-lg font-semibold bg-gray-900 hover:bg-gray-800 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Explore Courses
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center space-x-4 pt-1">
            {/* Profile Pictures */}
            <div className="flex items-center">
              <img 
                src="/assets/users-joined.svg" 
                alt="Users joined" 
                className="h-8 md:h-10 w-auto object-contain"
              />
            </div>
            <div className="text-sm md:text-base text-gray-600">
              Joined <span className="font-semibold text-gray-900">210k+</span> people already
            </div>
          </div>
        </div>

        {/* Right Column - Image (Responsive for all devices) */}
        <div className="flex justify-center lg:justify-end">
          <img
            src="/img/hero-img2.png"
            alt="Students learning together"
            className="w-full max-w-sm md:max-w-md lg:max-w-6xl h-auto object-cover rounded-lg lg:rounded-2xl"
            width={1800}
            height={1200}
          />
        </div>
      </div>
    </div>
  )
}
