'use client'

import { Play, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'

interface Song {
    trackId: number
    trackName: string
    artistName: string
    artworkUrl100: string
    previewUrl: string
    trackViewUrl: string
    collectionName: string
}

export default function ProfileAnthem({ song }: { song: Song }) {
    if (!song) return null

    return (
        <div className="bg-[#191414] text-white p-4 rounded-2xl shadow-xl max-w-sm w-full relative overflow-hidden group">
            {/* Background Blur */}
            <div
                className="absolute inset-0 opacity-20 blur-xl scale-150 z-0"
                style={{ backgroundImage: `url(${song.artworkUrl100})`, backgroundSize: 'cover' }}
            />

            <div className="relative z-10 flex items-center gap-4">
                {/* Album Art */}
                <motion.div
                    className="relative w-16 h-16 flex-shrink-0"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 3, ease: "linear", repeat: Infinity }}
                >
                    <img
                        src={song.artworkUrl100}
                        alt={song.collectionName}
                        className="w-full h-full rounded-full border-2 border-[#1DB954] shadow-lg object-cover"
                    />
                    <div className="absolute inset-0 rounded-full border-[3px] border-black/20" />
                    <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-[#191414] rounded-full -translate-x-1/2 -translate-y-1/2 border border-[#333]" />
                </motion.div>

                <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-[#1DB954] uppercase tracking-widest mb-1">My Anthem</p>
                    <h3 className="font-bold text-sm truncate">{song.trackName}</h3>
                    <p className="text-xs text-gray-400 truncate">{song.artistName}</p>
                </div>

                <a
                    href={song.trackViewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#1DB954] rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg text-black"
                >
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                </a>
            </div>

            {/* Progress Bar (Fake) */}
            <div className="relative mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 h-full w-1/3 bg-[#1DB954] rounded-full" />
            </div>
        </div>
    )
}
