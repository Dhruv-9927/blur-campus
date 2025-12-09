'use client'

import { useState, useEffect } from 'react'
import { Search, Music, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Song {
    trackId: number
    trackName: string
    artistName: string
    artworkUrl100: string
    previewUrl: string
    trackViewUrl: string
    collectionName: string
}

interface SongSearchProps {
    onSelect: (song: Song) => void
}

export default function SongSearch({ onSelect }: SongSearchProps) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<Song[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length < 3) {
                setResults([])
                return
            }

            setLoading(true)
            try {
                const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=5`)
                const data = await res.json()
                setResults(data.results)
            } catch (err) {
                console.error(err)
            }
            setLoading(false)
        }, 500)

        return () => clearTimeout(timer)
    }, [query])

    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-[#b0a8a4]" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for your anthem..."
                    className="w-full bg-[#fdfbf7] border-2 border-[#e6e1db] pl-12 pr-4 py-3 rounded-xl font-serif text-[#2d2420] placeholder:text-[#b0a8a4] focus:border-[#d4a373] outline-none transition-colors"
                />
                {loading && <Loader2 className="absolute right-4 top-3.5 w-5 h-5 animate-spin text-[#d4a373]" />}
            </div>

            <div className="space-y-2">
                <AnimatePresence>
                    {results.map((song) => (
                        <motion.button
                            key={song.trackId}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            onClick={() => onSelect(song)}
                            className="w-full flex items-center p-3 bg-white rounded-xl border border-[#f0ebe6] hover:border-[#d4a373] hover:shadow-md transition-all text-left group"
                        >
                            <img
                                src={song.artworkUrl100}
                                alt={song.collectionName}
                                className="w-12 h-12 rounded-lg shadow-sm group-hover:scale-105 transition-transform"
                            />
                            <div className="ml-3 flex-1 min-w-0">
                                <h4 className="font-bold text-[#1a1614] truncate text-sm">{song.trackName}</h4>
                                <p className="text-xs text-[#8c817c] truncate">{song.artistName}</p>
                            </div>
                            <div className="bg-[#f0ebe6] p-2 rounded-full group-hover:bg-[#d4a373] group-hover:text-white transition-colors">
                                <Music className="w-4 h-4" />
                            </div>
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    )
}
