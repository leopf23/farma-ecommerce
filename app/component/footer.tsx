import React from 'react'
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa'
import { FiMail } from 'react-icons/fi'
import { MdLocationOn } from 'react-icons/md'
import { BsTwitterX } from 'react-icons/bs'
import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-white border-gray-200 border-t">
            {/* Main content */}
            <div className="px-6 md:px-12 lg:px-20 py-12 md:py-16">
                <div className="gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                    {/* Logo and Address Section */}
                    <div className="flex flex-col gap-6">
                        <div>
                            <Link href="/" className="flex items-center gap-2">
                                <img src="/logo.png" alt="logo" className="w-auto h-10 object-contain" />
                            </Link>
                        </div>

                        <div className="text-gray-700 text-sm leading-relaxed">
                            <p>La Trinitaria · Av. Juan Pablo Duarte</p>
                            <p>No. 104, Plaza Corona</p>
                        </div>

                        <Link href="#" className="font-medium text-blue-600 text-sm hover:underline">
                            Ver en mapa
                        </Link>

                        {/* Social Icons */}
                        <div className="flex gap-4">
                            <Link href="#" className="text-blue-600 hover:text-blue-800 text-xl">
                                <FaFacebook />
                            </Link>
                            <Link href="#" className="text-pink-500 hover:text-pink-700 text-xl">
                                <FaInstagram />
                            </Link>
                            <Link href="#" className="text-blue-700 hover:text-blue-900 text-xl">
                                <FaLinkedin />
                            </Link>
                            <Link href="#" className="text-black hover:text-gray-700 text-xl">
                                <BsTwitterX />
                            </Link>
                        </div>
                    </div>

                    {/* Help Section */}
                    <div className="flex flex-col gap-4">
                        <h3 className="font-semibold text-blue-600 text-base">Necesitas ayuda ?</h3>

                        <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-800 text-2xl">809.582.1627</span>
                        </div>

                        <div className="text-gray-700 text-sm leading-relaxed">
                            <p>Viernes 7:00am a 10:00pm. Sábado</p>
                            <p>y Domingo 7:00am a 10:00pm</p>
                        </div>

                        <Link href="mailto:farmaextra@gmail.com" className="flex items-center gap-2 font-medium text-blue-600 text-sm hover:underline">
                            <FiMail size={16} />
                            farmaextra@gmail.com
                        </Link>
                    </div>

                    {/* Menu Section - Hidden on mobile, shown on md+ */}
                    <div className="hidden md:flex flex-col gap-4">
                        <h3 className="font-semibold text-gray-800 text-base">Menu</h3>
                        <ul className="space-y-2 text-gray-700 text-sm">
                            <li>
                                <Link href="#" className="hover:text-blue-600 transition">Mis Ordenes</Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-blue-600 transition">Soporte</Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-blue-600 transition">Sucursales</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Empty column for spacing on lg */}
                    <div className="hidden lg:block"></div>
                </div>
            </div>

            {/* Copyright Section */}
            <div className="bg-gray-50 px-6 md:px-12 lg:px-20 py-6 border-gray-200 border-t">
                <p className="text-gray-500 text-sm text-center">
                    Copyright 2025 Codeando All Rights Reserved
                </p>
            </div>
        </footer>
    )
}
