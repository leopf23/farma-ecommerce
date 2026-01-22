import React from 'react'

type HorizontalProductProps = {
  image: string
  title: string
  price: string | number
}

export default function HorizontalProduct({ image, title, price }: HorizontalProductProps) {
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
        <p className="mt-2 font-semibold text-gray-800">DOP.${price}</p>
      </div>
    </div>
  )
}
