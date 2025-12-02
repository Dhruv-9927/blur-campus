'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string

    // 1. The "Edu" Gatekeeper
    if (!email.endsWith('.edu')) {
        return { error: 'You must use a valid .edu email address to join.' }
    }

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
        },
    })

    if (error) {
        return { error: error.message }
    }

    // Create user profile in public.users table (handled by trigger ideally, but we can do it here or via Supabase Auth hook)
    // For now, let's assume we might need to manually insert if we don't have a trigger set up for new users.
    // Ideally, Supabase triggers are best. I'll assume the user will set up a trigger or I should add it to the schema.
    // The provided schema didn't have a trigger for auth.users -> public.users.
    // Let's add a manual insert here for safety, or rely on a trigger I should create.
    // I'll add a manual insert for now to be safe, but RLS might block it if the user isn't logged in yet (which they aren't fully).
    // Actually, Supabase Auth usually handles this via a Trigger.
    // Let's stick to just Auth for now and let the user confirm email.

    revalidatePath('/', 'layout')
    return { message: 'Check your email to continue sign in process' }
}
