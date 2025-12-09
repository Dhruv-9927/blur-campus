import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ConfessionForm from '@/components/ConfessionForm'
import ConfessionCard from '@/components/ConfessionCard'

export default async function ConfessionsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    // Fetch confessions with likes
    const { data: confessions } = await supabase
        .from('confessions')
        .select(`
            *,
            confession_likes (
                liker_id,
                type
            )
        `)
        .order('created_at', { ascending: false })

    return (
        <div className="min-h-screen bg-[#fdfbf7] text-[#2d2420] font-sans p-4 pb-24">
            <header className="flex justify-between items-center mb-8 pt-4 px-2">
                <Link href="/" className="flex items-center text-[#8c817c] hover:text-[#2d2420] transition-colors">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                </Link>
                <h1 className="text-2xl font-serif font-bold italic text-[#1a1614]">Confessions</h1>
                <div className="w-8" /> {/* Spacer */}
            </header>

            <ConfessionForm />

            {/* Masonry Grid */}
            <div className="columns-1 sm:columns-2 gap-4 space-y-4">
                {confessions?.map((confession) => (
                    <ConfessionCard key={confession.id} confession={confession} userId={user.id} />
                ))}
            </div>
        </div>
    )
}
