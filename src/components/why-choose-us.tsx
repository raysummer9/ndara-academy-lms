'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Sun } from 'lucide-react';

export default function WhyChooseUs() {
  const features = [
    {
      icon: Sun,
      title: "Purpose-Driven Courses",
      description: "Learn the skills that move you forward like thinking creatively, telling better stories, building strong brands, and designing experiences."
    },
    {
      icon: Sun,
      title: "Creative Community Support",
      description: "You're not learning alone. You are joining a vibrant hub of learners, tutors, and mentors cheering you on."
    },
    {
      icon: Sun,
      title: "Clarity-Focused Learning Experience",
      description: "Our platform is built to help you stay focused, track progress, and move at your own pace without the overwhelm."
    },
    {
      icon: Sun,
      title: "Curated for African Creatives, Built for the World",
      description: "Our content speaks your language, solves your challenges, and prepares you for global opportunities."
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          {/* WHY CHOOSE US Pill */}
          <div className="inline-flex items-center justify-center mb-6">
            <span 
              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-black"
              style={{ 
                background: 'linear-gradient(90.21deg, #FFFFF0 0.21%, #F0FFD7 97.74%)',
                fontFamily: 'Poppins, sans-serif'
              }}
            >
              <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
              WHY CHOOSE US?
            </span>
          </div>

          {/* Main Heading */}
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-6"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Because Creativity Deserves Clarity.
          </h2>

          {/* Description */}
          <p 
            className="text-lg md:text-xl text-black max-w-4xl mx-auto leading-relaxed"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            At Ndara Academy, we don't just teach design, we help you think, build, and grow with purpose. 
            We give you industry-relevant skills, a community that gets you, and a learning space that feels like home.
          </p>
        </div>

        {/* Main Content Grid - Image Center with Cards on Sides */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-16">
          {/* Left Column - Two Features */}
          <div className="lg:col-span-1 flex flex-col justify-between h-[500px]">
            {/* Top Left Feature */}
            <div className="bg-white p-6 rounded-lg text-center">
              <div className="flex flex-col items-center">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: '#DCDFFF' }}
                >
                  <Sun className="w-6 h-6 text-white" />
                </div>
                <h3 
                  className="text-xl font-bold text-black mb-3"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {features[0].title}
                </h3>
                <p 
                  className="text-black leading-relaxed"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {features[0].description}
                </p>
              </div>
            </div>

            {/* Bottom Left Feature */}
            <div className="bg-white p-6 rounded-lg text-center">
              <div className="flex flex-col items-center">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: '#DCDFFF' }}
                >
                  <Sun className="w-6 h-6 text-white" />
                </div>
                <h3 
                  className="text-xl font-bold text-black mb-3"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {features[1].title}
                </h3>
                <p 
                  className="text-black leading-relaxed"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {features[1].description}
                </p>
              </div>
            </div>
          </div>

          {/* Center - Image */}
          <div className="lg:col-span-1 order-first lg:order-none">
            <div className="relative">
              {/* Image */}
              <div className="relative w-full max-w-[400px] h-[500px] mx-auto">
                <Image
                  src="/img/why-choose-us-Image.png"
                  alt="Creative professional working"
                  fill
                  className="object-cover scale-150"
                  style={{ 
                    borderRadius: '32px'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Two Features */}
          <div className="lg:col-span-1 flex flex-col justify-between h-[500px]">
            {/* Top Right Feature */}
            <div className="bg-white p-6 rounded-lg text-center">
              <div className="flex flex-col items-center">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: '#DCDFFF' }}
                >
                  <Sun className="w-6 h-6 text-white" />
                </div>
                <h3 
                  className="text-xl font-bold text-black mb-3"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {features[2].title}
                </h3>
                <p 
                  className="text-black leading-relaxed"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {features[2].description}
                </p>
              </div>
            </div>

            {/* Bottom Right Feature */}
            <div className="bg-white p-6 rounded-lg text-center">
              <div className="flex flex-col items-center">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: '#DCDFFF' }}
                >
                  <Sun className="w-6 h-6 text-white" />
                </div>
                <h3 
                  className="text-xl font-bold text-black mb-3"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {features[3].title}
                </h3>
                <p 
                  className="text-black leading-relaxed"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {features[3].description}
                </p>
              </div>
            </div>
          </div>
        </div>


        {/* Call to Action */}
        <div className="text-center">
          <Link 
            href="/register"
            className="inline-block bg-black text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-800 transition-colors duration-200"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
}
