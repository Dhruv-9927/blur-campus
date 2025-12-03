'use client'

import { useState, useEffect } from 'react'
import { login, signup } from './actions'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2, ArrowRight, Mail, Lock, User } from 'lucide-react'

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const router = useRouter()

    // Check if JS is running
    // useEffect(() => {
    //     alert('Login Page JS Loaded')
    // }, [])

    async function handleManualSubmit(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        // alert('Manual submit clicked') // Debug

        // Manually gather form data
        const form = e.currentTarget.closest('form')
        if (!form) {
            // alert('Form not found')
            return
        }
        const formData = new FormData(form)

        setLoading(true)
        setError(null)
        setMessage(null)

        try {
            const action = isLogin ? login : signup
            const result = await action(formData)
            console.log('Login result:', result)
            // alert('Server response: ' + JSON.stringify(result)) 

            if (result?.error) {
                setError(result.error)
                alert('Error: ' + result.error)
            } else if ((result as any)?.message) {
                setMessage((result as any).message)
                // alert('Message: ' + (result as any).message)
            } else if ((result as any)?.success) {
                console.log('Login successful, redirecting...')
                alert('Login successful! Redirecting to profile...')

                window.location.replace('/profile')
            } else {
                // alert('Unknown result format: ' + JSON.stringify(result))
            }
        } catch (err) {
            console.error(err)
            alert('Exception: ' + err)
        }

        setLoading(false)
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfbf7] p-4 font-sans text-[#2d2420]">

            {/* Title Section */}
            <div className="text-center mb-8 space-y-2">
                <h1 className="text-5xl md:text-6xl font-serif tracking-tight text-[#1a1614]">
                    BlurCampus
                </h1>
                <p className="text-[#8c817c] font-serif italic text-lg">
                    Welcome back to the mystery.
                </p>
            </div>

            {/* Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-[#f0ebe6] relative"
            >
                {/* Verified Badge */}
                <div className="absolute -bottom-6 -left-6 bg-[#fff9c4] text-[#8a6a1c] px-6 py-2 rounded-full transform -rotate-3 shadow-md border border-[#f0e6b0] z-10">
                    <span className="text-[10px] font-bold tracking-widest uppercase">Verified Students Only</span>
                </div>

                {/* Toggle */}
                <div className="flex mb-10 bg-[#f5f0eb] rounded-full p-1.5">
                    <button
                        type="button"
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-2.5 text-xs font-bold tracking-widest uppercase rounded-full transition-all duration-300 ${isLogin ? 'bg-white text-[#2d2420] shadow-sm' : 'text-[#8c817c] hover:text-[#5c5450]'
                            }`}
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-2.5 text-xs font-bold tracking-widest uppercase rounded-full transition-all duration-300 ${!isLogin ? 'bg-white text-[#2d2420] shadow-sm' : 'text-[#8c817c] hover:text-[#5c5450]'
                            }`}
                    >
                        Sign Up
                    </button>
                </div>

                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    {!isLogin && (
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-[#b0a8a4] uppercase tracking-widest pl-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-0 top-3 w-5 h-5 text-[#d6d1cd]" />
                                <input
                                    name="fullName"
                                    type="text"
                                    required
                                    className="w-full bg-transparent border-b border-[#e6e1db] pl-8 py-2 text-lg font-serif text-[#2d2420] placeholder:text-[#e6e1db] focus:border-[#d4a373] outline-none transition-colors"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#b0a8a4] uppercase tracking-widest pl-1">
                            {isLogin ? 'Email' : 'College Email'}
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-0 top-3 w-5 h-5 text-[#d6d1cd]" />
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full bg-transparent border-b border-[#e6e1db] pl-8 py-2 text-lg font-serif text-[#2d2420] placeholder:text-[#e6e1db] focus:border-[#d4a373] outline-none transition-colors"
                                placeholder="you@university.edu"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#b0a8a4] uppercase tracking-widest pl-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-0 top-3 w-5 h-5 text-[#d6d1cd]" />
                            <input
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                className="w-full bg-transparent border-b border-[#e6e1db] pl-8 py-2 text-lg font-serif text-[#2d2420] placeholder:text-[#e6e1db] focus:border-[#d4a373] outline-none transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-xs font-medium">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="p-3 bg-green-50 border border-green-100 rounded-lg text-green-600 text-xs font-medium">
                            {message}
                        </div>
                    )}

                    <div className="pt-4">
                        <button
                            type="button"
                            onClick={handleManualSubmit}
                            disabled={loading}
                            className="w-full bg-[#1a1614] text-[#ede0d4] py-4 rounded-xl font-serif text-lg italic hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg flex items-center justify-center group"
                        >
                            {loading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    <span className="mr-2">{isLogin ? 'Enter' : 'Join the Mystery'}</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>

                    {isLogin && (
                        <div className="text-center">
                            <button type="button" className="text-xs font-bold text-[#b0a8a4] uppercase tracking-widest hover:text-[#d4a373] transition-colors">
                                Forgot Password?
                            </button>
                        </div>
                    )}
                </form>
            </motion.div>
        </div>
    )
}
