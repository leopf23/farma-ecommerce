'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import FormShop from '../../component/form-shop'
import { getStoredToken } from '@/src/utils/setAuthorizationToken'

/**
 * Página de Pago - Checkout
 * Requiere sesión iniciada. Si no hay token, redirige a /login.
 */
export default function PaymentPage() {
  const router = useRouter()
  const [hasToken, setHasToken] = useState<boolean | null>(null)

  useEffect(() => {
    const token = getStoredToken()
    if (!token) {
      router.replace('/login?redirect=/payment')
    } else {
      setHasToken(true)
    }
  }, [router])
  /**
   * Maneja el envío de la orden
   * @param paymentMethod - Método de pago seleccionado (desde /types-payment)
   * @param orderItems - Productos del carrito a pagar
   * @param selectedAddress - Dirección de envío (desde /client-address?clientId=)
   * @param selectedCardMethod - Tarjeta seleccionada (desde /list-method-payment, cuando es tarjeta)
   */
  const handleOrderSubmit = (
    paymentMethod: any,
    orderItems: any[],
    selectedAddress: any,
    selectedCardMethod: any
  ) => {
    console.log('Orden procesada:', {
      paymentMethod,
      orderItems,
      selectedAddress,
      selectedCardMethod,
    })
    // router.push('/order-confirmation')
  }

  if (hasToken !== true) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-gray-500">
        Redirigiendo al inicio de sesión...
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <FormShop onOrderSubmit={handleOrderSubmit} />
    </div>
  )
}
