import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import BlurAvatar from '@/components/BlurAvatar'
import DailyHotTake from '@/components/DailyHotTake'
import { ArrowRight, X, MessageCircle, MessageSquareQuote } from 'lucide-react'

export default async function Home() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch current user profile to check if setup is complete
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || !profile.full_name || !profile.major) {
    redirect('/profile/setup')
  }

  // Fetch potential matches
  const { data: users } = await supabase
    .from('users')
    .select('*')
    .neq('id', user.id)
    .limit(10)

  // Fetch Daily Poll
  const { data: poll } = await supabase
    .from('daily_polls')
    .select('*')
    .eq('date', new Date().toISOString().split('T')[0])
    .single()

  let userVote = null
  let voteCounts = { A: 0, B: 0 }

  if (poll) {
    // Check if user voted
    const { data: vote } = await supabase
      .from('user_votes')
      .select('choice')
      .eq('poll_id', poll.id)
      .eq('user_id', user.id)
      .single()

    if (vote) userVote = vote.choice

    // Get vote counts
    const { count: countA } = await supabase
      .from('user_votes')
      .select('*', { count: 'exact', head: true })
      .eq('poll_id', poll.id)
      .eq('choice', 'A')

    const { count: countB } = await supabase
      .from('user_votes')
      .select('*', { count: 'exact', head: true })
      .eq('poll_id', poll.id)
      .eq('choice', 'B')

    voteCounts = { A: countA || 0, B: countB || 0 }
  }

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#2d2420] font-sans p-4 pb-24">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 pt-4 px-2">
        <h1 className="text-3xl font-serif font-bold tracking-tight text-[#1a1614]">
          BlurCampus
        </h1>
        <div className="flex items-center space-x-4">
          <Link href="/confessions" className="p-2 rounded-full hover:bg-[#f0ebe6] transition-colors" title="Confessions">
            <MessageSquareQuote className="w-6 h-6 text-[#2d2420]" />
          </Link>
          <Link href="/chat" className="p-2 rounded-full hover:bg-[#f0ebe6] transition-colors relative">
            <MessageCircle className="w-6 h-6 text-[#2d2420]" />
            {/* Notification dot could go here */}
          </Link>
          <Link href="/profile" className="w-8 h-8 rounded-full bg-[#e6e1db] overflow-hidden border border-[#d6d1cd]">
            {/* Small avatar preview */}
            {profile.profile_pic_url ? (
              <img src={profile.profile_pic_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#d4a373]" />
            )}
          </Link>
          <form action={async () => {
            'use server'
            const supabase = await createClient()
            await supabase.auth.signOut()
            redirect('/login')
          }}>
            <button className="text-xs font-bold uppercase tracking-widest text-[#b0a8a4] hover:text-[#d4a373]">
              Logout
            </button>
          </form>
        </div>
      </header>

      <div className="max-w-md mx-auto relative">

        {/* Daily Hot Take */}
        <DailyHotTake poll={poll} userVote={userVote} voteCounts={voteCounts} />

        {/* Feed Container */}
        <div className={`space-y-8 transition-all duration-500 ${!userVote && poll ? 'blur-lg pointer-events-none opacity-50 select-none' : ''}`}>
          {users && users.length > 0 ? (
            users.map((potentialMatch) => (
              <div key={potentialMatch.id} className="bg-white rounded-[2rem] p-6 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-[#f0ebe6] relative overflow-hidden group">

                {/* "Main Character" Sticker for some flair */}
                <div className="absolute -top-3 -right-3 bg-[#ffe5a0] text-[#8a6a1c] px-4 py-2 rounded-full transform rotate-12 shadow-sm border border-[#e6cca0] z-10">
                  <span className="text-[10px] font-bold tracking-widest uppercase">Student</span>
                </div>

                <div className="flex flex-col items-center mb-6">
                  <div className="mb-4 relative">
                    <div className="absolute inset-0 bg-[#d4a373]/20 rounded-full blur-xl transform scale-110"></div>
                    <BlurAvatar url={potentialMatch.profile_pic_url} messageCount={0} size="lg" />
                  </div>

                  <div className="text-center">
                    <h2 className="text-2xl font-serif italic text-[#1a1614] mb-1">
                      {potentialMatch.major || 'Undecided'} Major
                    </h2>
                    <p className="text-xs font-bold tracking-widest text-[#b0a8a4] uppercase">
                      Class of {potentialMatch.grad_year || '????'}
                    </p>
                  </div>
                </div>

                <div className="space-y-6 mb-8">
                  {potentialMatch.prompts && Array.isArray(potentialMatch.prompts) && potentialMatch.prompts.map((prompt: any, idx: number) => (
                    <div key={idx} className="relative">
                      {/* Tape Effect */}
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-[#fff0f3]/80 rotate-[-1deg] z-10 backdrop-blur-sm"></div>

                      <div className="bg-[#fdfbf7] p-4 rounded-xl border border-[#f0ebe6] text-center">
                        <p className="text-[10px] font-bold text-[#d4a373] uppercase tracking-widest mb-2">{prompt.question}</p>
                        <p className="text-lg font-serif italic text-[#2d2420]">"{prompt.answer}"</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <button className="p-4 rounded-full border-2 border-[#f0ebe6] text-[#b0a8a4] hover:border-[#e6e1db] hover:text-[#8c817c] transition-all hover:scale-105 active:scale-95">
                    <X className="w-6 h-6" />
                  </button>

                  <form action={async () => {
                    'use server'
                    const supabase = await createClient()
                    await supabase.from('matches').insert({
                      user_a: user.id,
                      user_b: potentialMatch.id,
                      status: 'active'
                    })
                    redirect(`/chat`)
                  }} className="flex-1">
                    <button type="submit" className="w-full bg-[#1a1614] text-[#ede0d4] py-4 rounded-full font-serif text-lg italic hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg flex items-center justify-center group">
                      <span className="mr-2">Connect</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20">
              <div className="inline-block p-6 rounded-full bg-[#fff0f3] mb-4">
                <MessageCircle className="w-8 h-8 text-[#ff8fa3]" />
              </div>
              <h3 className="font-serif text-2xl text-[#2d2420] mb-2">It's quiet... too quiet.</h3>
              <p className="text-[#8c817c]">No one else is here yet. Be the first to invite a friend!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
