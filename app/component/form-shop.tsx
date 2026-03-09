'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/src/hooks/Cart'
import { useStoreAuthLogin } from '@/src/hooks/AuthLogin/StoreProvider'
import { getAll } from '@/src/utils/methods'
import { setAuthorizationToken } from '@/src/utils/setAuthorizationToken'
import { getStoredToken } from '@/src/utils/setAuthorizationToken'
import type { CartItem } from '@/src/hooks/Cart/cartTypes'

// Tipo para los métodos de pago del API
interface PaymentType {
  id: string | number
  name?: string
  nombre?: string
  [key: string]: unknown
}

// Tipo para métodos de pago concretos (API /list-method-payment, cuando es tarjeta)
interface CardInfo {
  expirationMonth?: string
  expirationYear?: string
  type?: string
  cardNumber?: string
}

interface PaymentMethodDetail {
  id: string | number
  methodPayments?: { card?: CardInfo; [key: string]: unknown }
  name?: string
  nombre?: string
  [key: string]: unknown
}

// Tipo para direcciones del cliente (API /client-address?clientId=)
interface ClientAddress {
  id: string | number
  address?: string
  direccion?: string
  name?: string
  nombre?: string
  location?: string
  numberHouse?: string
  [key: string]: unknown
}

// Props del componente
interface FormShopProps {
  onOrderSubmit?: (
    paymentMethod: PaymentType | null,
    orderItems: CartItem[],
    selectedAddress: ClientAddress | null,
    selectedCardMethod: PaymentMethodDetail | null
  ) => void
}

/**
 * Componente FormShop - Checkout y método de pago
 *
 * Características:
 * - Enlace a dirección del cliente (/client-address?clientId=)
 * - Métodos de pago desde API /types-payment
 * - Tu Orden con productos del carrito
 * - Totalmente responsive
 */
