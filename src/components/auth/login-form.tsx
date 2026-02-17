'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Loader2, Mail, Lock } from 'lucide-react'

export default function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [isSignUp, setIsSignUp] = useState(false)
    const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null)

    const router = useRouter()
    const supabase = createClient()

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${location.origin}/auth/callback`,
                    },
                })
                if (error) throw error
                setMessage({ text: 'Check your email for the confirmation link.', type: 'success' })
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                router.refresh()
                router.push('/')
            }
        } catch (error: any) {
            setMessage({ text: error.message, type: 'error' })
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        setLoading(true)
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${location.origin}/auth/callback`,
                },
            })
            if (error) throw error
        } catch (error: any) {
            setMessage({ text: error.message, type: 'error' })
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight">
                    {isSignUp ? 'Create an account' : 'Welcome back'}
                </h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {isSignUp
                        ? 'Enter your email below to create your account'
                        : 'Enter your email below to sign in to your account'}
                </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-2">
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                        <input
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="flex h-10 w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 pl-10 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="flex h-10 w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 pl-10 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                </div>

                {message && (
                    <div className={`p-3 rounded-md text-sm ${message.type === 'error' ? 'bg-red-50 text-red-500 dark:bg-red-900/20' : 'bg-green-50 text-green-500 dark:bg-green-900/20'}`}>
                        {message.text}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center rounded-md bg-neutral-900 dark:bg-white px-8 py-2 text-sm font-medium text-white dark:text-black transition-colors hover:bg-neutral-900/90 dark:hover:bg-white/90 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-neutral-400"
                >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSignUp ? 'Sign Up' : 'Sign In'}
                </button>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-neutral-200 dark:border-neutral-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-neutral-900 px-2 text-neutral-500">Or continue with</span>
                </div>
            </div>

            <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="flex w-full items-center justify-center rounded-md border border-neutral-200 dark:border-neutral-800 bg-transparent px-8 py-2 text-sm font-medium transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-neutral-400"
            >
                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                </svg>
                Google
            </button>

            <div className="text-center text-sm">
                <span className="text-neutral-500 dark:text-neutral-400">
                    {isSignUp ? "Already have an account? " : "Don't have an account? "}
                </span>
                <button
                    onClick={() => {
                        setIsSignUp(!isSignUp)
                        setMessage(null)
                    }}
                    className="underline hover:text-neutral-900 dark:hover:text-neutral-50"
                >
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
            </div>
        </div>
    )
}
