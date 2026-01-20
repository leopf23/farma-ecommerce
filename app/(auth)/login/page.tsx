"use client"
import React, { useState } from "react"
import Image from "next/image";
import { useRouter } from 'next/navigation'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FiUser, FiMail, FiPhone, FiMapPin, FiCheck, FiX } from "react-icons/fi";

interface RegisterForm {
    name: string
    email: string
    phone: string
    address: string
    city: string
    zipCode: string
    password: string
    confirmPassword: string
}

export default function Page() {
    const router = useRouter()
    const [isRegister, setIsRegister] = useState(false)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [userError, setUserError] = useState("")
    const [passError, setPassError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [authError, setAuthError] = useState("")
    
    // Estados para registro
    const [registerForm, setRegisterForm] = useState<RegisterForm>({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        zipCode: "",
        password: "",
        confirmPassword: ""
    })
    const [registerErrors, setRegisterErrors] = useState<Partial<RegisterForm>>({})
    const [showRegisterPassword, setShowRegisterPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setUserError("")
        setPassError("")
        setAuthError("")

        // Basic empty validation
        if (!username) setUserError("Ingresa tu usuario")
        if (!password) setPassError("Ingresa tu contraseña")

        if (!username || !password) return

        // Credentials check
        if (username === "user" && password === "farma2026") {
            // Success: redirect to home
            router.push("/")
            setUsername("")
            setPassword("")
        } else {
            setAuthError("Usuario o contraseña incorrectos")
            setUserError(" ")
            setPassError(" ")
        }
    }

    const handleRegisterChange = (field: keyof RegisterForm, value: string) => {
        setRegisterForm(prev => ({ ...prev, [field]: value }))
        // Limpiar error del campo cuando el usuario empiece a escribir
        if (registerErrors[field]) {
            setRegisterErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[field]
                return newErrors
            })
        }
    }

    const validateRegisterForm = (): boolean => {
        const errors: Partial<RegisterForm> = {}

        if (!registerForm.name.trim()) errors.name = "Ingresa tu nombre"
        if (!registerForm.email.trim()) {
            errors.email = "Ingresa tu correo electrónico"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.email)) {
            errors.email = "Ingresa un correo electrónico válido"
        }
        if (!registerForm.phone.trim()) {
            errors.phone = "Ingresa tu teléfono"
        } else if (!/^[\d\s-()]+$/.test(registerForm.phone)) {
            errors.phone = "Ingresa un teléfono válido"
        }
        if (!registerForm.address.trim()) errors.address = "Ingresa tu dirección"
        if (!registerForm.city.trim()) errors.city = "Ingresa tu ciudad"
        if (!registerForm.zipCode.trim()) {
            errors.zipCode = "Ingresa tu código postal"
        } else if (!/^\d+$/.test(registerForm.zipCode)) {
            errors.zipCode = "El código postal debe contener solo números"
        }
        if (!registerForm.password) {
            errors.password = "Ingresa una contraseña"
        } else if (registerForm.password.length < 6) {
            errors.password = "La contraseña debe tener al menos 6 caracteres"
        }
        if (!registerForm.confirmPassword) {
            errors.confirmPassword = "Confirma tu contraseña"
        } else if (registerForm.password !== registerForm.confirmPassword) {
            errors.confirmPassword = "Las contraseñas no coinciden"
        }

        setRegisterErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleRegisterSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!validateRegisterForm()) return

        // Simular registro exitoso
        // En producción, aquí harías una llamada a la API
        setShowSuccessModal(true)
        
        // Limpiar formulario después de 2 segundos
        setTimeout(() => {
            setRegisterForm({
                name: "",
                email: "",
                phone: "",
                address: "",
                city: "",
                zipCode: "",
                password: "",
                confirmPassword: ""
            })
            setShowSuccessModal(false)
            setIsRegister(false)
        }, 3000)
    }

    const toggleForm = () => {
        setIsRegister(!isRegister)
        // Limpiar errores al cambiar de formulario
        setUserError("")
        setPassError("")
        setAuthError("")
        setRegisterErrors({})
    }

    return (
        <main className="flex md:flex-row flex-col min-h-screen">
            {/* Background Image */}
            <aside
                className="hidden md:block md:flex-[1.1] bg-cover bg-center min-h-screen"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=8d0a6fbf3a5a6e4b3b2d3b6b0f8c9b2a')",
                }}
            />

            {/* Form Section */}
            <section className="flex flex-[0.9] justify-center items-center p-0 sm:p-5 md:p-12 overflow-y-auto">
                <div className={`bg-white p-7 rounded-lg w-full max-w-md transition-all duration-500 ease-in-out ${isRegister ? 'max-h-[90vh] overflow-y-auto' : 'overflow-visible'}`}>
                    <Image
                        src="/logo.png"
                        alt="Vercel logomark"
                        width={100}
                        height={100} />
                    
                    {/* Login Form */}
                    <div className={`transition-all duration-500 ease-in-out transform ${isRegister ? 'opacity-0 max-h-0 overflow-hidden -translate-x-4' : 'opacity-100 max-h-[2000px] translate-x-0'}`}>
                        <h1 className="my-8 font-semibold text-xl">Hola, Buen día</h1>
                        <p className="text-gray-500 text-sm">correo electrónico</p>

                        {authError && <div className="bg-red-100 mt-3 mb-3 px-3 py-2 rounded text-red-700">{authError}</div>}

                        <form onSubmit={handleSubmit} noValidate>
                            <div className={`mb-4 ${userError ? "" : ""}`}>
                                <input
                                    aria-label="usuario"
                                    placeholder="Ingresa tu correo electronico"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 ${userError ? "border-red-500 bg-red-50" : "border-gray-200"}`}
                                />
                                {userError && <small className="block mt-2 text-red-600 text-sm">{userError}</small>}
                            </div>

                            <div className="mb-4">
                                <div className="relative flex items-center">
                                    <input
                                        aria-label="contraseña"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="ingrese su contraseña"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={`flex-1 px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 ${passError ? "border-red-500 bg-red-50" : "border-gray-200"}`}
                                        style={{ paddingRight: "2.5rem" }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label="mostrar contraseña"
                                        className="top-1/2 right-3 absolute text-gray-500 hover:text-gray-700 text-lg -translate-y-1/2 transform"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                                    </button>
                                </div>
                                {passError && <small className="block mt-2 text-red-600 text-sm">{passError}</small>}
                            </div>

                            <div className="flex justify-between items-center mb-4">
                                <label className="flex items-center gap-2 text-gray-700">
                                    <input type="checkbox" className="w-4 h-4" /> <span>Recuerdame</span>
                                </label>
                                <a className="text-blue-500 text-sm">Olvidaste tu contraseña ?</a>
                            </div>

                            <button className="bg-[#36367A] hover:bg-[#303055] mt-2 py-3 rounded-lg w-full font-semibold text-white cursor-pointer" type="submit">Iniciar sesión</button>

                            <button type="button" className="flex justify-center items-center gap-2 bg-[#F0F0F0] mt-3 py-3 rounded-lg w-full text-gray-800 cursor-pointer">
                                <span className="bg-white px-2 py-0.5 rounded text-red-500">G</span> Iniciar con google
                            </button>

                            <p className="mt-4 text-gray-500 text-sm text-center">
                                Aun no tienes una cuenta ? <a onClick={toggleForm} className="text-blue-500 hover:underline cursor-pointer">Registrate</a>
                            </p>
                        </form>
                    </div>

                    {/* Register Form */}
                    <div className={`transition-all duration-500 ease-in-out transform ${isRegister ? 'opacity-100 max-h-[2000px] translate-x-0' : 'opacity-0 max-h-0 overflow-hidden translate-x-4'}`}>
                        <h1 className="my-8 font-semibold text-xl">Crear cuenta</h1>
                        <p className="text-gray-500 text-sm">Completa tus datos para registrarte</p>

                        <form onSubmit={handleRegisterSubmit} noValidate className="space-y-4">
                            {/* Nombre */}
                            <div>
                                <div className="relative flex items-center">
                                    <FiUser className="left-3 absolute w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Nombre completo"
                                        value={registerForm.name}
                                        onChange={(e) => handleRegisterChange('name', e.target.value)}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 ${registerErrors.name ? "border-red-500 bg-red-50" : "border-gray-200"}`}
                                    />
                                </div>
                                {registerErrors.name && <small className="block mt-2 text-red-600 text-sm">{registerErrors.name}</small>}
                            </div>

                            {/* Email */}
                            <div>
                                <div className="relative flex items-center">
                                    <FiMail className="left-3 absolute w-4 h-4 text-gray-400" />
                                    <input
                                        type="email"
                                        placeholder="Correo electrónico"
                                        value={registerForm.email}
                                        onChange={(e) => handleRegisterChange('email', e.target.value)}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 ${registerErrors.email ? "border-red-500 bg-red-50" : "border-gray-200"}`}
                                    />
                                </div>
                                {registerErrors.email && <small className="block mt-2 text-red-600 text-sm">{registerErrors.email}</small>}
                            </div>

                            {/* Teléfono */}
                            <div>
                                <div className="relative flex items-center">
                                    <FiPhone className="left-3 absolute w-4 h-4 text-gray-400" />
                                    <input
                                        type="tel"
                                        placeholder="Teléfono"
                                        value={registerForm.phone}
                                        onChange={(e) => handleRegisterChange('phone', e.target.value)}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 ${registerErrors.phone ? "border-red-500 bg-red-50" : "border-gray-200"}`}
                                    />
                                </div>
                                {registerErrors.phone && <small className="block mt-2 text-red-600 text-sm">{registerErrors.phone}</small>}
                            </div>

                            {/* Dirección */}
                            <div>
                                <div className="relative flex items-center">
                                    <FiMapPin className="left-3 absolute w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Dirección"
                                        value={registerForm.address}
                                        onChange={(e) => handleRegisterChange('address', e.target.value)}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 ${registerErrors.address ? "border-red-500 bg-red-50" : "border-gray-200"}`}
                                    />
                                </div>
                                {registerErrors.address && <small className="block mt-2 text-red-600 text-sm">{registerErrors.address}</small>}
                            </div>

                            {/* Ciudad y Código Postal */}
                            <div className="gap-4 grid grid-cols-2">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Ciudad"
                                        value={registerForm.city}
                                        onChange={(e) => handleRegisterChange('city', e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 ${registerErrors.city ? "border-red-500 bg-red-50" : "border-gray-200"}`}
                                    />
                                    {registerErrors.city && <small className="block mt-2 text-red-600 text-sm">{registerErrors.city}</small>}
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Código Postal"
                                        value={registerForm.zipCode}
                                        onChange={(e) => handleRegisterChange('zipCode', e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 ${registerErrors.zipCode ? "border-red-500 bg-red-50" : "border-gray-200"}`}
                                    />
                                    {registerErrors.zipCode && <small className="block mt-2 text-red-600 text-sm">{registerErrors.zipCode}</small>}
                                </div>
                            </div>

                            {/* Contraseña */}
                            <div>
                                <div className="relative flex items-center">
                                    <input
                                        type={showRegisterPassword ? "text" : "password"}
                                        placeholder="Contraseña"
                                        value={registerForm.password}
                                        onChange={(e) => handleRegisterChange('password', e.target.value)}
                                        className={`flex-1 px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 ${registerErrors.password ? "border-red-500 bg-red-50" : "border-gray-200"}`}
                                        style={{ paddingRight: "2.5rem" }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                                        aria-label="mostrar contraseña"
                                        className="top-1/2 right-3 absolute text-gray-500 hover:text-gray-700 text-lg -translate-y-1/2 transform"
                                        tabIndex={-1}
                                    >
                                        {showRegisterPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                                    </button>
                                </div>
                                {registerErrors.password && <small className="block mt-2 text-red-600 text-sm">{registerErrors.password}</small>}
                            </div>

                            {/* Confirmar Contraseña */}
                            <div>
                                <div className="relative flex items-center">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirmar contraseña"
                                        value={registerForm.confirmPassword}
                                        onChange={(e) => handleRegisterChange('confirmPassword', e.target.value)}
                                        className={`flex-1 px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 ${registerErrors.confirmPassword ? "border-red-500 bg-red-50" : "border-gray-200"}`}
                                        style={{ paddingRight: "2.5rem" }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        aria-label="mostrar contraseña"
                                        className="top-1/2 right-3 absolute text-gray-500 hover:text-gray-700 text-lg -translate-y-1/2 transform"
                                        tabIndex={-1}
                                    >
                                        {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                                    </button>
                                </div>
                                {registerErrors.confirmPassword && <small className="block mt-2 text-red-600 text-sm">{registerErrors.confirmPassword}</small>}
                            </div>

                            <button className="bg-[#36367A] hover:bg-[#303055] mt-2 py-3 rounded-lg w-full font-semibold text-white cursor-pointer" type="submit">Registrarse</button>

                            <p className="mt-4 text-gray-500 text-sm text-center">
                                ¿Ya tienes una cuenta? <a onClick={toggleForm} className="text-blue-500 hover:underline cursor-pointer">Inicia sesión</a>
                            </p>
                        </form>
                    </div>
                </div>
            </section>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/50 animate-fade-in">
                    <div className="bg-white shadow-xl mx-4 p-6 rounded-lg w-full max-w-md animate-slide-up">
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-green-100 mb-4 p-4 rounded-full">
                                <FiCheck className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="mb-2 font-semibold text-gray-800 text-xl">¡Registro exitoso!</h3>
                            <p className="text-gray-600 text-sm">Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.</p>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}
