"use client"

import React, { useState, useEffect } from 'react'
import { FiPlus, FiMinus, FiX, FiChevronLeft, FiChevronRight,FiHash, FiGrid, FiTag } from 'react-icons/fi'
import SideList from './SideList'

type ProductViewerProps = {
  images: string[]
  title: string
  unitPrice: number // price per unit
}

const stats = [
   {
    label: "SKU",
    value: "093858",
    icon: FiHash,
  },
  {
    label: "Categories",
    value: "Supplements, Vitamins",
    icon: FiGrid,
  },
  {
    label: "Tag",
    value: "Vitamins",
    icon: FiTag,
  },
];

export default function ProductViewer({ images, title, unitPrice }: ProductViewerProps) {
  const [mainIndex, setMainIndex] = useState(0)
  const [qty, setQty] = useState(1)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handleEscape)
    return () => {
      window.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const increase = () => setQty((q) => q + 1)
  const decrease = () => setQty((q) => Math.max(1, q - 1))

  const total = (unitPrice * qty)

  return (
    <div className="flex lg:flex-row flex-col gap-8 w-full">
      {/* Left: images */}
      <div className="w-full lg:w-1/2">
        <div className="bg-gray-50 p-6 rounded-xl">
          <div
            className="relative rounded-lg overflow-hidden cursor-zoom-in"
            onClick={() => setIsOpen(true)}
          >
            <img
              src={images[mainIndex]}
              alt={title}
              className="w-full h-96 md:h-112 object-contain hover:scale-105 transition-transform duration-300 transform"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 mt-4 overflow-x-auto">
            {images.map((src, i) => (
              <button
                key={src + i}
                onClick={() => setMainIndex(i)}
                className={`flex-none rounded-lg overflow-hidden border ${i === mainIndex ? 'border-blue-600' : 'border-gray-200'}`}
              >
                <img src={src} alt={`thumb-${i}`} className="bg-white p-2 w-20 h-20 object-contain" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: info + qty */}
      <div className="flex flex-col justify-start w-full lg:w-1/2">
        <h1 className="font-semibold text-[#2B27AF] text-2xl md:text-3xl">{title}</h1>



        <SideList items={stats} />

        <div className="mt-2 font-bold text-blue-600 text-lg md:text-2xl">DOP.${unitPrice.toLocaleString()}</div>

        <div className="bg-gray-50 mt-6 p-4 rounded-lg max-w-sm">
          <div className="flex items-center gap-3">
            <button onClick={decrease} className="flex justify-center items-center bg-white border rounded-full w-10 h-10 cursor-pointer">
              <FiMinus />
            </button>
            <div className="bg-white px-6 py-2 rounded-md w-20 text-center">{qty}</div>
            <button onClick={increase} className="flex justify-center items-center bg-white border rounded-full w-10 h-10 cursor-pointer">
              <FiPlus />
            </button>

            <div className="ml-auto text-gray-600 text-sm">Total</div>
            <div className="font-semibold text-gray-800 text-lg">DOP.${total.toLocaleString()}</div>
          </div>

          <div className="flex gap-3 mt-4">
            <button className="flex-1 bg-[#2B27AF] py-3 rounded-full text-white cursor-pointer">Agregar al carrito</button>
            <button className="flex-1 bg-red-500 py-3 rounded-full text-white cursor-pointer">Comprar a hora</button>
          </div>
        </div>

        {/* Description placeholder */}
        <section className="mt-8">
          <h3 className="mb-2 font-semibold text-lg">Descripción</h3>
          <p className="text-gray-600 leading-relaxed">
            "Lorem ipsum" es un texto de relleno en latín que se utiliza comúnmente en diseño gráfico, impresión y maquetación para previsualizar cómo se verá un diseño final con contenido. El texto no tiene un significado coherente.
          </p>
        </section>
      </div>

      {/* Lightbox modal */}
      {isOpen && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/60">
          <div className="relative mx-4 w-full max-w-4xl">
            <button onClick={() => setIsOpen(false)} className="top-3 right-3 absolute bg-black/30 p-2 rounded-full text-white">
              <FiX size={20} />
            </button>

            <div className="bg-white p-6 rounded-lg overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <button onClick={() => setMainIndex((i) => (i - 1 + images.length) % images.length)} className="bg-gray-100 p-2 rounded-full">
                  <FiChevronLeft />
                </button>

                <button onClick={() => setMainIndex((i) => (i + 1) % images.length)} className="bg-gray-100 p-2 rounded-full">
                  <FiChevronRight />
                </button>
              </div>

              <div className="flex justify-center items-center">
                <img src={images[mainIndex]} alt={`large-${mainIndex}`} className="max-h-[70vh] object-contain" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
