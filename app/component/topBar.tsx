"use client"
import React, { useState, useEffect, useRef } from 'react'
import { FiDollarSign, FiUser, FiCreditCard, FiLogOut, FiChevronDown } from 'react-icons/fi'

/**
 * Tipos de moneda disponibles en el ecommerce
 */
type Currency = 'USD' | 'PESO'

/**
 * Componente TopBar - Barra superior del ecommerce
 * 
 * Incluye:
 * - Selector de moneda (USD/PESO) con dropdown animado
 * - Menú "Mi cuenta" con opciones: Perfil, Método de pago, Cerrar sesión
 * 
 * Características:
 * - Dropdowns modernos con animaciones suaves
 * - Cierre automático al hacer click fuera
 * - Iconos intuitivos para mejor UX
 * - Diseño responsive
 */
export default function TopBar() {
  // Estado para controlar la visibilidad del dropdown de moneda
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false)
  
  // Estado para controlar la visibilidad del dropdown de cuenta
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false)
  
  // Estado para la moneda seleccionada (por defecto USD)
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('USD')
  
  // Referencias para detectar clicks fuera de los dropdowns
  const currencyDropdownRef = useRef<HTMLDivElement>(null)
  const accountDropdownRef = useRef<HTMLDivElement>(null)

  /**
   * Cierra los dropdowns cuando se hace click fuera de ellos
   * También cierra al presionar la tecla Escape
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Cerrar dropdown de moneda si se hace click fuera
      if (
        currencyDropdownRef.current &&
        !currencyDropdownRef.current.contains(event.target as Node)
      ) {
        setCurrencyDropdownOpen(false)
      }
      
      // Cerrar dropdown de cuenta si se hace click fuera
      if (
        accountDropdownRef.current &&
        !accountDropdownRef.current.contains(event.target as Node)
      ) {
        setAccountDropdownOpen(false)
      }
    }

    // Cerrar con tecla Escape
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setCurrencyDropdownOpen(false)
        setAccountDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    // Limpiar event listeners al desmontar el componente
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  /**
   * Maneja el cambio de moneda
   * @param currency - La moneda seleccionada (USD o PESO)
   */
  const handleCurrencyChange = (currency: Currency) => {
    setSelectedCurrency(currency)
    setCurrencyDropdownOpen(false)
    // Aquí puedes agregar lógica adicional como actualizar el contexto global,
    // guardar en localStorage, o hacer una llamada a la API
    console.log(`Moneda cambiada a: ${currency}`)
  }

  /**
   * Maneja las acciones del menú de cuenta
   * @param action - La acción seleccionada
   */
  const handleAccountAction = (action: string) => {
    setAccountDropdownOpen(false)
    
    switch (action) {
      case 'profile':
        // Navegar a la página de perfil
        console.log('Navegar a perfil')
        // router.push('/perfil')
        break
      case 'payment':
        // Navegar a métodos de pago
        console.log('Navegar a métodos de pago')
        // router.push('/metodos-pago')
        break
      case 'logout':
        // Cerrar sesión
        console.log('Cerrar sesión')
        // Aquí puedes agregar la lógica de logout
        // Ejemplo: signOut(), limpiar tokens, etc.
        break
      default:
        break
    }
  }

  return (
    <div className='flex justify-end items-center gap-6 bg-[#3183E6] px-4 py-3 pr-10 text-white'>
      {/* Selector de Moneda */}
      <div className="relative" ref={currencyDropdownRef}>
        <button
          onClick={() => {
            setCurrencyDropdownOpen(!currencyDropdownOpen)
            setAccountDropdownOpen(false) // Cerrar el otro dropdown si está abierto
          }}
          className="flex items-center gap-2 hover:bg-blue-600 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 transition-colors duration-200"
          aria-expanded={currencyDropdownOpen}
          aria-haspopup="true"
          aria-label="Seleccionar moneda"
        >
          <FiDollarSign className="w-4 h-4" />
          <span className="font-medium text-sm">{selectedCurrency}</span>
          <FiChevronDown 
            className={`w-4 h-4 transition-transform duration-200 ${
              currencyDropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Dropdown de Moneda */}
        {currencyDropdownOpen && (
          <div className="right-0 z-50 absolute bg-white shadow-xl mt-2 border border-gray-200 rounded-lg w-40 overflow-hidden dropdown-enter">
            <div className="py-1">
              <button
                onClick={() => handleCurrencyChange('USD')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 transition-colors duration-150 ${
                  selectedCurrency === 'USD' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                <FiDollarSign className="w-4 h-4" />
                <span className="font-medium text-sm">USD</span>
                {selectedCurrency === 'USD' && (
                  <span className="ml-auto text-blue-600">✓</span>
                )}
              </button>
              
              <button
                onClick={() => handleCurrencyChange('PESO')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 transition-colors duration-150 ${
                  selectedCurrency === 'PESO' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                <span className="font-bold text-sm">$</span>
                <span className="font-medium text-sm">PESO</span>
                {selectedCurrency === 'PESO' && (
                  <span className="ml-auto text-blue-600">✓</span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Menú Mi Cuenta */}
      <div className="relative" ref={accountDropdownRef}>
        <button
          onClick={() => {
            setAccountDropdownOpen(!accountDropdownOpen)
            setCurrencyDropdownOpen(false) // Cerrar el otro dropdown si está abierto
          }}
          className="flex items-center gap-2 hover:bg-blue-600 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 transition-colors duration-200"
          aria-expanded={accountDropdownOpen}
          aria-haspopup="true"
          aria-label="Menú de cuenta"
        >
          <FiUser className="w-4 h-4" />
          <span className="font-medium text-sm">Mi cuenta</span>
          <FiChevronDown 
            className={`w-4 h-4 transition-transform duration-200 ${
              accountDropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Dropdown de Cuenta */}
        {accountDropdownOpen && (
          <div className="right-0 z-50 absolute bg-white shadow-xl mt-2 border border-gray-200 rounded-lg w-56 overflow-hidden dropdown-enter">
            <div className="py-1">
              {/* Opción: Perfil */}
              <button
               onClick={() => {
                window.location.href = '/perfil-usuario'
              }}
                className="group flex items-center gap-3 hover:bg-gray-100 px-4 py-3 w-full text-gray-700 text-left transition-colors duration-150"
              >
                <FiUser className="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
                <span className="font-medium text-sm">Perfil</span>
              </button>

              {/* Opción: Método de pago */}
              <button
                onClick={() => handleAccountAction('payment')}
                className="group flex items-center gap-3 hover:bg-gray-100 px-4 py-3 w-full text-gray-700 text-left transition-colors duration-150"
              >
                <FiCreditCard className="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
                <span className="font-medium text-sm">Método de pago</span>
              </button>

              {/* Separador */}
              <div className="my-1 border-gray-200 border-t"></div>

              {/* Opción: Cerrar sesión */}
              <button
                onClick={() => {
                  window.location.href = '/login'
                }}
                className="group flex items-center gap-3 hover:bg-red-50 px-4 py-3 w-full text-red-600 text-left transition-colors duration-150"
              >
                <FiLogOut className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                <span className="font-medium text-sm">Cerrar sesión</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
