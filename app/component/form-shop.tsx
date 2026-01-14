'use client'

import React, { useState } from 'react'

// Tipo para los items del pedido
interface OrderItem {
  id: number
  title: string
  quantity: number
  price: number
}

// Tipo para los datos del formulario
interface FormData {
  nombre: string
  apellido: string
  direccion: string
  correo: string
  telefono: string
  nota: string
}

// Tipo para los métodos de pago
type PaymentMethod = 'transferencia' | 'efectivo'

// Props del componente
interface FormShopProps {
  // Items del pedido (pueden venir del carrito o ser pasados como props)
  orderItems?: OrderItem[]
  // Callback cuando se procesa la orden
  onOrderSubmit?: (formData: FormData, paymentMethod: PaymentMethod) => void
}

// Datos de ejemplo del pedido (si no se pasan como props)
const defaultOrderItems: OrderItem[] = [
  {
    id: 1,
    title: 'Otrivin Breathe Clean Natural Daily Nasal Cleanser × 1',
    quantity: 1,
    price: 12.95,
  },
  {
    id: 2,
    title: 'Otrivin Breathe Clean Natural Daily Nasal Cleanser × 1',
    quantity: 1,
    price: 12.95,
  },
  {
    id: 3,
    title: 'Otrivin Breathe Clean Natural Daily Nasal Cleanser × 1',
    quantity: 1,
    price: 12.95,
  },
]

/**
 * Componente FormShop - Formulario de pago y facturación
 * 
 * Características:
 * - Formulario de facturación completo con validación
 * - Resumen de orden con productos y precios
 * - Selección de método de pago (transferencia o efectivo)
 * - Totalmente responsive (mobile, tablet, desktop, desktop XL)
 * - Validación de campos en tiempo real
 * - Manejo de estado local para formulario
 * 
 * @param orderItems - Lista de productos en el pedido (opcional)
 * @param onOrderSubmit - Callback cuando se envía el formulario (opcional)
 */
