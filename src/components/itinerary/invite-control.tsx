'use client';

import { useState } from 'react';
import { Users, UserPlus, X, Check } from 'lucide-react';
import { inviteUser, removeCollaborator } from '@/app/actions/collaboration';

interface Collaborator {
    user_id: string;
    users: {
        email: string;
        full_name: string | null;
        avatar_url: string | null;
    } | null;
}

interface InviteControlProps {
    itineraryId: string;
    collaborators: Collaborator[];
    isOwner: boolean;
}

export function InviteControl({ itineraryId, collaborators, isOwner }: InviteControlProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const result = await inviteUser(email, itineraryId);

        if (result.error) {
            setMessage({ type: 'error', text: result.error });
        } else {
            setMessage({ type: 'success', text: 'User added successfully!' });
            setEmail('');
        }
        setLoading(false);
    };

    const handleRemove = async (userId: string) => {
        if (!confirm('Remove this collaborator?')) return;
        await removeCollaborator(userId, itineraryId);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
            >
                <Users className="h-3.5 w-3.5" />
                <span>Share</span>
                {collaborators.length > 0 && (
                    <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-100 text-[10px] dark:bg-neutral-800">
                        {collaborators.length}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-neutral-200 bg-white p-4 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="font-semibold text-neutral-900 dark:text-white">Collaborators</h3>
                            <button onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-neutral-600">
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Invite Form */}
                        <form onSubmit={handleInvite} className="mb-4">
                            <label className="mb-1.5 block text-xs font-medium text-neutral-500">Invite by email</label>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="friend@example.com"
                                    className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm dark:border-neutral-800 dark:bg-neutral-800"
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="rounded-lg bg-neutral-900 px-3 py-1.5 text-white hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-neutral-900"
                                >
                                    {loading ? '...' : <UserPlus className="h-4 w-4" />}
                                </button>
                            </div>
                            {message && (
                                <p className={`mt-2 text-xs ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                                    {message.text}
                                </p>
                            )}
                        </form>

                        {/* Collaborator List */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-medium uppercase tracking-wider text-neutral-500">Access List</h4>
                            {collaborators.length === 0 ? (
                                <p className="text-xs italic text-neutral-400">No collaborators yet.</p>
                            ) : (
                                collaborators.map((c) => (
                                    <div key={c.user_id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-[10px] font-bold text-purple-600 dark:bg-purple-900/30">
                                                {(c.users?.email || '?')[0].toUpperCase()}
                                            </div>
                                            <div className="truncate text-xs text-neutral-600 dark:text-neutral-300">
                                                {c.users?.email}
                                            </div>
                                        </div>
                                        {isOwner && (
                                            <button
                                                onClick={() => handleRemove(c.user_id)}
                                                className="text-neutral-400 hover:text-red-500"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
