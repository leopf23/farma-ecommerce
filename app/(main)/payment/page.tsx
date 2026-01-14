'use client'

import React from 'react'
import FormShop from '../../component/form-shop'

/**
 * Página de Pago - Checkout
 * 
 * Esta página muestra el formulario de facturación y pago
 * utilizando el componente FormShop.
 * 
 * Características:
 * - Integración del componente FormShop
 * - Manejo de la orden de compra
 * - Redirección después del pago
 */
export default function PaymentPage() {
  /**
   * Maneja el envío de la orden
   * @param formData - Datos del formulario de facturación
   * @param paymentMethod - Método de pago seleccionado
   */
  const handleOrderSubmit = (formData: any, paymentMethod: 'transferencia' | 'efectivo') => {
    // Aquí puedes agregar la lógica para procesar la orden
    // Por ejemplo, enviar a un API, guardar en base de datos, etc.
    console.log('Orden procesada:', {
      formData,
      paymentMethod,
    })

    // Ejemplo: Redirigir a una página de confirmación
    // router.push('/order-confirmation')
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <FormShop onOrderSubmit={handleOrderSubmit} />
    </div>
  )
}
