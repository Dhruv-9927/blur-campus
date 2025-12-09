'use client'

import { useState } from 'react'
import { updateProfile } from './actions'
import { createClient } from '@/utils/supabase/client'
import { Loader2, Upload, Sparkles, ArrowUpRight, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import ThemeToggle from '@/components/ThemeToggle'
import SongSearch from '@/components/SongSearch'
import ProfileAnthem from '@/components/ProfileAnthem'
import FlagSelector from '@/components/FlagSelector'

const PROMPT_OPTIONS = [
    "My absolute favorite spot to cry during finals week is...",
    "Unpopular Opinion: The best dining hall on campus is...",
    "I will judge you if your GPA is higher than...",
    "Meet me at the library: [Quiet Floor] or [Social Floor]?",
    "If we get married, our alumni donation strategy will be...",
    "My toxic trait is thinking I can finish a semester's worth of lectures in one night."
]

export default function ProfileSetup() {
    const [loading, setLoading] = useState(false)
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)
    const [anthem, setAnthem] = useState<any>(null)
    const [greenFlags, setGreenFlags] = useState<string[]>([])
    const [redFlags, setRedFlags] = useState<string[]>([])

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true)
            if (!e.target.files || e.target.files.length === 0) {
                throw new Error('You must select an image to upload.')
            }

            const file = e.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            const supabase = createClient()
            const { error: uploadError } = await supabase.storage
                .from('profiles')
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            const { data } = supabase.storage.from('profiles').getPublicUrl(filePath)
            setAvatarUrl(data.publicUrl)
        } catch (error) {
            alert('Error uploading avatar!')
            console.error(error)
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#fdfbf7] text-[#2d2420] font-sans selection:bg-[#ff8fa3]/30 overflow-x-hidden">
            <ThemeToggle />

            <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
                <div className="grid grid-cols-1 gap-16 items-start">

                    {/* Left Column: Header & Photo */}
                    <motion.div
                        className="space-y-12"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        {/* Header */}
                        <div className="space-y-4">
                            <div className="inline-flex items-center space-x-2 bg-[#fff0f3] px-3 py-1 rounded-full border border-[#ffccd5]">
                                <Star className="w-3 h-3 text-[#ff8fa3] fill-current" />
                                <span className="text-[10px] font-bold tracking-widest uppercase text-[#ff8fa3]">Early Access</span>
                            </div>
                            <h1 className="text-6xl md:text-8xl font-serif leading-[0.9] tracking-tight">
                                This is <br />
                                <span className="font-script text-[#d4a373] italic pr-4">real.</span>
                            </h1>
                            <p className="text-[#8c817c] text-lg max-w-md leading-relaxed">
                                Ditch the perfectly curated facade. Build a profile that feels like a Sunday morning.
                            </p>
                        </div>

                        {/* Photo Card */}
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-[#f0ebe6] relative">
                            {/* Sticker */}
                            <div className="absolute -top-4 -right-4 bg-[#ffe5a0] text-[#8a6a1c] px-4 py-2 rounded-full transform rotate-12 shadow-sm border border-[#e6cca0] z-10">
                                <span className="text-xs font-bold tracking-widest uppercase">Main Character</span>
                            </div>

                            <div className="flex flex-col items-center">
                                {/* Arch Shape Photo */}
                                <div className="relative group cursor-pointer mb-8">
                                    <div className="w-48 h-64 rounded-t-[10rem] rounded-b-[2.5rem] bg-[#f5f0eb] border-2 border-dashed border-[#e6e1db] flex items-center justify-center overflow-hidden transition-all group-hover:border-[#d4a373] relative">
                                        {avatarUrl ? (
                                            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-center p-4">
                                                <Upload className="w-8 h-8 mx-auto text-[#b0a8a4] mb-3 group-hover:text-[#d4a373] transition-colors" />
                                                <span className="text-xs text-[#b0a8a4] uppercase tracking-widest font-medium">Upload Photo</span>
                                            </div>
                                        )}
                                        {uploading && (
                                            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                                <Loader2 className="w-8 h-8 animate-spin text-[#d4a373]" />
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        disabled={uploading}
                                    />
                                </div>

                                <div className="text-center mb-8">
                                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#b0a8a4] block mb-1">Step 01</span>
                                    <h3 className="font-serif text-2xl italic text-[#2d2420]">The Face</h3>
                                </div>

                                {/* Minimalist Inputs */}
                                <form id="profile-setup-form" action={async (formData) => {
                                    console.log("Submitting form...");
                                    const result = await updateProfile(formData);
                                    console.log("Result:", result);
                                    if (result?.error) {
                                        alert("Error: " + result.error);
                                    }
                                }} className="w-full space-y-6">
                                    <input type="hidden" name="profilePicUrl" value={avatarUrl || ''} />
                                    <input type="hidden" name="anthemData" value={anthem ? JSON.stringify(anthem) : ''} />
                                    <input type="hidden" name="greenFlags" value={JSON.stringify(greenFlags)} />
                                    <input type="hidden" name="redFlags" value={JSON.stringify(redFlags)} />

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-[#b0a8a4] uppercase tracking-widest pl-1">Your Name</label>
                                        <input
                                            name="fullName"
                                            type="text"
                                            placeholder="Jane Doe"
                                            required
                                            className="w-full bg-transparent border-b border-[#e6e1db] px-1 py-2 text-lg font-serif text-[#2d2420] placeholder:text-[#d6d1cd] focus:border-[#d4a373] outline-none transition-colors"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-[#b0a8a4] uppercase tracking-widest pl-1">Grad Year</label>
                                            <input
                                                name="gradYear"
                                                type="number"
                                                placeholder="'25"
                                                required
                                                className="w-full bg-transparent border-b border-[#e6e1db] px-1 py-2 text-lg font-serif text-[#2d2420] placeholder:text-[#d6d1cd] focus:border-[#d4a373] outline-none transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-[#b0a8a4] uppercase tracking-widest pl-1">Major</label>
                                            <input
                                                name="major"
                                                type="text"
                                                placeholder="Physics"
                                                required
                                                className="w-full bg-transparent border-b border-[#e6e1db] px-1 py-2 text-lg font-serif text-[#2d2420] placeholder:text-[#d6d1cd] focus:border-[#d4a373] outline-none transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-[#b0a8a4] uppercase tracking-widest pl-1">I Identify As</label>
                                            <select name="gender" required className="w-full bg-transparent border-b border-[#e6e1db] px-1 py-2 text-base text-[#2d2420] focus:border-[#d4a373] outline-none transition-colors appearance-none cursor-pointer">
                                                <option value="">Select...</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Non-binary">Non-binary</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-[#b0a8a4] uppercase tracking-widest pl-1">Looking For</label>
                                            <select name="interestedIn" required className="w-full bg-transparent border-b border-[#e6e1db] px-1 py-2 text-base text-[#2d2420] focus:border-[#d4a373] outline-none transition-colors appearance-none cursor-pointer">
                                                <option value="">Select...</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Everyone">Everyone</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Hidden submit button - using opacity-0 instead of hidden to ensure it works */}
                                    <button type="submit" id="submit-button" className="opacity-0 absolute pointer-events-none" />
                                </form>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Prompts & Anthem */}
                    <motion.div
                        className="pt-12 space-y-12"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    >
                        <div className="pl-4 border-l-2 border-[#e6e1db]">
                            <h2 className="font-serif text-3xl italic text-[#2d2420] mb-2">The Vibe Check</h2>
                            <p className="text-[#8c817c] text-sm max-w-md">
                                Select prompts that speak to your soul. Use our AI muse if you get stuck, but keep it authentic.
                            </p>
                        </div>

                        {/* Flags Section */}
                        <FlagSelector
                            greenFlags={greenFlags}
                            redFlags={redFlags}
                            setGreenFlags={setGreenFlags}
                            setRedFlags={setRedFlags}
                        />

                        {/* Spotify Anthem Section */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-xs uppercase tracking-widest text-[#b0a8a4]">Profile Anthem</h3>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#f0ebe6]">
                                {anthem ? (
                                    <div className="relative">
                                        <ProfileAnthem song={anthem} />
                                        <button
                                            type="button"
                                            onClick={() => setAnthem(null)}
                                            className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md border border-[#f0ebe6] text-xs font-bold text-red-500 hover:bg-red-50"
                                        >
                                            Change
                                        </button>
                                    </div>
                                ) : (
                                    <SongSearch onSelect={setAnthem} />
                                )}
                            </div>
                        </div>

                        <div className="space-y-8">
                            {[0, 1, 2].map((i) => (
                                <div key={i} className="relative group">
                                    {/* Tape Effect */}
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#fff0f3]/80 rotate-[-2deg] z-10 backdrop-blur-sm shadow-sm"></div>

                                    <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-[#f0ebe6] transition-transform duration-300 hover:-translate-y-1">
                                        <div className="mb-4">
                                            <label className="text-[10px] font-bold text-[#e6e1db] uppercase tracking-widest mb-1 block">Prompt 0{i + 1}</label>
                                            <select
                                                name={`prompt_question_${i}`}
                                                form="profile-setup-form"
                                                className="w-full bg-transparent border-b border-transparent hover:border-[#e6e1db] focus:border-[#d4a373] py-2 text-lg font-bold text-[#2d2420] focus:outline-none transition-colors cursor-pointer appearance-none"
                                            >
                                                <option value="">SELECT A PROMPT...</option>
                                                {PROMPT_OPTIONS.map((opt) => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="relative">
                                            <textarea
                                                name={`prompt_answer_${i}`}
                                                form="profile-setup-form"
                                                rows={2}
                                                placeholder="Your answer..."
                                                className="w-full bg-transparent text-2xl font-serif italic text-[#2d2420] placeholder:text-[#e6e1db] focus:outline-none resize-none"
                                            />
                                            <Sparkles className="absolute right-0 bottom-2 w-4 h-4 text-[#e6e1db]" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end pt-8">
                            <label
                                htmlFor="submit-button"
                                className="bg-[#1a1614] text-[#ede0d4] px-8 py-4 rounded-full font-serif text-lg italic hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl cursor-pointer flex items-center space-x-3 group"
                            >
                                <span>Launch Profile</span>
                                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </label>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div >
    )
}
