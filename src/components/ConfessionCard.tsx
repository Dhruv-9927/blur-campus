'use client'

import { useState } from 'react'
import { Heart, Eye } from 'lucide-react'
import { likeConfession } from '@/app/confessions/actions'

interface ConfessionCardProps {
    confession: any
    userId: string
}

export default function ConfessionCard({ confession, userId }: ConfessionCardProps) {
    const hearts = confession.confession_likes.filter((l: any) => l.type === 'heart')
    const winks = confession.confession_likes.filter((l: any) => l.type === 'wink')

    const [optimisticHearts, setOptimisticHearts] = useState(hearts.length)
    const [optimisticWinks, setOptimisticWinks] = useState(winks.length)
    const [userHearted, setUserHearted] = useState(hearts.some((l: any) => l.liker_id === userId))
    const [userWinked, setUserWinked] = useState(winks.some((l: any) => l.liker_id === userId))

    // Random pastel color based on ID length or something deterministic
    const colors = ['bg-[#fff0f3]', 'bg-[#f0f9ff]', 'bg-[#f0fdf4]', 'bg-[#fffbeb]', 'bg-[#faf5ff]']
    const colorIndex = confession.id.charCodeAt(0) % colors.length
    const bgColor = colors[colorIndex]

    const handleLike = async (type: 'heart' | 'wink') => {
        if (type === 'heart') {
            const isAdding = !userHearted
            setUserHearted(isAdding)
            setOptimisticHearts((prev: number) => isAdding ? prev + 1 : prev - 1)
        } else {
            const isAdding = !userWinked
            setUserWinked(isAdding)
            setOptimisticWinks((prev: number) => isAdding ? prev + 1 : prev - 1)
        }

        await likeConfession(confession.id, type)
    }

    return (
        <div className={`break-inside-avoid rounded-2xl p-6 ${bgColor} border border-black/5 shadow-sm hover:shadow-md transition-shadow`}>
            <p className="font-serif text-lg leading-relaxed text-[#2d2420] mb-6">
                "{confession.content}"
            </p>

            <div className="flex items-center gap-4">
                <button
                    onClick={() => handleLike('heart')}
                    className={`flex items-center space-x-1 text-xs font-bold uppercase tracking-wider transition-colors ${userHearted ? 'text-red-500' : 'text-[#b0a8a4] hover:text-red-400'
                        }`}
                >
                    <Heart className={`w-4 h-4 ${userHearted ? 'fill-current' : ''}`} />
                    <span>{optimisticHearts}</span>
                </button>

                <button
                    onClick={() => handleLike('wink')}
                    className={`flex items-center space-x-1 text-xs font-bold uppercase tracking-wider transition-colors ${userWinked ? 'text-purple-500' : 'text-[#b0a8a4] hover:text-purple-400'
                        }`}
                >
                    <Eye className={`w-4 h-4 ${userWinked ? 'fill-current' : ''}`} />
                    <span>{optimisticWinks}</span>
                </button>
            </div>
        </div>
    )
}
