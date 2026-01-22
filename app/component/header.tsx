"use client"
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { FiSearch, FiPhone, FiChevronDown, FiMenu, FiX, FiShoppingCart, FiHeart, FiRepeat } from 'react-icons/fi'

const CATEGORIES = [
  'Todas las categorías',
  'Home',
  'Hipertensión',
  'Diabetes y tiroides',
  'Sist. circulatorio y Nervioso',
  'Anticonceptivos y salud sexual',
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${searchQuery}`)
    }
  }

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  // close when clicked outside panel
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!mobileOpen) return
      if (!panelRef.current) return
      if (!panelRef.current.contains(e.target as Node)) {
        setMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [mobileOpen])

  return (
    <header className="bg-white w-full">
      <div className="mx-auto px-4 sm:px-6 lg:px-0 max-w-7xl">
        <div className="flex justify-between items-center h-24">
          {/* Left: Logo / menu */}
          <div className="flex items-center gap-4">
            <button
              aria-label="Abrir menú"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
              className="md:hidden hover:bg-gray-100 p-2 rounded-md text-gray-600"
            >
              <FiMenu size={20} />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="logo" className="w-auto h-10 object-contain" />
            </Link>
          </div>

          {/* Center: Search - stacked on mobile */}
          <div className="flex-1 px-4">
            <form onSubmit={handleSearch} className="w-50 md:w-full">
              <div className="hidden md:flex items-center bg-gray-100 rounded-full overflow-hidden">
                <select className="bg-transparent py-3 pr-3 pl-4 outline-none text-gray-700 text-sm" aria-label="Categorías">
                  <option>Categorías</option>
                  <option>Salud</option>
                  <option>Belleza</option>
                  <option>Higiene</option>
                </select>

                <input
                  className="flex-1 bg-transparent py-3 outline-none text-gray-800 text-sm placeholder-gray-500"
                  type="search"
                  placeholder="Que quieres buscar ?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="bg-red-500 hover:bg-red-600 px-5 py-3 rounded-r-full text-white">
                  <FiSearch />
                </button>
              </div>

              {/* Mobile search bar */}
              <div className="md:hidden flex items-center bg-gray-100 shadow-sm rounded-full overflow-hidden">
                <select className="bg-transparent py-2 pr-2 pl-3 outline-none text-gray-700 text-sm">
                  <option>Categorías</option>
                </select>
                <input
                  className="flex-1 bg-transparent px-2 py-2 outline-none text-gray-800 text-sm placeholder-gray-500"
                  type="search"
                  placeholder="Que quieres buscar ?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="bg-red-500 hover:bg-red-600 px-3 py-2 text-white">
                  <FiSearch />
                </button>
              </div>
            </form>
          </div>

          {/* Right: Customer service */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-transparent p-3 rounded-full text-gray-700">
                <FiPhone size={18} />
              </div>
              <div className="text-right">
                <div className="text-gray-500 text-xs">Servicio al cliente</div>
                <div className="font-semibold text-blue-700 text-sm">809-000-000</div>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Categories row (desktop) */}
        <div className="bg-whitew-full border-gray-200 border-y">
          <div className="mx-auto px-4 sm:px-6 lg:px-0 py-3 max-w-7xl">
            <div className="flex justify-between items-center h-14">
              <div className="flex items-center gap-3">
                <button className="hidden md:inline-block bg-gray-100 px-4 py-2 rounded-full text-gray-800 text-sm">Todas las categorias</button>
              </div>

              <nav className="hidden md:flex items-center gap-6 text-gray-600 text-sm">
                {CATEGORIES.slice(1).map((cat) => (
                  <a key={cat} href="#" className="hover:text-gray-900">
                    {cat}
                  </a>
                ))}
              </nav>

              <div className="hidden md:flex items-center gap-4 text-gray-600 cursor-pointer">
                <button className="hover:bg-gray-100 p-2 rounded-md">
                  <FiRepeat />
                </button>
                <button className="hover:bg-gray-100 p-2 rounded-md cursor-pointer">
                  <FiHeart />
                </button>
                <button
                  className="hover:bg-gray-100 p-2 rounded-md cursor-pointer"
                  onClick={() => router.push('/shop')}
                >
                  <FiShoppingCart />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile overlay + panel */}
      {mobileOpen && (
        <div className="z-40 fixed inset-0 flex">
          <div className="absolute inset-0 bg-black opacity-30" aria-hidden="true" />

          <aside
            ref={panelRef}
            className="relative bg-white shadow-xl p-4 w-72 max-w-full h-full overflow-auto"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="logo" className="w-auto h-8 object-contain" />
              </div>
              <button aria-label="Cerrar menú" onClick={() => setMobileOpen(false)} className="hover:bg-gray-100 p-2 rounded-md text-gray-700">
                <FiX size={20} />
              </button>
            </div>

            <nav className="space-y-2">
              <div className="px-2 py-2 text-gray-500 text-sm">Categorías</div>
              {CATEGORIES.map((cat) => (
                <a
                  key={cat}
                  href="#"
                  className="block hover:bg-gray-100 px-3 py-2 rounded-md text-gray-800"
                  onClick={() => setMobileOpen(false)}
                >
                  {cat}
                </a>
              ))}
            </nav>

            <div className="mt-4 pt-4 border-t">
              <a href="#" className="flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded-md">
                <FiPhone />
                <div>
                  <div className="text-gray-500 text-xs">Servicio al cliente</div>
                  <div className="font-semibold text-blue-700 text-sm">809-000-000</div>
                </div>
              </a>
            </div>
          </aside>
        </div>
      )}
    </header>
  )
}
