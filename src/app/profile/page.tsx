import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit2 } from 'lucide-react'

export default async function ProfilePage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

    if (!profile) {
        redirect('/profile/setup')
    }

    return (
        <div className="min-h-screen bg-[#fdfbf7] text-[#2d2420] font-sans p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center mb-12">
                    <Link href="/" className="flex items-center text-[#8c817c] hover:text-[#2d2420] transition-colors">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Home
                    </Link>
                    <Link href="/profile/setup" className="flex items-center bg-[#1a1614] text-[#ede0d4] px-6 py-3 rounded-full font-serif italic hover:scale-105 transition-transform">
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit Profile
                    </Link>
                </header>

                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-[#f0ebe6]">
                    <div className="flex flex-col md:flex-row gap-12 items-start">
                        {/* Avatar */}
                        <div className="w-full md:w-1/3 flex flex-col items-center">
                            <div className="w-64 h-80 rounded-t-[10rem] rounded-b-[2.5rem] overflow-hidden border-4 border-[#fff0f3] shadow-lg mb-6 relative group">
                                {profile.profile_pic_url ? (
                                    <img src={profile.profile_pic_url} alt={profile.full_name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-[#f5f0eb] flex items-center justify-center text-[#b0a8a4]">
                                        No Photo
                                    </div>
                                )}
                            </div>
                            <h2 className="font-serif text-3xl italic text-[#2d2420] text-center">{profile.full_name}</h2>
                            <p className="text-[#8c817c] uppercase tracking-widest text-xs font-bold mt-2">{profile.major} • '{profile.grad_year}</p>
                        </div>

                        {/* Details */}
                        <div className="w-full md:w-2/3 space-y-8">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-bold text-[#b0a8a4] uppercase tracking-widest block mb-1">Identity</label>
                                    <p className="text-xl font-serif text-[#2d2420]">{profile.gender || 'Not specified'}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-[#b0a8a4] uppercase tracking-widest block mb-1">Interested In</label>
                                    <p className="text-xl font-serif text-[#2d2420]">{profile.interested_in || 'Not specified'}</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="font-serif text-2xl italic text-[#2d2420] border-b border-[#f0ebe6] pb-2">The Vibe</h3>
                                {profile.prompts && Array.isArray(profile.prompts) ? (
                                    profile.prompts.map((prompt: any, idx: number) => (
                                        <div key={idx} className="bg-[#fdfbf7] p-6 rounded-xl border border-[#f0ebe6]">
                                            <p className="text-[10px] font-bold text-[#d4a373] uppercase tracking-widest mb-2">{prompt.question}</p>
                                            <p className="text-lg font-serif italic text-[#2d2420]">"{prompt.answer}"</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-[#8c817c] italic">No prompts answered yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
