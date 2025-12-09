'use client'

import { GREEN_FLAGS, RED_FLAGS } from '@/lib/flags'
import { motion } from 'framer-motion'

interface FlagSelectorProps {
    greenFlags: string[]
    redFlags: string[]
    setGreenFlags: (flags: string[]) => void
    setRedFlags: (flags: string[]) => void
}

export default function FlagSelector({ greenFlags, redFlags, setGreenFlags, setRedFlags }: FlagSelectorProps) {

    const toggleGreen = (flag: string) => {
        if (greenFlags.includes(flag)) {
            setGreenFlags(greenFlags.filter(f => f !== flag))
        } else {
            if (greenFlags.length < 3) {
                setGreenFlags([...greenFlags, flag])
            }
        }
    }

    const toggleRed = (flag: string) => {
        if (redFlags.includes(flag)) {
            setRedFlags(redFlags.filter(f => f !== flag))
        } else {
            if (redFlags.length < 3) {
                setRedFlags([...redFlags, flag])
            }
        }
    }

    return (
        <div className="space-y-8">
            {/* Green Flags */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-xs uppercase tracking-widest text-[#b0a8a4]">My Green Flags</h3>
                    <span className="text-[10px] font-bold text-[#d4a373]">{greenFlags.length}/3</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {GREEN_FLAGS.map(flag => {
                        const isSelected = greenFlags.includes(flag)
                        return (
                            <motion.button
                                key={flag}
                                type="button"
                                onClick={() => toggleGreen(flag)}
                                whileTap={{ scale: 0.95 }}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${isSelected
                                        ? 'bg-green-100 border-green-300 text-green-800 shadow-[0_0_15px_rgba(74,222,128,0.4)]'
                                        : 'bg-white border-[#f0ebe6] text-[#8c817c] hover:border-[#d4a373]'
                                    }`}
                            >
                                {flag}
                            </motion.button>
                        )
                    })}
                </div>
            </div>

            {/* Red Flags */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-xs uppercase tracking-widest text-[#b0a8a4]">My Red Flags</h3>
                    <span className="text-[10px] font-bold text-[#ff8fa3]">{redFlags.length}/3</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {RED_FLAGS.map(flag => {
                        const isSelected = redFlags.includes(flag)
                        return (
                            <motion.button
                                key={flag}
                                type="button"
                                onClick={() => toggleRed(flag)}
                                whileTap={{ scale: 0.95 }}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${isSelected
                                        ? 'bg-red-100 border-red-300 text-red-800 shadow-[0_0_15px_rgba(248,113,113,0.4)]'
                                        : 'bg-white border-[#f0ebe6] text-[#8c817c] hover:border-[#ff8fa3]'
                                    }`}
                            >
                                {flag}
                            </motion.button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
