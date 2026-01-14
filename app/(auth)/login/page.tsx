"use client"
import React, { useState } from "react"
import Image from "next/image";
import { useRouter } from 'next/navigation'
import { FaRegEye, FaRegEyeSlash, FaUser } from "react-icons/fa";

export default function Page() {
    const router = useRouter()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [userError, setUserError] = useState("")
    const [passError, setPassError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [authError, setAuthError] = useState("")

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


            {/* Form*/}
            <section className="flex flex-[0.9] justify-center items-center p-12 sm:p-5 md:p-12">
                <div className="bg-white p-7 rounded-lg w-full max-w-md">
                    <Image
                        src="/logo.png"
                        alt="Vercel logomark"
                        width={100}
                        height={100} />
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

                        <button className="bg-blue-500 hover:bg-blue-600 mt-2 py-3 rounded-lg w-full font-semibold text-white cursor-pointer" type="submit">Iniciar sesión</button>

                        <button type="button" className="flex justify-center items-center gap-2 bg-gray-800 mt-3 py-3 rounded-lg w-full text-white cursor-pointer">
                            <span className="bg-white px-2 py-0.5 rounded text-black">G</span> Iniciar con google
                        </button>

                        <p className="mt-4 text-gray-500 text-sm text-center">Aun no tienes una cuenta ? <a className="text-blue-500">Registrate</a></p>
                    </form>
                </div>
            </section>
        </main>
    )
}
