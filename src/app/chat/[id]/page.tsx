import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ChatRoom from '@/components/ChatRoom'

export default async function ChatPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: match } = await supabase
        .from('matches')
        .select(`
      *,
      user_a:users!matches_user_a_fkey(*),
      user_b:users!matches_user_b_fkey(*)
    `)
        .eq('id', params.id)
        .single()

    if (!match) {
        redirect('/chat')
    }

    const partner = match.user_a.id === user.id ? match.user_b : match.user_a

    // Fetch initial messages
    const { data: messages } = await supabase
        .from('messages')
        .select('*')
        .eq('match_id', match.id)
        .order('created_at', { ascending: true })

    return (
        <ChatRoom
            matchId={match.id}
            currentUser={user}
            partner={partner}
            initialMessages={messages || []}
            initialMessageCount={match.message_count}
        />
    )
}
