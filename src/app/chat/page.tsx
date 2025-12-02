import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import BlurAvatar from '@/components/BlurAvatar'
import { ArrowLeft, Sparkles } from 'lucide-react'

export default async function ChatList() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch matches
    const { data: matches } = await supabase
        .from('matches')
        .select(`
      *,
      user_a:users!matches_user_a_fkey(*),
      user_b:users!matches_user_b_fkey(*)
    `)
        .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

    return (
        <div className="min-h-screen bg-[#fdfbf7] text-[#2d2420] font-sans p-4">
            <header className="mb-8 flex items-center space-x-4 pt-4">
                <Link href="/" className="p-2 rounded-full hover:bg-[#f0ebe6] transition-colors">
                    <ArrowLeft className="w-6 h-6 text-[#2d2420]" />
                </Link>
                <h1 className="text-3xl font-serif font-bold italic tracking-tight text-[#1a1614]">Messages</h1>
            </header>

            <div className="space-y-4 max-w-md mx-auto">
                {matches && matches.length > 0 ? (
                    matches.map((match) => {
                        const partner = match.user_a.id === user.id ? match.user_b : match.user_a
                        const isRevealed = match.message_count >= 40

                        return (
                            <Link key={match.id} href={`/chat/${match.id}`}>
                                <div className="flex items-center space-x-4 bg-white p-4 rounded-2xl border border-[#f0ebe6] shadow-sm hover:shadow-md hover:border-[#d4a373] transition-all duration-300 group">
                                    <div className="relative">
                                        <BlurAvatar url={partner.profile_pic_url} messageCount={match.message_count} size="md" />
                                        {isRevealed && (
                                            <div className="absolute -bottom-1 -right-1 bg-[#fff9c4] p-1 rounded-full border border-[#f0e6b0]">
                                                <Sparkles className="w-3 h-3 text-[#d4a373]" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-serif font-bold text-lg text-[#1a1614] truncate group-hover:text-[#d4a373] transition-colors">
                                            {partner.full_name || 'Unknown'}
                                        </h3>
                                        <p className="text-xs text-[#8c817c] font-medium uppercase tracking-wider">
                                            {match.message_count} messages
                                        </p>
                                    </div>

                                    {isRevealed ? (
                                        <span className="text-[10px] bg-[#fff0f3] text-[#ff8fa3] px-3 py-1 rounded-full font-bold tracking-widest uppercase border border-[#ffccd5]">
                                            Revealed
                                        </span>
                                    ) : (
                                        <div className="w-2 h-2 rounded-full bg-[#d4a373] opacity-50"></div>
                                    )}
                                </div>
                            </Link>
                        )
                    })
                ) : (
                    <div className="text-center py-20">
                        <div className="inline-block p-6 rounded-full bg-[#f5f0eb] mb-4 border border-[#e6e1db]">
                            <Sparkles className="w-8 h-8 text-[#d4a373]" />
                        </div>
                        <h3 className="font-serif text-xl text-[#2d2420] mb-2">No matches yet</h3>
                        <p className="text-[#8c817c] text-sm">Go back to the feed and connect with someone!</p>
                        <Link href="/" className="inline-block mt-6 text-xs font-bold tracking-widest uppercase text-[#d4a373] border-b border-[#d4a373] pb-1 hover:text-[#b08968] hover:border-[#b08968] transition-colors">
                            Back to Feed
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
