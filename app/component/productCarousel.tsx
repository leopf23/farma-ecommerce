"use client"
import React, { useState, useEffect } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import ProductCarouselCard from './productCarouselCard'

type Product = {
    id: string | number
    image: string
    title: string
    price: string | number
    rating?: number
    reviewCount?: number
    listPrice?: string | number
    isPrime?: boolean
}

type ProductCarouselProps = {
    products: Product[]
    itemsPerSlide?: number
    title?: string
}

export default function ProductCarousel({
    products,
    itemsPerSlide = 2,
    title = 'Productos Recomendados'
}: ProductCarouselProps) {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isMobile, setIsMobile] = useState(false)
    
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640) // sm breakpoint
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])
    
    // Use 1 item per slide on mobile, itemsPerSlide on larger screens
    const effectiveItemsPerSlide = isMobile ? 1 : itemsPerSlide
    
    // Calculate total slides
    const totalSlides = Math.ceil(products.length / effectiveItemsPerSlide)
    
    const goToNext = () => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides)
    }
    
    const goToPrev = () => {
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
    }
    
    if (products.length === 0) return null
    
    return (
        <div className="mb-8 w-full">
            {title && (
                <h2 className="mb-4 font-bold text-gray-900 text-lg">{title}</h2>
            )}
            
            <div className="relative">
                {/* Carousel Container */}
                <div className="overflow-hidden">
                    <div
                        className="flex transition-transform duration-300 ease-in-out"
                        style={{
                            transform: `translateX(-${currentSlide * 100}%)`
                        }}
                    >
                        {Array.from({ length: totalSlides }).map((_, slideIndex) => {
                            const slideProducts = products.slice(
                                slideIndex * effectiveItemsPerSlide,
                                slideIndex * effectiveItemsPerSlide + effectiveItemsPerSlide
                            )
                            
                            return (
                                <div
                                    key={slideIndex}
                                    className="gap-4 grid grid-cols-1 sm:grid-cols-2 px-2 min-w-full"
                                >
                                    {slideProducts.map((product) => (
                                        <ProductCarouselCard
                                            key={product.id}
                                            image={product.image}
                                            title={product.title}
                                            price={product.price}
                                            rating={product.rating}
                                            reviewCount={product.reviewCount}
                                            listPrice={product.listPrice}
                                            isPrime={product.isPrime}
                                        />
                                    ))}
                                    {/* Fill empty slots if needed (only on desktop) */}
                                    {!isMobile && slideProducts.length < effectiveItemsPerSlide &&
                                        Array.from({ length: effectiveItemsPerSlide - slideProducts.length }).map((_, idx) => (
                                            <div key={`empty-${idx}`} className="hidden sm:block" />
                                        ))}
                                </div>
                            )
                        })}
                    </div>
                </div>
                
                {/* Navigation Buttons */}
                {totalSlides > 1 && (
                    <>
                        <button
                            onClick={goToPrev}
                            className="top-1/2 left-0 z-10 absolute bg-white hover:bg-gray-50 shadow-md p-2 border border-gray-200 rounded-lg transition-colors -translate-x-2 -translate-y-1/2 sm:-translate-x-4 md:translate-x-0"
                            aria-label="Anterior"
                        >
                            <FiChevronLeft className="text-gray-700" size={20} />
                        </button>
                        
                        <button
                            onClick={goToNext}
                            className="top-1/2 right-0 z-10 absolute bg-white hover:bg-gray-50 shadow-md p-2 border border-gray-200 rounded-lg transition-colors -translate-y-1/2 translate-x-2 sm:translate-x-4 md:translate-x-0"
                            aria-label="Siguiente"
                        >
                            <FiChevronRight className="text-gray-700" size={20} />
                        </button>
                    </>
                )}
                
                {/* Slide Indicators */}
                {totalSlides > 1 && (
                    <div className="flex justify-center gap-2 mt-4">
                        {Array.from({ length: totalSlides }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`h-2 rounded-full transition-all ${
                                    index === currentSlide
                                        ? 'w-8 bg-blue-600'
                                        : 'w-2 bg-gray-300'
                                }`}
                                aria-label={`Ir a slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
