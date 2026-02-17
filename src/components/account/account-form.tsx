'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { type User } from '@supabase/supabase-js'
import { Loader2, Save, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AccountForm({ user, onUpdate }: { user: User | null, onUpdate?: () => void }) {
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [fullname, setFullname] = useState<string | null>(null)
    const [username, setUsername] = useState<string | null>(null)
    const [website, setWebsite] = useState<string | null>(null)
    const [avatar_url, setAvatarUrl] = useState<string | null>(null)
    const [bio, setBio] = useState<string | null>(null)
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
    const router = useRouter()

    const getProfile = useCallback(async () => {
        try {
            setLoading(true)
            if (!user) return

            const { data, error, status } = await supabase
                .from('users')
                .select(`full_name, avatar_url, bio`)
                .eq('id', user.id)
                .single()

            if (error && status !== 406) {
                throw error
            }

            if (data) {
                const profile = data as any;
                setFullname(profile.full_name)
                setAvatarUrl(profile.avatar_url)
                setBio(profile.bio)
            }
        } catch (error) {
            console.log('Error loading user data!')
        } finally {
            setLoading(false)
        }
    }, [user, supabase])

    useEffect(() => {
        getProfile()
    }, [user, getProfile])

    async function updateProfile({
        fullname,
        website,
        avatar_url,
        bio,
    }: {
        fullname: string | null
        website: string | null
        avatar_url: string | null
        bio: string | null
    }) {
        try {
            setLoading(true)
            setMessage(null)
            if (!user) throw new Error('No user')

            const { error } = await supabase.from('users').upsert({
                id: user.id,
                full_name: fullname,
                avatar_url,
                bio,
                updated_at: new Date().toISOString(),
            })
            if (error) throw error
            setMessage({ text: 'Profile updated!', type: 'success' })
            router.refresh()
            if (onUpdate) onUpdate()
        } catch (error) {
            console.error('Error updating profile:', error)
            setMessage({ text: 'Error updating the data!', type: 'error' })
        } finally {
            setLoading(false)
        }
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        window.location.href = '/login'
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium leading-none">
                    Email
                </label>
                <input
                    id="email"
                    type="text"
                    value={user?.email || ''}
                    disabled
                    className="flex h-10 w-full rounded-md border border-neutral-200 bg-neutral-100 px-3 py-2 text-sm text-neutral-500 cursor-not-allowed dark:border-neutral-800 dark:bg-neutral-900"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium leading-none">
                    Full Name
                </label>
                <input
                    id="fullName"
                    type="text"
                    value={fullname || ''}
                    onChange={(e) => setFullname(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="bio" className="text-sm font-medium leading-none">
                    Bio
                </label>
                <textarea
                    id="bio"
                    value={bio || ''}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    className="flex w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300 resize-none"
                    placeholder="Tell us about yourself..."
                />
            </div>

            {message && (
                <div className={`p-3 rounded-md text-sm ${message.type === 'error' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'} dark:bg-opacity-10`}>
                    {message.text}
                </div>
            )}

            <div className="flex gap-4">
                <button
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90 h-10 px-4 py-2 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90"
                    onClick={() => updateProfile({ fullname, website, avatar_url, bio })}
                    disabled={loading}
                >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>

                <button
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-neutral-200 bg-white hover:bg-neutral-100 h-10 px-4 py-2 text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:text-neutral-50"
                    onClick={handleSignOut}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                </button>
            </div>
        </div>
    )
}
