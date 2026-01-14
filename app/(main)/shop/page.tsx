'use client'

import React, { useState } from 'react'
import Image from 'next/image'

// Tipo para los items del carrito
interface CartItem {
  id: number
  image: string
  title: string
  price: number
  quantity: number
}

// Datos de ejemplo del carrito (en producción esto vendría de un estado global o contexto)
const initialCartItems: CartItem[] = [
  {
    id: 1,
    image: '/profile.png',
    title: 'Premium whey Proteina',
    price: 22.00,
    quantity: 1,
  },
  {
    id: 2,
    image: '/profile.png',
    title: 'Premium whey Proteina',
    price: 22.00,
    quantity: 1,
  },
  {
    id: 3,
    image: '/profile.png',
    title: 'Premium whey Proteina',
    price: 22.00,
    quantity: 1,
  },
]

export default function ShopPage() {
  // Estado para manejar los items del carrito
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems)

  /**
   * Actualiza la cantidad de un producto en el carrito
   * @param id - ID del producto
   * @param newQuantity - Nueva cantidad (debe ser >= 1)
   */
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  /**
   * Elimina un producto del carrito
   * @param id - ID del producto a eliminar
   */
  const removeItem = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id))
  }

  // Calcula el subtotal de todos los items
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  // Calcula el total (aquí puedes agregar impuestos, envío, etc.)
  const total = subtotal // Por ahora el total es igual al subtotal

  // Calcula la cantidad total de productos
  const totalQuantity = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  )

  /**
   * Maneja el evento de comprar ahora
   */
  const handleBuyNow = () => {
    // Aquí iría la lógica para procesar la compra
    console.log('Procesando compra...', cartItems)
    alert('Funcionalidad de compra en desarrollo')
  }

  /**
   * Maneja el evento de seguir comprando
   */
  const handleContinueShopping = () => {
    // Redirige a la página principal o catálogo
    window.location.href = '/'
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
              cartItems.map((item, index) => (
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
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                        className="px-3 py-2 border border-gray-300 focus:border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-20 md:w-24 text-sm md:text-base text-center"
                      />
                    </div>

                    {/* Subtotal */}
                    <div className="col-span-2 md:text-left text-center">
                      <span className="font-semibold text-gray-800 text-sm md:text-base">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    {/* Botón eliminar - Solo visible en desktop */}
                    <div className="hidden md:flex justify-end col-span-1">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="font-bold text-red-500 hover:text-red-700 text-lg"
                        aria-label="Eliminar producto"
                      >
                        ×
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
                className="bg-[#E46A5E] hover:bg-[#d45a4e] px-6 py-3 md:py-4 rounded-lg w-full text-white text-sm md:text-base transition-colors duration-200 cursor-pointer"
              >
                Comprar a hora
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
