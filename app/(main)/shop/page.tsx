'use client'

import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCart } from '@/src/hooks/Cart'
import { useStoreAuthLogin } from '@/src/hooks/AuthLogin/StoreProvider'
import type { CartItem } from '@/src/hooks/Cart/cartTypes'

export default function ShopPage() {
  const router = useRouter()
  const { user } = useStoreAuthLogin()
  const { items: cartItems, updateQuantity, removeItem, subtotal } = useCart()

  const total = subtotal

  const handleBuyNow = () => {
    if (cartItems.length === 0) return
    if (!user) {
      router.push('/login?redirect=/payment')
      return
    }
    router.push('/payment')
  }

  const handleContinueShopping = () => {
    router.push('/')
  }

  return (
    <div className="mx-auto py-6 md:py-8 lg:py-10 w-full max-w-7xl">
      {/* Título de la página */}
      <h1 className="mb-6 md:mb-8 px-4 md:px-0 font-bold text-[#373577] text-2xl md:text-3xl">
        Carrito de Compras
      </h1>

      {/* Contenedor principal: Lista de productos y resumen */}
      <div className="flex lg:flex-row flex-col gap-6 lg:gap-8 px-4 md:px-0">
        
        {/* Sección izquierda: Lista de productos */}
        <div className="flex-1 bg-white shadow-sm p-4 md:p-6 rounded-lg">
          {/* Encabezados de la tabla - Solo visible en pantallas medianas y grandes */}
          <div className="hidden gap-4 md:grid md:grid-cols-12 mb-4 pb-4 border-gray-200 border-b">
            <div className="col-span-5">
              <h3 className="font-semibold text-[#373577] text-sm md:text-base">Producto</h3>
            </div>
            <div className="col-span-2 text-center">
              <h3 className="font-semibold text-[#373577] text-sm md:text-base">Precio</h3>
            </div>
            <div className="col-span-2 text-center">
              <h3 className="font-semibold text-[#373577] text-sm md:text-base">Cantidad</h3>
            </div>
            <div className="col-span-2 text-center">
              <h3 className="font-semibold text-[#373577] text-sm md:text-base">Subtotal</h3>
            </div>
            <div className="col-span-1"></div>
          </div>

          {/* Lista de productos */}
          <div className="space-y-4">
            {cartItems.length === 0 ? (
              <div className="py-12 text-gray-500 text-center">
                <p>Tu carrito está vacío</p>
              </div>
            ) : (
              cartItems.map((item: CartItem, index: number) => (
                <div key={item.id}>
                  {/* Item del carrito */}
                  <div className="flex flex-col items-start md:items-center gap-4 md:grid md:grid-cols-12 py-4">
                    {/* Imagen y nombre del producto */}
                    <div className="flex items-center gap-3 md:gap-4 col-span-5 w-full">
                      {/* Imagen del producto */}
                      <div className="relative bg-gray-100 rounded-lg w-20 md:w-24 h-20 md:h-24 overflow-hidden shrink-0">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="p-2 object-contain"
                        />
                      </div>
                      {/* Nombre del producto */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-800 text-sm md:text-base line-clamp-2">
                          {item.title}
                        </h4>
                      </div>
                    </div>

                    {/* Precio - Visible en todas las pantallas */}
                    <div className="col-span-2 md:text-left text-center">
                      <span className="font-medium text-gray-700 text-sm md:text-base">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>

                    {/* Cantidad - Input numérico */}
                    <div className="flex justify-center md:justify-start col-span-2">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(String(item.id), parseInt(e.target.value) || 1)}
                        className="px-3 py-2 border border-gray-300 focus:border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-20 md:w-24 text-sm md:text-base text-center"
                      />
                    </div>

                    {/* Subtotal */}
                    <div className="col-span-2 md:text-left text-center">
                      <span className="font-semibold text-gray-800 text-sm md:text-base">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    {/* Botón eliminar */}
                    <div className="flex md:justify-end justify-start w-full md:w-auto col-span-1">
                      <button
                        onClick={() => removeItem(String(item.id))}
                        className="font-bold text-red-500 hover:text-red-700 text-lg p-1"
                        aria-label="Eliminar producto"
                      >
                        × Eliminar
                      </button>
                    </div>
                  </div>

                  {/* Separador entre items - Solo en pantallas grandes */}
                  {index < cartItems.length - 1 && (
                    <div className="hidden md:block border-gray-200 border-t"></div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sección derecha: Resumen del pedido */}
        <div className="w-full lg:w-80 xl:w-96 shrink-0">
          <div className="top-4 sticky bg-white shadow-sm p-4 md:p-6 rounded-lg">
            {/* Título del resumen */}
            <h2 className="mb-6 font-semibold text-[#373577] text-lg md:text-xl">
              Cantidad total
            </h2>

            {/* Desglose de precios */}
            <div className="space-y-3 mb-6 pb-6 border-gray-200 border-b">
              {/* Subtotal */}
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm md:text-base">Subtotal</span>
                <span className="font-medium text-gray-800 text-sm md:text-base">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800 text-base md:text-lg">Total</span>
                <span className="font-bold text-gray-900 text-lg md:text-xl">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="space-y-3">
              {/* Botón principal: Comprar ahora */}
              <button
                onClick={handleBuyNow}
                className="bg-[#36367A] hover:bg-[#303055] px-6 py-3 md:py-4 rounded-lg w-full text-white text-sm md:text-base transition-colors duration-200 cursor-pointer"
              >
               Proceder compra
              </button>

              {/* Botón secundario: Seguir comprando */}
              <button
                onClick={handleContinueShopping}
                className="bg-[#D9D9D9] hover:bg-[#c9c9c9] px-6 py-3 md:py-4 rounded-lg w-full text-gray-700 text-sm md:text-base transition-colors duration-200 cursor-pointer"
              >
                Seguir Comprando
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
