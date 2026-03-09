"use client"
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiUser, FiCreditCard, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { useStoreAuthLogin } from '@/src/hooks/AuthLogin/StoreProvider';
import { useAuthLogin } from '@/src/hooks/AuthLogin';


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
  const router = useRouter()
  const { user } = useStoreAuthLogin()
  const { logout } = useAuthLogin()

  // Estado para controlar la visibilidad del dropdown de cuenta
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false)
  
  // Referencias para detectar clicks fuera de los dropdowns
  const accountDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountDropdownRef.current &&
        !accountDropdownRef.current.contains(event.target as Node)
      ) {
        setAccountDropdownOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setAccountDropdownOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const handleLogout = () => {
    setAccountDropdownOpen(false)
    logout()
    router.push('/login')
  }

  const handleAccountAction = (action: string) => {
    setAccountDropdownOpen(false)
    if (action === 'logout') handleLogout()
  }

  return (
    <div className='flex justify-end items-center gap-6 bg-[#3183E6] px-4 py-3 pr-10 text-white'>
      {user ? (
        <div className="relative" ref={accountDropdownRef}>
          <button
            onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
          className="flex items-center gap-2 hover:bg-blue-600 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 transition-colors duration-200"
          aria-expanded={accountDropdownOpen}
          aria-haspopup="true"
          aria-label="Menú de cuenta"
        >
          <FiUser className="w-4 h-4" />
          <span className="font-medium text-sm truncate max-w-[140px]">
            {user?.name || user?.email || 'Mi cuenta'}
          </span>
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
                onClick={() => handleAccountAction('logout')}
                className="group flex items-center gap-3 hover:bg-red-50 px-4 py-3 w-full text-red-600 text-left transition-colors duration-150"
              >
                <FiLogOut className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                <span className="font-medium text-sm">Cerrar sesión</span>
              </button>
            </div>
          </div>
        )}
      </div>
      ) : (
        <Link
          href="/login"
          className="flex items-center gap-2 hover:bg-blue-600 px-3 py-2 rounded-lg font-medium text-sm transition-colors"
        >
          <FiUser className="w-4 h-4" />
          Iniciar sesión
        </Link>
      )}
    </div>
  )
}
