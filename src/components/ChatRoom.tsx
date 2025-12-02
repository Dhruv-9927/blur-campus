'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import BlurAvatar from '@/components/BlurAvatar'
import { Send, ArrowLeft, MoreVertical } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface Message {
    id: string
    sender_id: string
    content: string
    created_at: string
}

interface ChatRoomProps {
    matchId: string
    currentUser: any
    partner: any
    initialMessages: Message[]
    initialMessageCount: number
}

export default function ChatRoom({ matchId, currentUser, partner, initialMessages, initialMessageCount }: ChatRoomProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages)
    const [newMessage, setNewMessage] = useState('')
    const [messageCount, setMessageCount] = useState(initialMessageCount)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const supabase = createClient()

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })

        const channel = supabase
            .channel(`chat:${matchId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `match_id=eq.${matchId}`
            }, (payload) => {
                setMessages((prev) => [...prev, payload.new as Message])
                setMessageCount((prev) => prev + 1)
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [matchId, supabase])

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        const content = newMessage
        setNewMessage('')

        const { error } = await supabase.from('messages').insert({
            match_id: matchId,
            sender_id: currentUser.id,
            content: content
        })

        if (error) {
            console.error('Error sending message:', error)
            alert('Failed to send message')
        }
    }

    const isRevealed = messageCount >= 40

    return (
        <div className="flex flex-col h-screen bg-[#fdfbf7] text-[#2d2420] font-sans">
            {/* Header */}
            <header className="flex items-center p-4 border-b border-[#f0ebe6] bg-white/80 backdrop-blur-md sticky top-0 z-10 shadow-sm">
                <Link href="/chat" className="mr-3 p-2 rounded-full hover:bg-[#f0ebe6] transition-colors text-[#2d2420]">
                    <ArrowLeft className="w-6 h-6" />
                </Link>

                <div className="flex items-center flex-1">
                    <div className="relative mr-3">
                        <BlurAvatar url={partner.profile_pic_url} messageCount={messageCount} size="sm" />
                    </div>

                    <div className="flex-1">
                        <h2 className="font-serif font-bold text-lg text-[#1a1614] leading-tight">
                            {partner.full_name}
                        </h2>

                        <div className="flex items-center space-x-2 mt-1">
                            <div className="flex-1 h-1.5 bg-[#f0ebe6] rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-[#d4a373]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, (messageCount / 40) * 100)}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                            <span className="text-[10px] font-bold text-[#b0a8a4] uppercase tracking-wider whitespace-nowrap">
                                {isRevealed ? 'REVEALED' : `${40 - messageCount} LEFT`}
                            </span>
                        </div>
                    </div>
                </div>

                <button className="p-2 text-[#b0a8a4] hover:text-[#8c817c]">
                    <MoreVertical className="w-5 h-5" />
                </button>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#fdfbf7]">
                {messages.map((msg, idx) => {
                    const isMe = msg.sender_id === currentUser.id
                    const showAvatar = !isMe && (idx === 0 || messages[idx - 1].sender_id !== msg.sender_id)

                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start items-end'}`}>
                            {!isMe && (
                                <div className={`w-8 h-8 mr-2 flex-shrink-0 ${showAvatar ? 'opacity-100' : 'opacity-0'}`}>
                                    <BlurAvatar url={partner.profile_pic_url} messageCount={messageCount} size="xs" />
                                </div>
                            )}

                            <div className={`max-w-[75%] px-5 py-3 shadow-sm ${isMe
                                ? 'bg-[#2d2420] text-[#ede0d4] rounded-2xl rounded-tr-sm'
                                : 'bg-white text-[#2d2420] border border-[#e6e1db] rounded-2xl rounded-tl-sm'
                                }`}>
                                <p className="text-base leading-relaxed">{msg.content}</p>
                            </div>
                        </div>
                    )
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="p-4 bg-white border-t border-[#f0ebe6]">
                <div className="flex items-center gap-3 max-w-4xl mx-auto">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-[#fdfbf7] border border-[#e6e1db] rounded-full px-6 py-4 text-[#2d2420] placeholder:text-[#b0a8a4] focus:border-[#d4a373] focus:outline-none transition-colors shadow-inner"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="p-4 bg-[#1a1614] rounded-full text-[#ede0d4] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all shadow-md"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    )
}
