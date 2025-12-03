'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Not authenticated' }
    }

    const fullName = formData.get('fullName') as string
    const major = formData.get('major') as string
    const gradYear = parseInt(formData.get('gradYear') as string)
    const gender = formData.get('gender') as string
    const interestedIn = formData.get('interestedIn') as string

    // Prompts handling
    const prompts = []
    for (let i = 0; i < 3; i++) {
        const question = formData.get(`prompt_question_${i}`)
        const answer = formData.get(`prompt_answer_${i}`)
        if (question && answer) {
            prompts.push({ question, answer })
        }
    }

    // File upload handling would go here. 
    // For now, we'll assume the client uploads to storage and sends us the URL, 
    // OR we handle it here if we implement server-side upload.
    // Let's assume client-side upload for simplicity with large files, 
    // but for security/robustness, let's try to handle it here if possible or just update the URL if provided.

    const profilePicUrl = formData.get('profilePicUrl') as string

    const { error } = await supabase
        .from('users')
        .upsert({
            id: user.id,
            email: user.email!,
            full_name: fullName,
            major,
            grad_year: gradYear,
            gender,
            interested_in: interestedIn,
            prompts: prompts,
            profile_pic_url: profilePicUrl,
        })
        .select()

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/profile')
}
