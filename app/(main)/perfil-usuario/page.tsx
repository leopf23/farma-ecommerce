'use client'

import React, { useState, useEffect } from 'react'
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiEdit2, 
  FiCheck, 
  FiX, 
  FiCreditCard, 
  FiPlus,
  FiShoppingBag,
  FiCalendar,
  FiPackage,
  FiDollarSign,
  FiSearch,
  FiLoader,
  FiFileText
} from 'react-icons/fi'
import { useAuthLogin } from '@/src/hooks/AuthLogin'
import { useStoreAuthLogin, useDispatchAuthLogin, TypesAuthLogin } from '@/src/hooks/AuthLogin/StoreProvider'
import { getAll, updateAll } from '@/src/utils/methods'
import { getStoredToken, setAuthorizationToken } from '@/src/utils/setAuthorizationToken'

// Tipos de datos (API info-users)
interface UserInfo {
  name: string
  lastName: string
  email: string
  phone: string
  birthDate: string
  cardId: string
}

// Métodos de pago del API /list-method-payment (solo card y cash, sin transferencia)
interface PaymentMethodApi {
  id: string | number
  methodPayments?: { card?: { cardNumber?: string; expirationMonth?: string; expirationYear?: string; type?: string; cardHolder?: string }; [key: string]: unknown }
  name?: string
  [key: string]: unknown
}

interface Order {
  id: string
  date: string
  total: number
  status: 'completed' | 'pending' | 'cancelled'
  items: number
  customerName?: string
}

interface PaymentMethodForm {
  type: 'card' | 'cash'
  cardNumber?: string
  cardHolder?: string
  expiryDate?: string
  cvv?: string
  isDefault: boolean
}

// Mapear usuario del API a UserInfo
function mapApiUserToUserInfo(apiUser: Record<string, unknown> | null): UserInfo {
  if (!apiUser) {
    return { name: '', lastName: '', email: '', phone: '', birthDate: '', cardId: '' }
  }
  const u = apiUser as Record<string, any>
  const birthRaw = u.birthDate ?? u.birth_date ?? ''
  const birthStr = birthRaw
    ? new Date(birthRaw).toLocaleDateString('es-DO', { year: 'numeric', month: 'long', day: 'numeric' })
    : ''
  return {
    name: u.name ?? u.nombre ?? '',
    lastName: u.lastName ?? u.last_name ?? u.apellido ?? '',
    email: u.email ?? u.correo ?? '',
    phone: u.phone ?? u.telefono ?? '',
    birthDate: birthStr,
    cardId: u.cardId ?? u.card_id ?? u.cedula ?? u.documento ?? ''
  }
}

// Mapear orden del API
function mapApiOrderToOrder(item: Record<string, unknown>): Order {
  const o = item as Record<string, any>
  const id = o.id ?? o.orderId ?? o.codigo ?? String(item)
  const dateRaw = o.date ?? o.fecha ?? o.createdAt ?? o.created_at ?? ''
  const total = Number(o.total ?? o.totalAmount ?? o.monto ?? 0)
  const statusRaw = (o.status ?? o.estado ?? 'pending') as string
  const status = ['completed', 'done', 'completado', 'entregado'].includes(String(statusRaw).toLowerCase())
    ? 'completed'
    : ['cancelled', 'cancelado', 'canceled'].includes(String(statusRaw).toLowerCase())
    ? 'cancelled'
    : 'pending'
  const items = Number(o.items ?? o.itemsCount ?? o.cantidad ?? o.orderItems?.length ?? 1)
  return {
    id: String(id),
    date: typeof dateRaw === 'string' ? dateRaw : new Date(dateRaw).toISOString().slice(0, 10),
    total,
    status,
    items,
    customerName: o.customerName ?? o.clientName ?? o.nombre ?? o.name
  }
}