export default function FormShop({ onOrderSubmit }: FormShopProps) {
  const { user } = useStoreAuthLogin()
  const { items: orderItems, subtotal } = useCart()

  const clientId = user?.id ?? ''

  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentType | null>(null)
  const [isLoadingPayments, setIsLoadingPayments] = useState(true)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [addresses, setAddresses] = useState<ClientAddress[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string>('')
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false)
  const [addressError, setAddressError] = useState<string | null>(null)

  const [cardMethods, setCardMethods] = useState<PaymentMethodDetail[]>([])
  const [selectedCardMethodId, setSelectedCardMethodId] = useState<string>('')
  const [isLoadingCardMethods, setIsLoadingCardMethods] = useState(false)
  const [cardMethodsError, setCardMethodsError] = useState<string | null>(null)

  const isCreditCardSelected = Boolean(
    selectedPaymentMethod &&
      /tarjeta|credit|credito/i.test(
        String(
          selectedPaymentMethod.name ?? selectedPaymentMethod.nombre ?? ''
        )
      )
  )

  useEffect(() => {
    const token = getStoredToken()
    if (token) {
      setAuthorizationToken(token)
    }

    const fetchPaymentTypes = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || ''
        const data = await getAll(`${baseUrl}/types-payment`)
        const list = Array.isArray(data) ? data : data?.data ?? data?.items ?? []
        setPaymentTypes(list)
        if (list.length > 0 && !selectedPaymentMethod) {
          setSelectedPaymentMethod(list[0])
        }
      } catch (err) {
        setPaymentError('No se pudieron cargar los métodos de pago')
        setPaymentTypes([])
      } finally {
        setIsLoadingPayments(false)
      }
    }

    fetchPaymentTypes()
  }, [])

  useEffect(() => {
    if (!clientId) return

    const token = getStoredToken()
    if (token) {
      setAuthorizationToken(token)
    }

    const fetchAddresses = async () => {
      setIsLoadingAddresses(true)
      setAddressError(null)
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || ''
        const data = await getAll(`${baseUrl}/client-address?clientId=${clientId}`)
        const list = Array.isArray(data) ? data : data?.data ?? data?.items ?? []
        setAddresses(list)
        if (list.length > 0 && !selectedAddressId) {
          setSelectedAddressId(String(list[0].id))
        }
      } catch (err) {
        setAddressError('No se pudieron cargar las direcciones')
        setAddresses([])
      } finally {
        setIsLoadingAddresses(false)
      }
    }

    fetchAddresses()
  }, [clientId])

  useEffect(() => {
    if (!isCreditCardSelected) {
      setCardMethods([])
      setSelectedCardMethodId('')
      setCardMethodsError(null)
      return
    }

    const token = getStoredToken()
    if (token) {
      setAuthorizationToken(token)
    }

    const fetchCardMethods = async () => {
      setIsLoadingCardMethods(true)
      setCardMethodsError(null)
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || ''
        const data = await getAll(`${baseUrl}/list-method-payment`)
        const list = Array.isArray(data) ? data : data?.data ?? data?.items ?? []
        setCardMethods(list)
        setSelectedCardMethodId(list.length > 0 ? String(list[0].id) : '')
      } catch (err) {
        setCardMethodsError('No se pudieron cargar los métodos de pago')
        setCardMethods([])
        setSelectedCardMethodId('')
      } finally {
        setIsLoadingCardMethods(false)
      }
    }

    fetchCardMethods()
  }, [isCreditCardSelected])

  const getAddressDisplayParts = (addr: ClientAddress) => {
    const name = addr.name ?? addr.nombre ?? ''
    const numberHouse = addr.numberHouse ?? ''
    const location = addr.location ?? addr.address ?? addr.direccion ?? ''
    const line1 = name ? (numberHouse ? `${name}, No. ${numberHouse}` : name) : ''
    return { line1, location: location || '—' }
  }

  const formatCardDisplay = (cm: PaymentMethodDetail) => {
    const card = cm.methodPayments?.card
    const type = card?.type ? String(card.type).toUpperCase() : 'CARD'
    const raw = card?.cardNumber ?? ''
    const number = raw ? raw.replace(/(.{4})/g, '$1 ').trim() : ''
    const exp =
      [card?.expirationMonth, card?.expirationYear].filter(Boolean).join('/') ||
      '—'
    return { type, number, exp }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedPaymentMethod) {
      alert('Selecciona un método de pago')
      return
    }

    if (
      isCreditCardSelected &&
      (cardMethods.length > 0 && !selectedCardMethodId)
    ) {
      alert('Selecciona una tarjeta para pagar')
      return
    }

    if (!selectedAddressId && addresses.length > 0) {
      alert('Selecciona una dirección de envío')
      return
    }

    if (orderItems.length === 0) {
      alert('No hay productos en tu orden')
      return
    }

    setIsSubmitting(true)

    const selectedAddress = addresses.find(
      (a) => String(a.id) === selectedAddressId
    ) ?? null

    const selectedCardMethod =
      isCreditCardSelected && selectedCardMethodId
        ? cardMethods.find((c) => String(c.id) === selectedCardMethodId) ??
          null
        : null

    try {
      if (onOrderSubmit) {
        onOrderSubmit(
          selectedPaymentMethod,
          orderItems,
          selectedAddress,
          selectedCardMethod
        )
      } else {
        console.log('Método de pago:', selectedPaymentMethod)
        console.log('Tarjeta seleccionada:', selectedCardMethod)
        console.log('Items del pedido:', orderItems)
        console.log('Dirección de envío:', selectedAddress)
        alert('Orden procesada correctamente')
      }
    } catch (error) {
      console.error('Error al procesar la orden:', error)
      alert('Hubo un error al procesar la orden. Por favor, intenta de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto px-4 md:px-0 py-6 md:py-8 lg:py-10 w-full max-w-7xl">
      <div className="flex lg:flex-row flex-col gap-6 lg:gap-8">
        {/* Sección izquierda: Dirección de envío (desde /client-address?clientId=, user de /info-users) */}
        <div className="flex-1 bg-white shadow-sm p-4 md:p-6 lg:p-8 rounded-lg">
          <h2 className="mb-6 md:mb-8 font-bold text-[#373577] text-xl md:text-2xl">
            Dirección de envío
          </h2>

          {isLoadingAddresses ? (
            <p className="text-gray-500 text-sm mb-4">Cargando direcciones...</p>
          ) : addressError ? (
            <p className="text-red-500 text-sm mb-4">{addressError}</p>
          ) : addresses.length > 0 ? (
            <div className="mb-4">
              <label className="block mb-3 font-medium text-gray-700 text-sm md:text-base">
                Selecciona tu dirección
              </label>
              <div className="space-y-2">
                {addresses.map((addr) => {
                  const { line1, location } = getAddressDisplayParts(addr)
                  const isSelected = selectedAddressId === String(addr.id)
                  return (
                    <label
                      key={String(addr.id)}
                      className={`flex cursor-pointer rounded-lg border-2 p-3 md:p-4 transition-all ${
                        isSelected
                          ? 'border-[#36367A] bg-[#36367A]/5 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={String(addr.id)}
                        checked={isSelected}
                        onChange={() => setSelectedAddressId(String(addr.id))}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex h-10 w-12 shrink-0 items-center justify-center rounded bg-gray-800 text-white">
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          {line1 && (
                            <p className="font-medium text-gray-800 text-sm md:text-base">
                              {line1}
                            </p>
                          )}
                          <p className="text-gray-600 text-xs md:text-sm mt-0.5">
                            {location}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="shrink-0 h-5 w-5 rounded-full bg-[#36367A] flex items-center justify-center">
                            <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm mb-4">No tienes direcciones guardadas.</p>
          )}

          <Link
            href={`/client-address?clientId=${clientId}`}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-[#36367A] hover:bg-[#303055] text-white font-medium text-sm md:text-base transition-colors"
          >
            Gestionar direcciones
          </Link>
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
                  orderItems.map((item: CartItem) => (
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

            {/* Sección: Método de pago (desde /types-payment) */}
            <div className="mb-6 md:mb-8">
              <h2 className="mb-4 md:mb-6 font-semibold text-[#373577] text-lg md:text-lg">
                Método de pago
              </h2>

              {isLoadingPayments ? (
                <p className="text-gray-500 text-sm">Cargando métodos de pago...</p>
              ) : paymentError ? (
                <p className="text-red-500 text-sm">{paymentError}</p>
              ) : (
                <div className="space-y-3 md:space-y-4">
                  {paymentTypes.map((pt) => (
                    <label key={String(pt.id)} className="group flex items-center gap-3 md:gap-4 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={String(pt.id)}
                        checked={selectedPaymentMethod?.id === pt.id}
                        onChange={() => setSelectedPaymentMethod(pt)}
                        className="focus:ring-2 focus:ring-blue-500 w-5 md:w-6 h-5 md:h-6 text-blue-600 cursor-pointer"
                      />
                      <span className="text-gray-700 group-hover:text-gray-900 text-sm md:text-base transition">
                        {pt.name ?? pt.nombre ?? String(pt.id)}
                      </span>
                    </label>
                  ))}
                </div>
              )}

              {/* Tarjetas cuando se elige tarjeta de crédito (desde /list-method-payment) */}
              {isCreditCardSelected && (
                <div className="mt-4">
                  <label className="block mb-2 font-medium text-gray-700 text-sm md:text-base">
                    Selecciona tu tarjeta
                  </label>
                  {isLoadingCardMethods ? (
                    <p className="text-gray-500 text-sm">Cargando tarjetas...</p>
                  ) : cardMethodsError ? (
                    <p className="text-red-500 text-sm">{cardMethodsError}</p>
                  ) : cardMethods.length > 0 ? (
                    <div className="space-y-2">
                      {cardMethods.map((cm) => {
                        const { type, number, exp } = formatCardDisplay(cm)
                        const isSelected = selectedCardMethodId === String(cm.id)
                        return (
                          <label
                            key={String(cm.id)}
                            className={`flex cursor-pointer rounded-lg border-2 p-3 md:p-4 transition-all ${
                              isSelected
                                ? 'border-[#36367A] bg-[#36367A]/5 shadow-sm'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="cardMethod"
                              value={String(cm.id)}
                              checked={isSelected}
                              onChange={() => setSelectedCardMethodId(String(cm.id))}
                              className="sr-only"
                            />
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="flex h-10 w-12 shrink-0 items-center justify-center rounded bg-gray-800 text-white text-xs font-bold">
                                {type || 'CARD'}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-mono text-sm md:text-base font-medium text-gray-800 tracking-wide">
                                  {number || `•••• •••• •••• ${String(cm.id)}`}
                                </p>
                                <p className="text-gray-500 text-xs mt-0.5">
                                  Vence {exp || '—'}
                                </p>
                              </div>
                              {isSelected && (
                                <div className="shrink-0 h-5 w-5 rounded-full bg-[#36367A] flex items-center justify-center">
                                  <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </label>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No hay tarjetas disponibles.</p>
                  )}
                </div>
              )}
            </div>

            {/* Botón: Proceder Orden */}
            <form onSubmit={handleSubmit}>
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  orderItems.length === 0 ||
                  (addresses.length > 0 && !selectedAddressId) ||
                  (isCreditCardSelected &&
                    cardMethods.length > 0 &&
                    !selectedCardMethodId)
                }
                className="bg-[#36367A] hover:bg-[#303055] disabled:bg-gray-400 px-6 py-3 md:py-4 rounded-lg w-full font-semibold text-white text-sm md:text-base transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Procesando...' : 'Proceder Orden'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
