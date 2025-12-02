'use client'

import { useState, useEffect } from 'react'
import { Moon, Sun, Coffee } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ThemeToggle() {
    const [theme, setTheme] = useState<'light' | 'dark'>('light')

    useEffect(() => {
        // Check system preference or local storage
        const storedTheme = localStorage.getItem('theme')
        if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setTheme('dark')
            document.documentElement.setAttribute('data-theme', 'dark')
        } else {
            setTheme('light')
            document.documentElement.setAttribute('data-theme', 'light')
        }
    }, [])

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
        document.documentElement.setAttribute('data-theme', newTheme)
        localStorage.setItem('theme', newTheme)
    }

    return (
        <button
            onClick={toggleTheme}
            className="fixed top-6 right-6 z-50 flex items-center space-x-2 px-4 py-2 rounded-full bg-card-bg border border-card-border shadow-sm hover:shadow-md transition-all duration-300 group"
        >
            <div className="relative w-5 h-5 text-foreground">
                <Coffee className="w-full h-full" />
            </div>
            <span className="text-xs font-medium tracking-widest uppercase text-muted group-hover:text-foreground transition-colors">
                Cozy Mode
            </span>
        </button>
    )
}
