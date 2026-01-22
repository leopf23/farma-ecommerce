import React from 'react'
import Image from 'next/image'
import { CiStar } from 'react-icons/ci'
import { FaStar, FaStarHalfAlt } from 'react-icons/fa'

type ProductCarouselCardProps = {
    image: string
    title: string
    rating?: number
    reviewCount?: number
    price: string | number
    listPrice?: string | number
    isPrime?: boolean
}

export default function ProductCarouselCard({
    image,
    title,
    rating = 4.5,
    reviewCount = 0,
    price,
    listPrice,
    isPrime = false
}: ProductCarouselCardProps) {
    // Generate star rating display
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    return (
        <div className="flex flex-col bg-white p-4 rounded-lg h-full">
            {/* Product Image */}
            <div className="flex justify-center items-center bg-gray-50 mb-4 p-4 rounded-lg h-48">
                <Image
                    src={image}
                    alt={title}
                    width={180}
                    height={180}
                    className="max-h-40 object-contain"
                />
            </div>

            {/* Product Title */}
            <h3 className="mb-2 min-h-10 text-gray-900 text-sm line-clamp-2">
                {title}
            </h3>

            {/* Rating and Reviews */}
            <div className="flex items-center gap-1 mb-2">
                <span className="font-medium text-orange-600 text-sm">{rating}</span>
                <div className="flex items-center">
                    {[...Array(fullStars)].map((_, i) => (
                        <FaStar
                            key={`full-${i}`}
                            className="text-orange-500"
                            size={14}
                        />
                    ))}
                    {hasHalfStar && (
                        <FaStarHalfAlt
                            className="text-orange-500"
                            size={14}
                        />
                    )}
                    {[...Array(emptyStars)].map((_, i) => (
                        <CiStar
                            key={`empty-${i}`}
                            className="text-gray-300"
                            size={14}
                        />
                    ))}
                </div>
                <span className="ml-1 text-gray-600 text-xs">({reviewCount})</span>
            </div>

            {/* Price */}
            <div className="mb-2">
                <div className="flex items-baseline gap-2">
                    <span className="font-bold text-gray-900 text-lg">
                        ${price}
                    </span>
                    {listPrice && (
                        <span className="text-gray-500 text-sm line-through">
                            List: ${listPrice}
                        </span>
                    )}
                </div>
            </div>

            {/* Prime Badge */}
            {isPrime && (
                <div className="flex items-center gap-1 mt-auto">
                    <span className="text-green-600 text-sm">✓</span>
                    <span className="font-medium text-blue-600 text-xs">Destacado</span>
                </div>
            )}
        </div>
    )
}