export default function FormShop({ 
  orderItems = defaultOrderItems,
  onOrderSubmit 
}: FormShopProps) {
  // Estado del formulario
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    apellido: '',
    direccion: '',
    correo: '',
    telefono: '',
    nota: '',
  })

  // Estado para errores de validación
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  // Estado para el método de pago seleccionado
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('transferencia')

  // Estado para indicar si el formulario está siendo enviado
  const [isSubmitting, setIsSubmitting] = useState(false)

  /**
   * Maneja el cambio en los campos del formulario
   * @param field - Campo que cambió
   * @param value - Nuevo valor
   */
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  /**
   * Valida el formulario antes de enviarlo
   * @returns true si el formulario es válido, false en caso contrario
   */
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido'
    }

    // Validar apellido
    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido'
    }

    // Validar dirección
    if (!formData.direccion.trim()) {
      newErrors.direccion = 'La dirección es requerida'
    }

    // Validar correo electrónico
    if (!formData.correo.trim()) {
      newErrors.correo = 'El correo electrónico es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = 'El correo electrónico no es válido'
    }

    // Validar teléfono
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido'
    } else if (!/^[\d\s\-\(\)]+$/.test(formData.telefono)) {
      newErrors.telefono = 'El teléfono no es válido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Calcula el subtotal de todos los productos
   */
  const calculateSubtotal = (): number => {
    return orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  /**
   * Maneja el envío del formulario
   * @param e - Evento del formulario
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar formulario
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Si hay un callback, llamarlo
      if (onOrderSubmit) {
        onOrderSubmit(formData, paymentMethod)
      } else {
        // Por defecto, mostrar los datos en consola
        console.log('Datos del formulario:', formData)
        console.log('Método de pago:', paymentMethod)
        console.log('Items del pedido:', orderItems)
        
        // Aquí iría la lógica para procesar la orden
        alert('Orden procesada correctamente')
      }
    } catch (error) {
      console.error('Error al procesar la orden:', error)
      alert('Hubo un error al procesar la orden. Por favor, intenta de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const subtotal = calculateSubtotal()

  return (
    <div className="mx-auto px-4 md:px-0 py-6 md:py-8 lg:py-10 w-full max-w-7xl">
      {/* Contenedor principal: Formulario y Resumen */}
      <div className="flex lg:flex-row flex-col gap-6 lg:gap-8">
        
        {/* Sección izquierda: Detalles de facturación */}
        <div className="flex-1 bg-white shadow-sm p-4 md:p-6 lg:p-8 rounded-lg">
          {/* Título de la sección */}
          <h2 className="mb-6 md:mb-8 font-bold text-[#373577] text-xl md:text-2xl">
            Detalles de facturación
          </h2>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Fila 1: Nombre y Apellido */}
            <div className="gap-4 md:gap-6 grid grid-cols-1 md:grid-cols-2">
              {/* Campo Nombre */}
              <div>
                <label 
                  htmlFor="nombre" 
                  className="block mb-2 font-medium text-gray-700 text-sm md:text-base"
                >
                  Nombre
                </label>
                <input
                  type="text"
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  className={`w-full px-4 py-2 md:py-3 border rounded-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.nombre ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ingresa tu nombre"
                />
                {errors.nombre && (
                  <p className="mt-1 text-red-500 text-sm">{errors.nombre}</p>
                )}
              </div>

              {/* Campo Apellido */}
              <div>
                <label 
                  htmlFor="apellido" 
                  className="block mb-2 font-medium text-gray-700 text-sm md:text-base"
                >
                  Apellido
                </label>
                <input
                  type="text"
                  id="apellido"
                  value={formData.apellido}
                  onChange={(e) => handleInputChange('apellido', e.target.value)}
                  className={`w-full px-4 py-2 md:py-3 border rounded-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.apellido ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ingresa tu apellido"
                />
                {errors.apellido && (
                  <p className="mt-1 text-red-500 text-sm">{errors.apellido}</p>
                )}
              </div>
            </div>

            {/* Campo Dirección (ancho completo) */}
            <div>
              <label 
                htmlFor="direccion" 
                className="block mb-2 font-medium text-gray-700 text-sm md:text-base"
              >
                Dirección
              </label>
              <input
                type="text"
                id="direccion"
                value={formData.direccion}
                onChange={(e) => handleInputChange('direccion', e.target.value)}
                className={`w-full px-4 py-2 md:py-3 border rounded-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  errors.direccion ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ingresa tu dirección completa"
              />
              {errors.direccion && (
                <p className="mt-1 text-red-500 text-sm">{errors.direccion}</p>
              )}
            </div>

            {/* Fila 2: Correo y Teléfono */}
            <div className="gap-4 md:gap-6 grid grid-cols-1 md:grid-cols-2">
              {/* Campo Correo electrónico */}
              <div>
                <label 
                  htmlFor="correo" 
                  className="block mb-2 font-medium text-gray-700 text-sm md:text-base"
                >
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="correo"
                  value={formData.correo}
                  onChange={(e) => handleInputChange('correo', e.target.value)}
                  className={`w-full px-4 py-2 md:py-3 border rounded-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.correo ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="correo@ejemplo.com"
                />
                {errors.correo && (
                  <p className="mt-1 text-red-500 text-sm">{errors.correo}</p>
                )}
              </div>

              {/* Campo Teléfono */}
              <div>
                <label 
                  htmlFor="telefono" 
                  className="block mb-2 font-medium text-gray-700 text-sm md:text-base"
                >
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) => handleInputChange('telefono', e.target.value)}
                  className={`w-full px-4 py-2 md:py-3 border rounded-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.telefono ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="809-000-0000"
                />
                {errors.telefono && (
                  <p className="mt-1 text-red-500 text-sm">{errors.telefono}</p>
                )}
              </div>
            </div>

            {/* Campo Nota del pedido (textarea) */}
            <div>
              <label 
                htmlFor="nota" 
                className="block mb-2 font-medium text-gray-700 text-sm md:text-base"
              >
                Nota del pedido
              </label>
              <textarea
                id="nota"
                value={formData.nota}
                onChange={(e) => handleInputChange('nota', e.target.value)}
                rows={4}
                className="px-4 py-2 md:py-3 border border-gray-300 focus:border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-sm md:text-base transition resize-none"
                placeholder="Instrucciones especiales para tu pedido (opcional)"
              />
            </div>
          </form>
        </div>

        {/* Sección derecha: Tu Orden y Método de pago */}
        <div className="w-full lg:w-96 xl:w-[420px] shrink-0">
          <div className="top-4 sticky bg-white shadow-sm p-4 md:p-6 lg:p-8 rounded-lg">
            
            {/* Sección: Tu Orden */}
            <div className="mb-6 md:mb-8">
              <h2 className="mb-4 md:mb-6 font-bold text-[#373577] text-xl md:text-2xl">
                Tu Orden
              </h2>

              {/* Lista de productos */}
              <div className="space-y-3 md:space-y-4 mb-4 md:mb-6 pb-4 md:pb-6 border-gray-200 border-b">
                {orderItems.length === 0 ? (
                  <p className="py-4 text-gray-500 text-sm md:text-base text-center">
                    No hay productos en tu orden
                  </p>
                ) : (
                  orderItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex justify-between items-start gap-4"
                    >
                      {/* Nombre del producto */}
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-700 text-sm md:text-base">
                          {item.title}
                        </p>
                      </div>
                      {/* Subtotal del producto */}
                      <div className="shrink-0">
                        <p className="font-medium text-gray-800 text-sm md:text-base whitespace-nowrap">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Resumen de precios */}
              <div className="space-y-2 md:space-y-3 mb-4 md:mb-6 pb-4 md:pb-6 border-gray-200 border-b">
                {/* Subtotal */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm md:text-base">Subtotal</span>
                  <span className="font-medium text-gray-800 text-sm md:text-base">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900 text-base md:text-lg">Total</span>
                  <span className="font-bold text-gray-900 text-lg md:text-xl">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Sección: Método de pago */}
            <div className="mb-6 md:mb-8">
              <h2 className="mb-4 md:mb-6 font-semibold text-[#373577] text-lg md:text-lg">
                Método de pago
              </h2>

              {/* Opciones de pago */}
              <div className="space-y-3 md:space-y-4">
                {/* Opción: Pago por transferencia */}
                <label className="group flex items-center gap-3 md:gap-4 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="transferencia"
                    checked={paymentMethod === 'transferencia'}
                    onChange={() => setPaymentMethod('transferencia')}
                    className="focus:ring-2 focus:ring-blue-500 w-5 md:w-6 h-5 md:h-6 text-blue-600 cursor-pointer"
                  />
                  <span className="text-gray-700 group-hover:text-gray-900 text-sm md:text-base transition">
                    Pago por transferencia
                  </span>
                </label>

                {/* Opción: Pago en efectivo */}
                <label className="group flex items-center gap-3 md:gap-4 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="efectivo"
                    checked={paymentMethod === 'efectivo'}
                    onChange={() => setPaymentMethod('efectivo')}
                    className="focus:ring-2 focus:ring-blue-500 w-5 md:w-6 h-5 md:h-6 text-blue-600 cursor-pointer"
                  />
                  <span className="text-gray-700 group-hover:text-gray-900 text-sm md:text-base transition">
                    Pago en efectivo
                  </span>
                </label>
              </div>
            </div>

            {/* Botón: Proceder Orden */}
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-[#E46A5E] hover:bg-[#d45a4e] disabled:bg-gray-400 px-6 py-3 md:py-4 rounded-lg w-full font-semibold text-white text-sm md:text-base transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Procesando...' : 'Proceder Orden'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
