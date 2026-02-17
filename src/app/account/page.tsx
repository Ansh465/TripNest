import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import ProfilePageClient from '@/components/account/profile-page-client'

export default async function Account() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return <ProfilePageClient user={user} />
}
