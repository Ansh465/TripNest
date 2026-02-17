import Link from 'next/link'

export default function AuthCodeError() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-neutral-950 p-4 text-center">
            <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight text-red-500">Authentication Error</h1>
                <p className="text-neutral-600 dark:text-neutral-400 max-w-md">
                    There was an error signing you in. The link may have expired or is invalid.
                </p>
                <div className="mt-8">
                    <Link
                        href="/login"
                        className="rounded-md bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
                    >
                        Return to Login
                    </Link>
                </div>
            </div>
        </div>
    )
}
