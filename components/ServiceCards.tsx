'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

interface ServiceCard {
  icon: string
  title: string
  description: string
  link?: string
  linkText?: string
  highlight?: string
  backgroundImage: string
}

const services: ServiceCard[] = [
  {
    icon: '🎨',
    title: 'Photo Restoration',
    description: 'Bringing damaged and aged photographs back to life with meticulous attention to detail and professional techniques.',
    link: '/restores',
    linkText: 'View Portfolio',
    highlight: 'Before/After Magic',
    backgroundImage: '/content/restores/PROY-001/after.jpg'
  },
  {
    icon: '✨',
    title: 'Creative Edits',
    description: 'Transform ordinary images into extraordinary art through creative manipulation and composite work.',
    link: '/edits',
    linkText: 'See Creations',
    highlight: 'Unlimited Creativity',
    backgroundImage: '/content/edits/PROY-ABC/final/blackdog2.png'
  },
  {
    icon: '📸',
    title: 'Portrait Enhancement',
    description: 'Professional portrait retouching and enhancement to bring out the best in every photograph.',
    link: '/portraits',
    linkText: 'Browse Portraits',
    highlight: 'Natural Beauty',
    backgroundImage: '/content/portraits/PROY-PORT1/final/can-anyone-do-a-linkdn-photo-maybe-with-a-suit-v0-axxquovdg3ef1.webp'
  },
  {
    icon: '🎬',
    title: 'Video Production',
    description: 'Professional video editing, color grading, and post-production work for all types of content.',
    link: '/videos',
    linkText: 'Watch Videos',
    highlight: 'Cinematic Quality',
    backgroundImage: '/content/videos/PROY-VID3/bvbbb.jpg'
  }
]

export default function ServiceCards() {
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = cardsRef.current.findIndex(ref => ref === entry.target)
            if (index !== -1 && !visibleCards.includes(index)) {
              setVisibleCards(prev => [...prev, index])
            }
          }
        })
      },
      { threshold: 0.1, rootMargin: '50px' }
    )

    cardsRef.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => {
      cardsRef.current.forEach((ref) => {
        if (ref) observer.unobserve(ref)
      })
    }
  }, [visibleCards])

  return (
    <section className="py-20 px-4 relative overflow-visible">
      {/* Radial glow effect */}
      <div className="absolute inset-0 bg-gradient-radial from-criforge-accent/8 via-criforge-accent/4 to-transparent opacity-60" />
      <div className="absolute -inset-32 bg-gradient-radial from-criforge-accent/6 via-criforge-accent/2 to-transparent opacity-40 scale-125" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-white mb-4">
            What I Do
          </h2>
          <p className="text-xl text-criforge-text-secondary max-w-3xl mx-auto">
            Professional visual artist specializing in photo restoration, creative editing, and video production
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              ref={(el) => { cardsRef.current[index] = el }}
              className={`
                relative group transform transition-all duration-700
                ${visibleCards.includes(index) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
                }
              `}
              style={{
                transitionDelay: `${index * 100}ms`
              }}
            >
              {/* Card */}
              <div className="relative rounded-2xl p-8 h-full border border-criforge-gray/30 hover:border-criforge-accent/50 transition-all duration-500 hover:shadow-2xl hover:shadow-criforge-accent/20 hover:-translate-y-2 overflow-hidden">
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${service.backgroundImage})` }}
                />
                
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/90 group-hover:from-black/70 group-hover:via-black/60 group-hover:to-black/80 transition-all duration-500" />
                
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-criforge-accent/0 to-criforge-accent/0 group-hover:from-criforge-accent/10 group-hover:to-transparent transition-all duration-500" />
                
                {/* Highlight Badge */}
                {service.highlight && (
                  <div className="absolute top-6 right-6 bg-black text-white text-xs px-4 py-2 rounded-full font-bold z-10">
                    {service.highlight}
                  </div>
                )}

                {/* Content - Using flexbox for equal height distribution */}
                <div className="relative text-center h-full flex flex-col justify-between pt-12">
                  <div className="flex-grow flex flex-col justify-center">
                    <h3 className="text-2xl font-cinzel font-bold text-white mb-4 group-hover:text-criforge-accent transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-criforge-text-secondary mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Stars */}
                    <div className="flex justify-center gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-criforge-accent text-lg">★</span>
                      ))}
                    </div>
                  </div>

                  {/* Button - Always at bottom */}
                  <div className="mt-auto">
                    {service.link && (
                      <Link
                        href={service.link}
                        className="inline-block bg-gradient-to-r from-criforge-accent to-criforge-accent-dark text-white px-8 py-3 rounded-full font-bold hover:shadow-lg hover:shadow-criforge-accent/50 transition-all duration-300 hover:scale-105"
                      >
                        {service.linkText}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Upwork CTA */}
        <div className="mt-16 text-center">
          <div 
            className={`
              inline-block transform transition-all duration-1000
              ${visibleCards.length > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
            `}
            style={{ transitionDelay: '600ms' }}
          >
            <div className="bg-gradient-to-r from-criforge-accent/20 to-transparent p-8 rounded-2xl border border-criforge-accent/30">
              <h3 className="text-2xl font-cinzel font-bold text-white mb-4">
                Available for Hire
              </h3>
              <p className="text-criforge-text-secondary mb-6 max-w-2xl mx-auto">
                Looking for professional photo restoration or creative editing services? 
                I'm available on Upwork with 100% job success rate and 5-star reviews.
              </p>
              <a
                href="https://www.upwork.com/freelancers/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-600/50"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.548-1.405-.002-2.543-1.143-2.545-2.548V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z"/>
                </svg>
                Hire Me on Upwork
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
