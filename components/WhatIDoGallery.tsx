"use client"

import { motion } from "framer-motion"

export default function WhatIDoGallery() {
  // Tus imágenes reales del portfolio - Ahora con más imágenes para llenar los espacios
  const portfolioImages = [
    // Imágenes adicionales para la izquierda
    {
      src: "/content/restores/PROY-009/before.jpg.webp",
      alt: "Before Restoration - Original damaged photo",
      category: "Before Work"
    },
    {
      src: "/content/edits/PROY-ABC25/sources/t-shirt-text-edit-v0-cy7ejugaxzbf1.webp",
      alt: "Source Material - Original content",
      category: "Source Files"
    },
    {
      src: "/content/restores/PROY-008/after.jpg.webp",
      alt: "Restoration Process - Work in progress",
      category: "Process"
    },
    
    // Imágenes principales (las que ya tenías)
    {
      src: "/content/restores/PROY-009/after.jpg.webp",
      alt: "Photo Restoration - Vintage photograph restoration",
      category: "Photo Restoration"
    },
    {
      src: "/content/edits/PROY-ABC23/final/add-creepy-ghost-like-figure-v0-ho3tl1rw7idf1.webp",
      alt: "Creative Edits - Digital art and manipulation",
      category: "Creative Edits"
    },
    {
      src: "/content/portraits/PROY-PORT1/final/can-anyone-do-a-linkdn-photo-maybe-with-a-suit-v0-axxquovdg3ef1.webp",
      alt: "Portrait Enhancement - Professional headshot retouching",
      category: "Portrait Enhancement"
    },
    {
      src: "/content/videos/PROY-VID3/bvbbb.jpg",
      alt: "Video Production - Professional video editing and color grading",
      category: "Video Production"
    },
    {
      src: "/content/edits/PROY-ABC22/final/could-someone-kindly-swap-his-face-please-and-sharpen-the-v0-yrmu1c7cjncf1.webp",
      alt: "Digital Manipulation - Advanced photo editing",
      category: "Digital Art"
    },
    {
      src: "/content/restores/PROY-007/after.jpg.webp",
      alt: "Restoration Work - Bringing old photos back to life",
      category: "Restoration"
    },
    {
      src: "/content/edits/PROY-ABC25/final/t-shirt-text-edit-v0-0vatw53ki3cf1.webp",
      alt: "Text Editing - Professional text manipulation",
      category: "Text Design"
    },
    {
      src: "/content/portraits/PROY-PORT2/sources/professional-headshot-v0-ustmeptslmdf1.webp",
      alt: "Professional Headshots - Corporate portrait work",
      category: "Corporate Portraits"
    },
    {
      src: "/content/restores/PROY-008/after.jpg.webp",
      alt: "Historical Restoration - Preserving memories",
      category: "Historical Work"
    },
    {
      src: "/content/restores/PROY-006/after.jpg.webp",
      alt: "Family Photo Restoration - Cherished moments restored",
      category: "Family Photos"
    },
    
    // Imágenes adicionales para la derecha
    {
      src: "/content/restores/PROY-001/after.jpg",
      alt: "Vintage Restoration - Classic photograph revival",
      category: "Vintage Work"
    },
    {
      src: "/content/portraits/PROY-PORT1/sources/can-anyone-do-a-linkdn-photo-maybe-with-a-suit-v0-tslaays4c3ef1.webp",
      alt: "Before/After Portraits - Transformation showcase",
      category: "Portrait Transformation"
    },
    {
      src: "/content/restores/PROY-007/before.jpg.webp",
      alt: "Damage Repair - Extreme restoration challenges",
      category: "Damage Repair"
    },
    {
      src: "/content/restores/PROY-001/before.jpg",
      alt: "Original Vintage Photo - Before restoration",
      category: "Original State"
    },
    {
      src: "/content/restores/PROY-006/after.jpg.webp",
      alt: "Final Results - Completed restoration",
      category: "Final Results"
    },
  ];

  return (
    <section className="py-20 px-4 relative min-h-screen bg-transparent">
      <div className="max-w-7xl mx-auto relative bg-transparent">
        <div className="grid lg:grid-cols-2 gap-16 items-center bg-transparent">
          
          {/* Texto explicativo - Lado izquierdo - POR ENCIMA */}
          <div className="space-y-8 relative z-40">
            <div>
              <h2 className="text-4xl md:text-6xl font-cinzel font-bold text-white mb-6">
                What I Do
              </h2>
              <p className="text-lg text-criforge-fg-secondary leading-relaxed mb-8">
                Professional visual artist specializing in photo restoration, creative editing, and video production
              </p>
            </div>

            <div className="space-y-6">
              <div className="border-l-4 border-criforge-accent pl-6">
                <h3 className="text-xl font-cinzel font-bold text-white mb-2">Photo Restoration</h3>
                <p className="text-criforge-fg-secondary">
                  Bringing damaged and aged photographs back to life with meticulous attention to detail and professional techniques.
                </p>
              </div>

              <div className="border-l-4 border-criforge-accent pl-6">
                <h3 className="text-xl font-cinzel font-bold text-white mb-2">Creative Edits</h3>
                <p className="text-criforge-fg-secondary">
                  Transform ordinary images into extraordinary art through creative manipulation and composite work.
                </p>
              </div>

              <div className="border-l-4 border-criforge-accent pl-6">
                <h3 className="text-xl font-cinzel font-bold text-white mb-2">Portrait Enhancement</h3>
                <p className="text-criforge-fg-secondary">
                  Professional portrait retouching and enhancement to bring out the best in every photograph.
                </p>
              </div>

              <div className="border-l-4 border-criforge-accent pl-6">
                <h3 className="text-xl font-cinzel font-bold text-white mb-2">Video Production</h3>
                <p className="text-criforge-fg-secondary">
                  Professional video editing, color grading, and post-production work for all types of content.
                </p>
              </div>
            </div>
          </div>

          {/* Galería 3D - 3 Filas con Superposición Correcta */}
          <div className="relative overflow-visible h-[600px] -mb-[300px] -mr-32 bg-transparent flex flex-col justify-center">
            <div className="relative -mt-40"> {/* Contenedor centrado */}
              
              {/* Fila 1 - ABAJO (z-index más bajo) - PRIMERO EN EL DOM */}
              <div className="flex -space-x-56 md:-space-x-64 lg:-space-x-72 pb-0 mt-8 items-end justify-start pl-0 bg-transparent relative">
                {[portfolioImages[16], portfolioImages[17], portfolioImages[3]].filter(Boolean).map((image, index) => {
                  const staggerOffset = index * 15 - 20 // -20, -5, 10
                  const zIndex = 1 + index // Z-index MÁS BAJO
                  
                  return (
                    <motion.div
                      key={`fila1-${index}`}
                      className="flex-shrink-0 bg-transparent"
                      style={{ zIndex: zIndex }}
                      initial={{
                        transform: `perspective(6000px) rotateY(-45deg) translateY(250px)`,
                        opacity: 0,
                      }}
                      animate={{
                        transform: `perspective(6000px) rotateY(-45deg) translateY(${-staggerOffset}px)`,
                        opacity: 1,
                      }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.03,
                        ease: [0.25, 0.1, 0.25, 1],
                      }}
                    >
                      <div className="relative w-96 md:w-[480px] lg:w-[520px] xl:w-[600px] rounded-lg overflow-hidden"
                           style={{ aspectRatio: '16/9', backgroundColor: 'transparent' }}>
                        <img src={image.src} alt={image.alt} 
                             className="w-full h-full object-cover object-left-top" 
                             loading="lazy" decoding="async" />
                      </div>
                    </motion.div>
                  )
                })}
              </div>
              
              {/* Fila 2 - MEDIO (z-index medio) */}
              <div className="flex -space-x-56 md:-space-x-64 lg:-space-x-72 -mt-20 items-end justify-start pl-8 bg-transparent relative">
              {portfolioImages.slice(6, 15).map((image, index) => {
                // Escalera que sube suavemente de izquierda a derecha
                let staggerOffset
                
                // Escalera ascendente con diferencias más suaves (15px entre cada escalón)
                if (index === 0) staggerOffset = 0      // Primera imagen (más baja)
                else if (index === 1) staggerOffset = 15   // +15px
                else if (index === 2) staggerOffset = 30   // +15px
                else if (index === 3) staggerOffset = 45   // +15px
                else if (index === 4) staggerOffset = 60   // +15px
                else if (index === 5) staggerOffset = 75   // +15px
                else if (index === 6) staggerOffset = 90   // +15px
                else if (index === 7) staggerOffset = 105  // +15px
                else staggerOffset = 120  // Última imagen (más alta)

                // Z-index MEDIO (entre fila 3 y fila 1) - MÁS ALTO QUE FILA 1
                const zIndex = 10 + index // Z-index medio: 10-18 (mayor que fila 1: 1-3)

                // Opacidad completa
                const fadeOpacity = 1

                return (
                  <motion.div
                    key={index}
                    className="flex-shrink-0 bg-transparent"
                    style={{
                      zIndex: zIndex,
                      backgroundColor: 'transparent',
                      background: 'none'
                    }}
                    initial={{
                      transform: `perspective(6000px) rotateY(-45deg) translateY(250px)`,
                      opacity: 0,
                    }}
                    animate={{
                      transform: `perspective(6000px) rotateY(-45deg) translateY(${-staggerOffset}px)`,
                      opacity: fadeOpacity,
                    }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.03,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                  >
                    <div
                      className="relative w-96 md:w-[480px] lg:w-[520px] xl:w-[600px] rounded-lg overflow-hidden"
                      style={{
                        backgroundColor: 'transparent',
                        background: 'none',
                        boxShadow: 'none',
                        aspectRatio: '16/9',
                        height: 'auto'
                      }}
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover object-left-top"
                        loading="lazy"
                        decoding="async"
                      />
                      
                      {/* Efecto viñeta eliminado - COMPLETAMENTE TRANSPARENTE */}
                    </div>
                  </motion.div>
                )
              })}
              </div>
              
              {/* Fila 3 - MÁS ARRIBA (z-index más alto) - AL FINAL PARA ESTAR ENCIMA */}
              <div className="flex -space-x-56 md:-space-x-64 lg:-space-x-72 pb-0 -mt-48 items-end justify-start pl-4 bg-transparent relative">
                {[portfolioImages[4], portfolioImages[5], portfolioImages[2]].filter(Boolean).map((image, index) => {
                  const staggerOffset = index * 12 - 40 // -40, -28, -16
                  const zIndex = 30 + index // Z-index MÁS ALTO
                  
                  return (
                    <motion.div
                      key={`fila3-${index}`}
                      className="flex-shrink-0 bg-transparent"
                      style={{ zIndex: zIndex }}
                      initial={{
                        transform: `perspective(6000px) rotateY(-45deg) translateY(250px)`,
                        opacity: 0,
                      }}
                      animate={{
                        transform: `perspective(6000px) rotateY(-45deg) translateY(${-staggerOffset}px)`,
                        opacity: 1,
                      }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.03,
                        ease: [0.25, 0.1, 0.25, 1],
                      }}
                    >
                      <div className="relative w-96 md:w-[480px] lg:w-[520px] xl:w-[600px] rounded-lg overflow-hidden"
                           style={{ aspectRatio: '16/9', backgroundColor: 'transparent' }}>
                        <img src={image.src} alt={image.alt} 
                             className="w-full h-full object-cover object-left-top" 
                             loading="lazy" decoding="async" />
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div> {/* Cierre del contenedor */}
          </div>

        </div>

        {/* Mobile grid layout */}
        <div className="block md:hidden mt-12 grid grid-cols-2 gap-4">
          {portfolioImages.slice(3, 9).map((image, index) => (
            <div key={index} className="relative">
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
