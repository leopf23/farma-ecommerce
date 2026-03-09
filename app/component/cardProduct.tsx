"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { FiShoppingCart, FiCheck } from 'react-icons/fi'

type CardProductProps = {
    id?: string | number
    image: string
    category: string
    title: string
    price: string | number
    onAddToCart?: () => void
}

export default function CardProduct({ id, image, category, title, price, onAddToCart }: CardProductProps) {
    const [added, setAdded] = useState(false)

    const handleAdd = () => {
        onAddToCart?.()
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
    }

    const canAdd = id != null && onAddToCart
    return (
        <div className="flex flex-col items-center gap-4 mx-auto mb-10 max-w-xs">
            {/* Image container with light background */}
            <div className="flex justify-center items-center bg-linear-to-br from-gray-100 to-gray-50 p-6 rounded-2xl w-full h-64 overflow-hidden">
                <Image
                    src={image}
                    alt={title}
                    width={200}
                    height={200}
                    className="object-contain"
                />
            </div>

            {/* Category label */}
            <div className="font-medium text-blue-500 text-sm">{category}</div>

            {/* Product title */}
            <h3 className="text-[#373577] text-lg text-center">{title}</h3>

            {/* Price */}
            <div className="font-semibold text-gray-800 text-lg">DOP ${price}</div>

            {/* Add to cart button */}
            {canAdd ? (
                <button
                    onClick={handleAdd}
                    className={`flex justify-center items-center gap-2 px-6 py-3 rounded-full w-full font-semibold text-[0.8rem] transition cursor-pointer ${
                        added
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-50 hover:bg-blue-100 text-blue-600'
                    }`}
                >
                    {added ? (
                        <>
                            <FiCheck size={20} />
                            ¡Agregado!
                        </>
                    ) : (
                        <>
                            <FiShoppingCart size={20} />
                            agregar al carrito
                        </>
                    )}
                </button>
            ) : (
                <button className="flex justify-center items-center gap-2 bg-blue-50 hover:bg-blue-100 px-6 py-3 rounded-full w-full font-semibold text-[0.8rem] text-blue-600 transition cursor-pointer" disabled>
                    <FiShoppingCart size={20} />
                    agregar al carrito
                </button>
            )}
        </div>
    )
}
