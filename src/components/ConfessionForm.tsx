'use client'

import { useState, useRef } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { submitConfession } from '@/app/confessions/actions'

export default function ConfessionForm() {
    const [loading, setLoading] = useState(false)
    const formRef = useRef<HTMLFormElement>(null)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        const result = await submitConfession(formData)
        setLoading(false)

        if (result?.error) {
            alert(result.error)
        } else {
            formRef.current?.reset()
        }
    }

    return (
        <div className="mb-12">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-[#f0ebe6]">
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#b0a8a4] mb-4">Speak your truth (Anonymously)</h2>
                <form ref={formRef} action={handleSubmit} className="relative">
                    <textarea
                        name="content"
                        placeholder="I have a crush on the guy who sits in the back of Calc II..."
                        className="w-full bg-[#fdfbf7] rounded-xl p-4 pr-12 text-lg font-serif italic placeholder:text-[#e6e1db] focus:outline-none focus:ring-2 focus:ring-[#d4a373]/20 resize-none h-32"
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="absolute bottom-4 right-4 p-2 bg-[#1a1614] text-white rounded-full hover:scale-110 transition-transform shadow-lg disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                </form>
            </div>
        </div>
    )
}
