"use client"

import React, { useState } from 'react'
import { FiShoppingCart, FiCheck } from 'react-icons/fi'

type HorizontalProductProps = {
  id?: string | number
  image: string
  title: string
  price: string | number
  onAddToCart?: () => void
}

export default function HorizontalProduct({ id, image, title, price, onAddToCart }: HorizontalProductProps) {
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    onAddToCart?.()
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="flex items-center gap-6 bg-white p-4 rounded-lg max-w-md">
      {/* Image container */}
      <div className="flex justify-center items-center bg-linear-to-br from-gray-100 to-gray-50 rounded-lg w-24 h-24 shrink-0">
        <img 
          src={image} 
          alt={title} 
          className="max-w-20 max-h-20 object-contain"
        />
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="text-[#2B27AF] text-md leading-tight">{title}</h3>
        <p className="mt-2 font-semibold text-gray-800">DOP <span className="text-lg">${Number(price).toFixed(2)}</span></p>
        {id != null && onAddToCart && (
          <button
            onClick={handleAdd}
            className={`mt-2 flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              added ? 'bg-green-100 text-green-700' : 'bg-blue-50 hover:bg-blue-100 text-blue-600'
            }`}
          >
            {added ? <><FiCheck size={14} /> ¡Agregado!</> : <><FiShoppingCart size={14} /> Agregar</>}
          </button>
        )}
      </div>
    </div>
  )
}