export default function PerfilUsuarioPage() {
  const { fetchUserInfo } = useAuthLogin()
  const storeUser = useStoreAuthLogin().user
  const dispatchAuth = useDispatchAuthLogin()

  // Estado para información del usuario (desde /info-users y CRUD /users)
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    cardId: ''
  })
  const [userId, setUserId] = useState<number | string | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)

  // Estado para métodos de pago (desde /list-method-payment, sin transferencia)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodApi[]>([])
  const [isLoadingPayments, setIsLoadingPayments] = useState(true)

  // Estado para órdenes (desde /list-orders?client=userId)
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(true)

  // Estados para edición
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Estados para modal de métodos de pago
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentForm, setPaymentForm] = useState<PaymentMethodForm>({
    type: 'card',
    isDefault: false
  })

  // Estado para filtro de búsqueda en historial
  const [searchFilter, setSearchFilter] = useState('')

  // Cargar datos del usuario desde /info-users
  useEffect(() => {
    const token = getStoredToken()
    if (token) setAuthorizationToken(token)

    const loadUser = async () => {
      setIsLoadingUser(true)
      try {
        let data = storeUser
        if (!data) {
          data = await fetchUserInfo()
        }
        if (data) {
          const mapped = mapApiUserToUserInfo(data as Record<string, unknown>)
          setUserInfo(mapped)
          const raw = (data as Record<string, unknown>).id
          const id = typeof raw === 'string' || typeof raw === 'number' ? raw : null
          if (id != null) setUserId(id)
        }
      } catch {
        if (storeUser) {
          setUserInfo(mapApiUserToUserInfo(storeUser as Record<string, unknown>))
          const raw = (storeUser as Record<string, unknown>).id
          const id = typeof raw === 'string' || typeof raw === 'number' ? raw : null
          if (id != null) setUserId(id)
        }
      } finally {
        setIsLoadingUser(false)
      }
    }

    loadUser()
  }, [storeUser])

  // Cargar métodos de pago desde /list-method-payment
  useEffect(() => {
    const token = getStoredToken()
    if (token) setAuthorizationToken(token)

    const loadPayments = async () => {
      setIsLoadingPayments(true)
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || ''
        const data = await getAll(`${baseUrl}/list-method-payment`)
        const list = Array.isArray(data) ? data : data?.data ?? data?.items ?? []
        setPaymentMethods(list)
      } catch {
        setPaymentMethods([])
      } finally {
        setIsLoadingPayments(false)
      }
    }

    loadPayments()
  }, [])

  // Cargar órdenes desde /list-orders?client=userId
  useEffect(() => {
    if (userId == null || userId === '') {
      setIsLoadingOrders(false)
      return
    }

    const token = getStoredToken()
    if (token) setAuthorizationToken(token)

    const loadOrders = async () => {
      setIsLoadingOrders(true)
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || ''
        const data = await getAll(`${baseUrl}/list-orders?client=${userId}`)
        const list = Array.isArray(data) ? data : data?.data ?? data?.items ?? []
        setOrders(list.map((item: Record<string, unknown>) => mapApiOrderToOrder(item)))
      } catch {
        setOrders([])
      } finally {
        setIsLoadingOrders(false)
      }
    }

    loadOrders()
  }, [userId])

  // Iniciar edición de un campo
  const startEdit = (field: keyof UserInfo, currentValue: string) => {
    setEditingField(field)
    setEditValue(currentValue)
  }

  // Cancelar edición
  const cancelEdit = () => {
    setEditingField(null)
    setEditValue('')
  }

  // Guardar cambios (PUT /users/{id})
  const saveField = async (field: keyof UserInfo) => {
    if (userId == null) {
      setEditingField(null)
      setEditValue('')
      return
    }
    setIsSaving(true)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || ''
      const fieldMap: Record<string, string> = {
        name: 'name',
        lastName: 'lastName',
        phone: 'phone'
      }
      const apiField = fieldMap[field] ?? field
      await updateAll(`${baseUrl}/users`, userId, { [apiField]: editValue })
      setUserInfo(prev => ({ ...prev, [field]: editValue }))
      const freshUser = await fetchUserInfo()
      if (freshUser) {
        dispatchAuth({ type: TypesAuthLogin.SET_USER, payload: { user: freshUser } })
      }
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch {
      setShowSuccess(false)
    } finally {
      setEditingField(null)
      setEditValue('')
      setIsSaving(false)
    }
  }

  // Abrir modal de método de pago
  const openPaymentModal = () => {
    setPaymentForm({ type: 'card', isDefault: false })
    setShowPaymentModal(true)
  }

  // Cerrar modal de método de pago
  const closePaymentModal = () => {
    setShowPaymentModal(false)
    setPaymentForm({ type: 'card', isDefault: false })
  }

  // Guardar nuevo método de pago (requiere endpoint de creación - por ahora placeholder)
  const savePaymentMethod = () => {
    closePaymentModal()
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  // Obtener icono del tipo de método de pago (solo card y cash, sin transferencia)
  const getPaymentIcon = (hasCard: boolean) => {
    return hasCard ? <FiCreditCard className="w-5 h-5" /> : <FiDollarSign className="w-5 h-5" />
  }

  // Formatear tarjeta para mostrar
  const formatCardDisplay = (method: PaymentMethodApi) => {
    const card = method.methodPayments?.card
    const raw = card?.cardNumber ?? ''
    const lastFour = raw ? raw.slice(-4) : '****'
    const cardHolder = card?.cardHolder ?? method.name ?? '—'
    return { lastFour, cardHolder }
  }

  // Obtener texto del estado de la orden
  const getOrderStatusText = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return 'Completada'
      case 'pending':
        return 'Pendiente'
      case 'cancelled':
        return 'Cancelada'
      default:
        return status
    }
  }

  // Obtener color del estado de la orden
  const getOrderStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  // Filtrar órdenes por búsqueda
  const filteredOrders = orders.filter(order => {
    if (!searchFilter.trim()) return true
    
    const searchLower = searchFilter.toLowerCase()
    const orderId = order.id.toLowerCase()
    const dateStr = new Date(order.date).toLocaleDateString('es-DO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).toLowerCase()
    const customerName = order.customerName?.toLowerCase() || ''
    
    return orderId.includes(searchLower) || 
           dateStr.includes(searchLower) || 
           customerName.includes(searchLower)
  })

  return (
    <div className="mx-auto px-4 md:px-6 py-6 md:py-8 lg:py-10 w-full max-w-6xl">
      {/* Mensaje de éxito */}
      {showSuccess && (
        <div className="top-20 right-4 z-50 fixed animate-slide-in-right">
          <div className="flex items-center gap-3 bg-white shadow-xl px-4 py-3 border border-green-200 rounded-lg min-w-[280px]">
            <div className="bg-green-100 p-2 rounded-full">
              <FiCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">Cambios guardados</p>
              <p className="text-gray-600 text-xs">Tu información se actualizó correctamente</p>
            </div>
          </div>
        </div>
      )}

      {/* Título de la página */}
      <div className="mb-6 md:mb-8">
        <h1 className="font-semibold text-[#373577] text-2xl md:text-3xl">Mi Perfil</h1>
        <p className="mt-1 text-gray-600 text-sm md:text-base">Gestiona tu información personal y preferencias</p>
      </div>

      <div className="flex lg:flex-row flex-col gap-6">
        {/* Columna izquierda - Información básica y métodos de pago */}
        <div className="flex-1 space-y-6">
          {/* Sección: Información Básica */}
          <div className="bg-white shadow-sm p-5 md:p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-6">
             
              <h2 className="font-semibold text-[#373577] text-md md:text-xl">Información Básica</h2>
            </div>

            {isLoadingUser ? (
              <div className="flex justify-center py-8">
                <FiLoader className="w-8 h-8 text-[#373577] animate-spin" />
              </div>
            ) : (
            <div className="space-y-4">
              {/* Nombre */}
              <div className="flex sm:flex-row flex-col sm:items-center gap-2 sm:gap-4 pb-4 border-gray-100 border-b">
                <div className="flex items-center gap-2 min-w-[120px]">
                  <FiUser className="w-4 h-4 text-gray-400" />
                  <label className="font-medium text-gray-700 text-sm">Nombre</label>
                </div>
                <div className="flex flex-1 items-center gap-2">
                  {editingField === 'name' ? (
                    <>
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="flex-1 focus:ring-opacity-20 px-3 py-2 border border-gray-300 focus:border-[#373577] rounded-lg focus:outline-none focus:ring-[#373577] focus:ring-2 text-sm"
                        autoFocus
                      />
                      <button
                        onClick={() => saveField('name')}
                        disabled={isSaving}
                        className="bg-[#373577] hover:bg-[#2a2a5f] disabled:opacity-50 p-2 rounded-lg text-white transition-colors"
                      >
                        <FiCheck className="w-4 h-4" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg text-gray-700 transition-colors"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-gray-800 text-sm">{userInfo.name}</span>
                      <button
                        onClick={() => userId != null && startEdit('name', userInfo.name)}
                        disabled={userId == null}
                        className="hover:bg-gray-50 p-1.5 rounded-md text-[#373577] hover:text-[#2a2a5f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Editar nombre"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Apellido */}
              <div className="flex sm:flex-row flex-col sm:items-center gap-2 sm:gap-4 pb-4 border-gray-100 border-b">
                <div className="flex items-center gap-2 min-w-[120px]">
                  <FiUser className="w-4 h-4 text-gray-400" />
                  <label className="font-medium text-gray-700 text-sm">Apellido</label>
                </div>
                <div className="flex flex-1 items-center gap-2">
                  {editingField === 'lastName' ? (
                    <>
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="flex-1 focus:ring-opacity-20 px-3 py-2 border border-gray-300 focus:border-[#373577] rounded-lg focus:outline-none focus:ring-[#373577] focus:ring-2 text-sm"
                        autoFocus
                      />
                      <button
                        onClick={() => saveField('lastName')}
                        disabled={isSaving}
                        className="bg-[#373577] hover:bg-[#2a2a5f] disabled:opacity-50 p-2 rounded-lg text-white transition-colors"
                      >
                        <FiCheck className="w-4 h-4" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg text-gray-700 transition-colors"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-gray-800 text-sm">{userInfo.lastName}</span>
                      <button
                        onClick={() => userId != null && startEdit('lastName', userInfo.lastName)}
                        disabled={userId == null}
                        className="hover:bg-gray-50 p-1.5 rounded-md text-[#373577] hover:text-[#2a2a5f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Editar apellido"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Email (solo visualización, no editable) */}
              <div className="flex sm:flex-row flex-col sm:items-center gap-2 sm:gap-4 pb-4 border-gray-100 border-b">
                <div className="flex items-center gap-2 min-w-[120px]">
                  <FiMail className="w-4 h-4 text-gray-400" />
                  <label className="font-medium text-gray-700 text-sm">Email</label>
                </div>
                <span className="flex-1 text-gray-800 text-sm">{userInfo.email}</span>
              </div>

              {/* Teléfono */}
              <div className="flex sm:flex-row flex-col sm:items-center gap-2 sm:gap-4 pb-4 border-gray-100 border-b">
                <div className="flex items-center gap-2 min-w-[120px]">
                  <FiPhone className="w-4 h-4 text-gray-400" />
                  <label className="font-medium text-gray-700 text-sm">Teléfono</label>
                </div>
                <div className="flex flex-1 items-center gap-2">
                  {editingField === 'phone' ? (
                    <>
                      <input
                        type="tel"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="flex-1 focus:ring-opacity-20 px-3 py-2 border border-gray-300 focus:border-[#373577] rounded-lg focus:outline-none focus:ring-[#373577] focus:ring-2 text-sm"
                        autoFocus
                      />
                      <button
                        onClick={() => saveField('phone')}
                        disabled={isSaving}
                        className="bg-[#373577] hover:bg-[#2a2a5f] disabled:opacity-50 p-2 rounded-lg text-white transition-colors"
                      >
                        <FiCheck className="w-4 h-4" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg text-gray-700 transition-colors"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-gray-800 text-sm">{userInfo.phone}</span>
                      <button
                        onClick={() => userId != null && startEdit('phone', userInfo.phone)}
                        disabled={userId == null}
                        className="hover:bg-gray-50 p-1.5 rounded-md text-[#373577] hover:text-[#2a2a5f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Editar teléfono"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Fecha de nacimiento (solo visualización) */}
              <div className="flex sm:flex-row flex-col sm:items-center gap-2 sm:gap-4 pb-4 border-gray-100 border-b">
                <div className="flex items-center gap-2 min-w-[120px]">
                  <FiCalendar className="w-4 h-4 text-gray-400" />
                  <label className="font-medium text-gray-700 text-sm">Fecha de nacimiento</label>
                </div>
                <span className="flex-1 text-gray-800 text-sm">{userInfo.birthDate || '—'}</span>
              </div>

              {/* Documento de identidad (solo visualización) */}
              <div className="flex sm:flex-row flex-col sm:items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2 min-w-[120px]">
                  <FiFileText className="w-4 h-4 text-gray-400" />
                  <label className="font-medium text-gray-700 text-sm">Documento de identidad</label>
                </div>
                <span className="flex-1 text-gray-800 text-sm">{userInfo.cardId || '—'}</span>
              </div>
            </div>
            )}
          </div>

          {/* Sección: Métodos de Pago */}
          <div className="bg-white shadow-sm p-5 md:p-6 rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">

                <h2 className="font-semibold text-[#373577] text-md md:text-xl">Métodos de Pago</h2>
              </div>
              <button
                onClick={openPaymentModal}
                className="flex items-center gap-2 bg-[#373577] hover:bg-[#2a2a5f] px-4 py-2 rounded-lg font-medium text-white text-sm transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Agregar</span>
              </button>
            </div>

            <div className="space-y-3">
              {isLoadingPayments ? (
                <div className="flex justify-center py-8">
                  <FiLoader className="w-8 h-8 text-[#373577] animate-spin" />
                </div>
              ) : paymentMethods.length === 0 ? (
                <div className="py-8 text-gray-500 text-sm text-center">
                  <FiCreditCard className="mx-auto mb-3 w-12 h-12 text-gray-300" />
                  <p>No tienes métodos de pago guardados</p>
                </div>
              ) : (
                paymentMethods.map((method) => {
                  const hasCard = Boolean(method.methodPayments?.card)
                  const { lastFour, cardHolder } = hasCard ? formatCardDisplay(method) : { lastFour: '', cardHolder: '' }
                  return (
                    <div
                      key={method.id}
                      className="flex justify-between items-center p-4 border border-gray-200 hover:border-[#373577] rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-gray-100 p-3 rounded-lg">
                          {getPaymentIcon(hasCard)}
                        </div>
                        <div>
                          {hasCard ? (
                            <>
                              <p className="font-semibold text-gray-800 text-sm">
                                •••• •••• •••• {lastFour}
                              </p>
                              <p className="text-gray-600 text-xs">{cardHolder}</p>
                            </>
                          ) : (
                            <p className="font-semibold text-gray-800 text-sm">Efectivo</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {/* Columna derecha - Historial de Compras */}
        <div className="w-full lg:w-96">
          <div className="flex flex-col bg-white shadow-sm p-5 md:p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-[#373577] text-md md:text-xl">Historial de Compras</h2>
            </div>

            {/* Barra de búsqueda */}
            <div className="mb-4">
              <div className="relative">
                <FiSearch className="top-1/2 left-3 absolute w-4 h-4 text-gray-400 -translate-y-1/2 transform" />
                <input
                  type="text"
                  placeholder="Buscar por código, nombre o fecha..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="focus:ring-opacity-20 py-2 pr-4 pl-10 border border-gray-300 focus:border-[#373577] rounded-lg focus:outline-none focus:ring-[#373577] focus:ring-2 w-full text-sm"
                />
              </div>
            </div>

            {/* Lista de órdenes con scroll */}
            <div className="space-y-4 pr-2 max-h-[500px] overflow-y-auto">
              {isLoadingOrders ? (
                <div className="flex justify-center py-8">
                  <FiLoader className="w-8 h-8 text-[#373577] animate-spin" />
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="py-8 text-gray-500 text-sm text-center">
                  <FiShoppingBag className="mx-auto mb-3 w-12 h-12 text-gray-300" />
                  <p>{searchFilter ? 'No se encontraron órdenes' : 'No tienes órdenes aún'}</p>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 border border-gray-200 hover:border-[#373577] rounded-lg transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">Orden {order.id}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <FiCalendar className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-600 text-xs">
                            {new Date(order.date).toLocaleDateString('es-DO', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}>
                        {getOrderStatusText(order.status)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-gray-100 border-t">
                      <div className="flex items-center gap-2">
                        <FiPackage className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 text-xs">{order.items} {order.items === 1 ? 'artículo' : 'artículos'}</span>
                      </div>
                      <span className="font-semibold text-[#373577] text-sm">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal para agregar método de pago */}
      {showPaymentModal && (
        <div 
          className="z-50 fixed inset-0 flex justify-center items-center bg-black/50"
          onClick={closePaymentModal}
        >
          <div 
            className="bg-white shadow-xl mx-4 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="top-0 sticky flex justify-between items-center bg-white px-6 py-4 border-gray-200 border-b">
              <h3 className="font-semibold text-[#373577] text-lg">Agregar Método de Pago</h3>
              <button
                onClick={closePaymentModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 p-6">
              {/* Tipo de método de pago (sin Transferencia Bancaria) */}
              <div>
                <label className="block mb-2 font-medium text-gray-700 text-sm">Tipo de pago</label>
                <select
                  value={paymentForm.type}
                  onChange={(e) => setPaymentForm({ ...paymentForm, type: e.target.value as 'card' | 'cash' })}
                  className="focus:ring-opacity-20 px-3 py-2 border border-gray-300 focus:border-[#373577] rounded-lg focus:outline-none focus:ring-[#373577] focus:ring-2 w-full text-sm"
                >
                  <option value="card">Tarjeta de Crédito/Débito</option>
                  <option value="cash">Efectivo</option>
                </select>
              </div>

              {/* Formulario para tarjeta */}
              {paymentForm.type === 'card' && (
                <>
                  <div>
                    <label className="block mb-2 font-medium text-gray-700 text-sm">Número de tarjeta</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={paymentForm.cardNumber || ''}
                      onChange={(e) => setPaymentForm({ ...paymentForm, cardNumber: e.target.value.replace(/\s/g, '') })}
                      maxLength={16}
                      className="focus:ring-opacity-20 px-3 py-2 border border-gray-300 focus:border-[#373577] rounded-lg focus:outline-none focus:ring-[#373577] focus:ring-2 w-full text-sm"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-gray-700 text-sm">Titular de la tarjeta</label>
                    <input
                      type="text"
                      placeholder="Nombre completo"
                      value={paymentForm.cardHolder || ''}
                      onChange={(e) => setPaymentForm({ ...paymentForm, cardHolder: e.target.value })}
                      className="focus:ring-opacity-20 px-3 py-2 border border-gray-300 focus:border-[#373577] rounded-lg focus:outline-none focus:ring-[#373577] focus:ring-2 w-full text-sm"
                    />
                  </div>
                  <div className="gap-4 grid grid-cols-2">
                    <div>
                      <label className="block mb-2 font-medium text-gray-700 text-sm">Fecha de vencimiento</label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        value={paymentForm.expiryDate || ''}
                        onChange={(e) => setPaymentForm({ ...paymentForm, expiryDate: e.target.value })}
                        maxLength={5}
                        className="focus:ring-opacity-20 px-3 py-2 border border-gray-300 focus:border-[#373577] rounded-lg focus:outline-none focus:ring-[#373577] focus:ring-2 w-full text-sm"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 font-medium text-gray-700 text-sm">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        value={paymentForm.cvv || ''}
                        onChange={(e) => setPaymentForm({ ...paymentForm, cvv: e.target.value.replace(/\D/g, '') })}
                        maxLength={4}
                        className="focus:ring-opacity-20 px-3 py-2 border border-gray-300 focus:border-[#373577] rounded-lg focus:outline-none focus:ring-[#373577] focus:ring-2 w-full text-sm"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Checkbox para método predeterminado */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={paymentForm.isDefault}
                  onChange={(e) => setPaymentForm({ ...paymentForm, isDefault: e.target.checked })}
                  className="border-gray-300 rounded focus:ring-[#373577] w-4 h-4 text-[#373577]"
                />
                <label htmlFor="isDefault" className="text-gray-700 text-sm">
                  Establecer como método de pago predeterminado
                </label>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3 pt-4 border-gray-200 border-t">
                <button
                  onClick={closePaymentModal}
                  className="flex-1 hover:bg-gray-50 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 text-sm transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={savePaymentMethod}
                  className="flex-1 bg-[#373577] hover:bg-[#2a2a5f] px-4 py-2 rounded-lg font-medium text-white text-sm transition-colors"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
