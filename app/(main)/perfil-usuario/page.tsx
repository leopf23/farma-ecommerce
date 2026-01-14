'use client'

import React, { useState } from 'react'
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiEdit2, 
  FiCheck, 
  FiX, 
  FiCreditCard, 
  FiPlus,
  FiTrash2,
  FiShoppingBag,
  FiCalendar,
  FiPackage,
  FiDollarSign,
  FiSearch
} from 'react-icons/fi'

// Tipos de datos
interface UserInfo {
  name: string
  email: string
  phone: string
  address: string
  city: string
  zipCode: string
}

interface PaymentMethod {
  id: string
  type: 'card' | 'transfer' | 'cash'
  lastFour?: string
  cardHolder?: string
  bank?: string
  isDefault: boolean
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
  type: 'card' | 'transfer' | 'cash'
  cardNumber?: string
  cardHolder?: string
  expiryDate?: string
  cvv?: string
  bank?: string
  accountNumber?: string
  isDefault: boolean
}

export default function PerfilUsuarioPage() {
  // Estado para información del usuario
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    phone: '809-123-4567',
    address: 'Calle Principal #123',
    city: 'Santo Domingo',
    zipCode: '10101'
  })

  // Estado para métodos de pago
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      lastFour: '4242',
      cardHolder: 'Juan Pérez',
      isDefault: true
    },
    {
      id: '2',
      type: 'transfer',
      bank: 'Banco Popular',
      isDefault: false
    }
  ])

  // Estado para órdenes (historial de compras)
  const [orders] = useState<Order[]>([
    {
      id: 'ORD-001',
      date: '2024-01-15',
      total: 125.50,
      status: 'completed',
      items: 3,
      customerName: 'Juan Pérez'
    },
    {
      id: 'ORD-002',
      date: '2024-01-10',
      total: 89.99,
      status: 'completed',
      items: 2,
      customerName: 'Juan Pérez'
    },
    {
      id: 'ORD-003',
      date: '2024-01-05',
      total: 45.00,
      status: 'pending',
      items: 1,
      customerName: 'Juan Pérez'
    },
    {
      id: 'ORD-004',
      date: '2023-12-20',
      total: 200.00,
      status: 'completed',
      items: 5,
      customerName: 'Juan Pérez'
    },
    {
      id: 'ORD-005',
      date: '2023-12-15',
      total: 75.25,
      status: 'completed',
      items: 2,
      customerName: 'Juan Pérez'
    }
  ])

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

  // Guardar cambios
  const saveField = async (field: keyof UserInfo) => {
    setIsSaving(true)
    
    // Simular guardado (en producción sería una llamada a API)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setUserInfo(prev => ({
      ...prev,
      [field]: editValue
    }))
    
    setEditingField(null)
    setEditValue('')
    setIsSaving(false)
    setShowSuccess(true)
    
    // Ocultar mensaje de éxito después de 3 segundos
    setTimeout(() => setShowSuccess(false), 3000)
  }

  // Abrir modal de método de pago
  const openPaymentModal = () => {
    setPaymentForm({
      type: 'card',
      isDefault: false
    })
    setShowPaymentModal(true)
  }

  // Cerrar modal de método de pago
  const closePaymentModal = () => {
    setShowPaymentModal(false)
    setPaymentForm({
      type: 'card',
      isDefault: false
    })
  }

  // Guardar nuevo método de pago
  const savePaymentMethod = () => {
    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: paymentForm.type,
      isDefault: paymentForm.isDefault || paymentMethods.length === 0
    }

    if (paymentForm.type === 'card') {
      newMethod.lastFour = paymentForm.cardNumber?.slice(-4) || '0000'
      newMethod.cardHolder = paymentForm.cardHolder || ''
    } else if (paymentForm.type === 'transfer') {
      newMethod.bank = paymentForm.bank || ''
    }

    // Si se marca como predeterminado, quitar el predeterminado de otros
    if (newMethod.isDefault) {
      setPaymentMethods(prev =>
        prev.map(m => ({ ...m, isDefault: false }))
      )
    }

    setPaymentMethods(prev => [...prev, newMethod])
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
    closePaymentModal()
  }

  // Eliminar método de pago
  const removePaymentMethod = (id: string) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== id))
  }

  // Establecer método de pago por defecto
  const setDefaultPayment = (id: string) => {
    setPaymentMethods(prev =>
      prev.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    )
  }

  // Obtener icono del tipo de método de pago
  const getPaymentIcon = (type: PaymentMethod['type']) => {
    switch (type) {
      case 'card':
        return <FiCreditCard className="w-5 h-5" />
      case 'transfer':
        return <FiDollarSign className="w-5 h-5" />
      case 'cash':
        return <FiDollarSign className="w-5 h-5" />
      default:
        return <FiCreditCard className="w-5 h-5" />
    }
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
                        onClick={() => startEdit('name', userInfo.name)}
                        className="hover:bg-gray-50 p-1.5 rounded-md text-[#373577] hover:text-[#2a2a5f] transition-colors"
                        aria-label="Editar nombre"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex sm:flex-row flex-col sm:items-center gap-2 sm:gap-4 pb-4 border-gray-100 border-b">
                <div className="flex items-center gap-2 min-w-[120px]">
                  <FiMail className="w-4 h-4 text-gray-400" />
                  <label className="font-medium text-gray-700 text-sm">Email</label>
                </div>
                <div className="flex flex-1 items-center gap-2">
                  {editingField === 'email' ? (
                    <>
                      <input
                        type="email"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="flex-1 focus:ring-opacity-20 px-3 py-2 border border-gray-300 focus:border-[#373577] rounded-lg focus:outline-none focus:ring-[#373577] focus:ring-2 text-sm"
                        autoFocus
                      />
                      <button
                        onClick={() => saveField('email')}
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
                      <span className="flex-1 text-gray-800 text-sm">{userInfo.email}</span>
                      <button
                        onClick={() => startEdit('email', userInfo.email)}
                        className="hover:bg-gray-50 p-1.5 rounded-md text-[#373577] hover:text-[#2a2a5f] transition-colors"
                        aria-label="Editar email"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
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
                        onClick={() => startEdit('phone', userInfo.phone)}
                        className="hover:bg-gray-50 p-1.5 rounded-md text-[#373577] hover:text-[#2a2a5f] transition-colors"
                        aria-label="Editar teléfono"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Dirección */}
              <div className="flex sm:flex-row flex-col sm:items-start gap-2 sm:gap-4 pb-4 border-gray-100 border-b">
                <div className="flex items-center gap-2 min-w-[120px]">
                  <FiMapPin className="w-4 h-4 text-gray-400" />
                  <label className="font-medium text-gray-700 text-sm">Dirección</label>
                </div>
                <div className="flex flex-1 items-center gap-2">
                  {editingField === 'address' ? (
                    <>
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="flex-1 focus:ring-opacity-20 px-3 py-2 border border-gray-300 focus:border-[#373577] rounded-lg focus:outline-none focus:ring-[#373577] focus:ring-2 text-sm"
                        autoFocus
                      />
                      <button
                        onClick={() => saveField('address')}
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
                      <span className="flex-1 text-gray-800 text-sm">{userInfo.address}</span>
                      <button
                        onClick={() => startEdit('address', userInfo.address)}
                        className="hover:bg-gray-50 p-1.5 rounded-md text-[#373577] hover:text-[#2a2a5f] transition-colors"
                        aria-label="Editar dirección"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Ciudad y Código Postal */}
              <div className="flex sm:flex-row flex-col gap-4">
                <div className="flex sm:flex-row flex-col flex-1 sm:items-center gap-2 sm:gap-4">
                  <label className="min-w-[120px] font-medium text-gray-700 text-sm">Ciudad</label>
                  <div className="flex flex-1 items-center gap-2">
                    {editingField === 'city' ? (
                      <>
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="flex-1 focus:ring-opacity-20 px-3 py-2 border border-gray-300 focus:border-[#373577] rounded-lg focus:outline-none focus:ring-[#373577] focus:ring-2 text-sm"
                          autoFocus
                        />
                        <button
                          onClick={() => saveField('city')}
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
                        <span className="flex-1 text-gray-800 text-sm">{userInfo.city}</span>
                        <button
                          onClick={() => startEdit('city', userInfo.city)}
                          className="hover:bg-gray-50 p-1.5 rounded-md text-[#373577] hover:text-[#2a2a5f] transition-colors"
                          aria-label="Editar ciudad"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-row flex-col flex-1 sm:items-center gap-2 sm:gap-4">
                  <label className="min-w-[120px] font-medium text-gray-700 text-sm">Código Postal</label>
                  <div className="flex flex-1 items-center gap-2">
                    {editingField === 'zipCode' ? (
                      <>
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="flex-1 focus:ring-opacity-20 px-3 py-2 border border-gray-300 focus:border-[#373577] rounded-lg focus:outline-none focus:ring-[#373577] focus:ring-2 text-sm"
                          autoFocus
                        />
                        <button
                          onClick={() => saveField('zipCode')}
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
                        <span className="flex-1 text-gray-800 text-sm">{userInfo.zipCode}</span>
                        <button
                          onClick={() => startEdit('zipCode', userInfo.zipCode)}
                          className="hover:bg-gray-50 p-1.5 rounded-md text-[#373577] hover:text-[#2a2a5f] transition-colors"
                          aria-label="Editar código postal"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
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
              {paymentMethods.length === 0 ? (
                <div className="py-8 text-gray-500 text-sm text-center">
                  <FiCreditCard className="mx-auto mb-3 w-12 h-12 text-gray-300" />
                  <p>No tienes métodos de pago guardados</p>
                </div>
              ) : (
                paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="flex justify-between items-center p-4 border border-gray-200 hover:border-[#373577] rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        {getPaymentIcon(method.type)}
                      </div>
                      <div>
                        {method.type === 'card' && (
                          <>
                            <p className="font-semibold text-gray-800 text-sm">
                              •••• •••• •••• {method.lastFour}
                            </p>
                            <p className="text-gray-600 text-xs">{method.cardHolder}</p>
                          </>
                        )}
                        {method.type === 'transfer' && (
                          <>
                            <p className="font-semibold text-gray-800 text-sm">Transferencia Bancaria</p>
                            <p className="text-gray-600 text-xs">{method.bank}</p>
                          </>
                        )}
                        {method.type === 'cash' && (
                          <p className="font-semibold text-gray-800 text-sm">Efectivo</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {method.isDefault ? (
                        <span className="bg-[#373577] bg-opacity-10 px-3 py-1 rounded-full font-medium text-white text-xs">
                          Predeterminado
                        </span>
                      ) : (
                        <button
                          onClick={() => setDefaultPayment(method.id)}
                          className="font-medium text-[#373577] hover:text-[#2a2a5f] text-xs transition-colors"
                        >
                          Establecer como predeterminado
                        </button>
                      )}
                      <button
                        onClick={() => removePaymentMethod(method.id)}
                        className="hover:bg-red-50 p-2 rounded-md text-red-500 hover:text-red-700 transition-colors"
                        aria-label="Eliminar método de pago"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
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
              {filteredOrders.length === 0 ? (
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
              {/* Tipo de método de pago */}
              <div>
                <label className="block mb-2 font-medium text-gray-700 text-sm">Tipo de pago</label>
                <select
                  value={paymentForm.type}
                  onChange={(e) => setPaymentForm({ ...paymentForm, type: e.target.value as 'card' | 'transfer' | 'cash' })}
                  className="focus:ring-opacity-20 px-3 py-2 border border-gray-300 focus:border-[#373577] rounded-lg focus:outline-none focus:ring-[#373577] focus:ring-2 w-full text-sm"
                >
                  <option value="card">Tarjeta de Crédito/Débito</option>
                  <option value="transfer">Transferencia Bancaria</option>
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

              {/* Formulario para transferencia */}
              {paymentForm.type === 'transfer' && (
                <>
                  <div>
                    <label className="block mb-2 font-medium text-gray-700 text-sm">Banco</label>
                    <input
                      type="text"
                      placeholder="Nombre del banco"
                      value={paymentForm.bank || ''}
                      onChange={(e) => setPaymentForm({ ...paymentForm, bank: e.target.value })}
                      className="focus:ring-opacity-20 px-3 py-2 border border-gray-300 focus:border-[#373577] rounded-lg focus:outline-none focus:ring-[#373577] focus:ring-2 w-full text-sm"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-gray-700 text-sm">Número de cuenta</label>
                    <input
                      type="text"
                      placeholder="Número de cuenta"
                      value={paymentForm.accountNumber || ''}
                      onChange={(e) => setPaymentForm({ ...paymentForm, accountNumber: e.target.value })}
                      className="focus:ring-opacity-20 px-3 py-2 border border-gray-300 focus:border-[#373577] rounded-lg focus:outline-none focus:ring-[#373577] focus:ring-2 w-full text-sm"
                    />
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
