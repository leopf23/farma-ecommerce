import React from 'react'
import Image from 'next/image'
import { FiShoppingCart } from 'react-icons/fi'

type CardProductProps = {
    image: string
    category: string
    title: string
    price: string | number
}

export default function CardProduct({ image, category, title, price }: CardProductProps) {
    return (
        <div className="flex flex-col items-center gap-4 mx-auto max-w-xs">
            {/* Image container with light background */}
            <div className="relative flex justify-center items-center bg-linear-to-br from-gray-100 to-gray-50 p-6 rounded-2xl w-full min-h-64 overflow-hidden">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-contain"
                />
            </div>

            {/* Category label */}
            <div className="font-medium text-blue-500 text-sm">{category}</div>

            {/* Product title */}
            <h3 className="text-[#373577] text-lg text-center">{title}</h3>

            {/* Price */}
            <div className="font-semibold text-gray-800 text-lg">DOP.{price}</div>

            {/* Add to cart button */}
            <button className="flex justify-center items-center gap-2 bg-blue-50 hover:bg-blue-100 px-6 py-3 rounded-full w-full font-semibold text-[0.8rem] text-blue-600 transition cursor-pointer">
                <FiShoppingCart size={20} />
                agregar al carrito
            </button>
        </div>
    )
}
