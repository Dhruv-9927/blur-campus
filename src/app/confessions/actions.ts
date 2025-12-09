'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitConfession(formData: FormData) {
    const supabase = await createClient()
    const content = formData.get('content') as string

    if (!content || content.length < 10) {
        return { error: 'Confession must be at least 10 characters long.' }
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const { error } = await supabase
        .from('confessions')
        .insert({
            author_id: user.id,
            content
        })

    if (error) return { error: error.message }

    revalidatePath('/confessions')
    return { success: true }
}

export async function likeConfession(confessionId: string, type: 'heart' | 'wink') {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    // Check if already liked/winked
    const { data: existing } = await supabase
        .from('confession_likes')
        .select('*')
        .eq('confession_id', confessionId)
        .eq('liker_id', user.id)
        .eq('type', type)
        .single()

    if (existing) {
        // Unlike
        await supabase
            .from('confession_likes')
            .delete()
            .eq('id', existing.id)
    } else {
        // Like
        await supabase
            .from('confession_likes')
            .insert({
                confession_id: confessionId,
                liker_id: user.id,
                type
            })
    }

    revalidatePath('/confessions')
    return { success: true }
}
