'use client';

import { useState } from 'react';
import { Globe, Lock, Copy, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface PublicShareProps {
    itineraryId: string;
    isPublic: boolean;
}

export function PublicShare({ itineraryId, isPublic }: PublicShareProps) {
    const [publicState, setPublicState] = useState(isPublic);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    const togglePublic = async () => {
        setLoading(true);
        const newState = !publicState;

        try {
            const { error } = await supabase
                .from('itineraries')
                .update({ public: newState })
                .eq('id', itineraryId);

            if (error) throw error;

            setPublicState(newState);
            router.refresh();
        } catch (error) {
            console.error('Error updating public status:', error);
            alert('Failed to update status');
        } finally {
            setLoading(false);
        }
    };

    const copyLink = () => {
        const url = `${window.location.origin}/itineraries/${itineraryId}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white p-1 dark:border-neutral-800 dark:bg-neutral-900">
            <button
                onClick={togglePublic}
                disabled={loading}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${publicState
                        ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400'
                    }`}
            >
                {publicState ? <Globe className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                {loading ? 'Updating...' : (publicState ? 'Public' : 'Private')}
            </button>

            {publicState && (
                <button
                    onClick={copyLink}
                    className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                    title="Copy Public Link"
                >
                    {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
            )}
        </div>
    );
}
