'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { User } from 'lucide-react'

interface BlurAvatarProps {
    url?: string | null
    messageCount: number
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    className?: string
}

export default function BlurAvatar({ url, messageCount, size = 'md', className = '' }: BlurAvatarProps) {
    // Formula: max(0, 20 - (message_count * 0.5)) + 'px'
    // Starts at 20px blur. Every message reduces blur by 0.5px. At 40 messages, blur is 0.
    const blurAmount = useMemo(() => {
        const blur = Math.max(0, 20 - (messageCount * 0.5))
        return `${blur}px`
    }, [messageCount])

    const sizeClasses = {
        xs: 'w-8 h-8',
        sm: 'w-10 h-10',
        md: 'w-16 h-16',
        lg: 'w-24 h-24',
        xl: 'w-32 h-32',
    }

    return (
        <div className={`relative overflow-hidden rounded-full bg-neutral-800 ${sizeClasses[size]} ${className}`}>
            {url ? (
                <motion.img
                    src={url}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                    style={{ filter: `blur(${blurAmount})` }}
                    animate={{ filter: `blur(${blurAmount})` }}
                    transition={{ duration: 0.5 }}
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-500">
                    <User className="w-1/2 h-1/2" />
                </div>
            )}

            {/* Optional: Overlay to prevent inspecting source to see clear image? 
          Actually, CSS blur is client-side, so user can inspect. 
          To be truly secure, we'd need server-side blurring or pixelation, 
          but for MVP, CSS blur is fine as per prompt "CSS blur() filter".
      */}
        </div>
    )
}
