'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function voteOnPoll(pollId: string, choice: 'A' | 'B') {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase
        .from('user_votes')
        .insert({
            user_id: user.id,
            poll_id: pollId,
            choice
        })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/')
    return { success: true }
}
