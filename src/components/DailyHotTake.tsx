'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { voteOnPoll } from '@/app/actions'
import { Loader2, Flame, Snowflake } from 'lucide-react'

interface DailyHotTakeProps {
    poll: {
        id: string
        question: string
        option_a: string
        option_b: string
    } | null
    userVote: 'A' | 'B' | null
    voteCounts: {
        A: number
        B: number
    }
}

export default function DailyHotTake({ poll, userVote: initialUserVote, voteCounts: initialCounts }: DailyHotTakeProps) {
    const [userVote, setUserVote] = useState(initialUserVote)
    const [counts, setCounts] = useState(initialCounts)
    const [loading, setLoading] = useState<string | null>(null)

    if (!poll) return null

    const totalVotes = counts.A + counts.B
    const percentA = totalVotes === 0 ? 0 : Math.round((counts.A / totalVotes) * 100)
    const percentB = totalVotes === 0 ? 0 : Math.round((counts.B / totalVotes) * 100)

    const handleVote = async (choice: 'A' | 'B') => {
        if (userVote || loading) return

        setLoading(choice)

        // Optimistic update
        setUserVote(choice)
        setCounts(prev => ({ ...prev, [choice]: prev[choice] + 1 }))

        const result = await voteOnPoll(poll.id, choice)

        if (result?.error) {
            // Revert if error
            setUserVote(null)
            setCounts(initialCounts)
            alert('Failed to vote: ' + result.error)
        }

        setLoading(null)
    }

    return (
        <div className="relative z-20 mb-8">
            <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-[#f0ebe6] overflow-hidden relative">

                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xs font-bold tracking-widest uppercase text-[#b0a8a4]">Daily Hot Take</h2>
                    <div className="bg-[#fff0f3] text-[#ff8fa3] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                        {userVote ? 'Unlocked' : 'Vote to Unlock'}
                    </div>
                </div>

                <h3 className="font-serif text-2xl text-[#1a1614] mb-6 text-center leading-tight">
                    {poll.question}
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    {/* Option A */}
                    <motion.button
                        whileHover={{ scale: userVote ? 1 : 1.02 }}
                        whileTap={{ scale: userVote ? 1 : 0.98 }}
                        onClick={() => handleVote('A')}
                        disabled={!!userVote}
                        className={`relative h-32 rounded-2xl flex flex-col items-center justify-center p-4 transition-all overflow-hidden ${userVote === 'A'
                                ? 'bg-gradient-to-br from-orange-500 to-red-600 text-white ring-4 ring-orange-200'
                                : userVote === 'B'
                                    ? 'bg-[#f5f0eb] text-[#b0a8a4] opacity-50'
                                    : 'bg-gradient-to-br from-orange-100 to-red-100 text-orange-900 hover:shadow-lg'
                            }`}
                    >
                        {userVote ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center"
                            >
                                <span className="text-3xl font-bold">{percentA}%</span>
                                <p className="text-xs font-bold uppercase tracking-widest opacity-80 mt-1">Agreed</p>
                            </motion.div>
                        ) : (
                            <>
                                <Flame className={`w-8 h-8 mb-2 ${loading === 'A' ? 'animate-bounce' : ''}`} />
                                <span className="font-serif italic text-lg leading-none">{poll.option_a}</span>
                            </>
                        )}
                        {loading === 'A' && <Loader2 className="absolute top-2 right-2 w-4 h-4 animate-spin" />}
                    </motion.button>

                    {/* Option B */}
                    <motion.button
                        whileHover={{ scale: userVote ? 1 : 1.02 }}
                        whileTap={{ scale: userVote ? 1 : 0.98 }}
                        onClick={() => handleVote('B')}
                        disabled={!!userVote}
                        className={`relative h-32 rounded-2xl flex flex-col items-center justify-center p-4 transition-all overflow-hidden ${userVote === 'B'
                                ? 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white ring-4 ring-blue-200'
                                : userVote === 'A'
                                    ? 'bg-[#f5f0eb] text-[#b0a8a4] opacity-50'
                                    : 'bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-900 hover:shadow-lg'
                            }`}
                    >
                        {userVote ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center"
                            >
                                <span className="text-3xl font-bold">{percentB}%</span>
                                <p className="text-xs font-bold uppercase tracking-widest opacity-80 mt-1">Agreed</p>
                            </motion.div>
                        ) : (
                            <>
                                <Snowflake className={`w-8 h-8 mb-2 ${loading === 'B' ? 'animate-spin' : ''}`} />
                                <span className="font-serif italic text-lg leading-none">{poll.option_b}</span>
                            </>
                        )}
                        {loading === 'B' && <Loader2 className="absolute top-2 right-2 w-4 h-4 animate-spin" />}
                    </motion.button>
                </div>

                {/* Result Message */}
                <AnimatePresence>
                    {userVote && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-4 text-center"
                        >
                            <p className="text-xs font-bold text-[#b0a8a4] uppercase tracking-widest">
                                {userVote === (percentA > percentB ? 'A' : 'B') ? 'You are in the majority!' : 'A bold choice!'}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
