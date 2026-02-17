"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import { Camera, Save, X, Trash2 } from "lucide-react";
import { User } from "@supabase/supabase-js";

interface JournalEntry {
    id: string;
    content: string | null;
    photo_url: string | null;
    created_at: string;
    user_id: string;
}

interface JournalModalProps {
    itemId: string;
    isOpen: boolean;
    onClose: () => void;
    user: User;
}

export function JournalModal({ itemId, isOpen, onClose, user }: JournalModalProps) {
    const supabase = createClient();
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [newContent, setNewContent] = useState("");
    const [newPhotoUrl, setNewPhotoUrl] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchEntries = useCallback(async () => {
        const { data } = await supabase
            .from("journal_entries")
            .select("*")
            .eq("itinerary_item_id", itemId)
            .order("created_at", { ascending: false });

        if (data) setEntries(data as JournalEntry[]);
    }, [itemId, supabase]);

    useEffect(() => {
        if (isOpen) {
            fetchEntries();
        }
    }, [isOpen, fetchEntries]);

    const handleAddEntry = async () => {
        if (!newContent && !newPhotoUrl) return;
        setLoading(true);

        const { error } = await supabase.from("journal_entries").insert({
            itinerary_item_id: itemId,
            user_id: user.id,
            content: newContent,
            photo_url: newPhotoUrl,
        });

        if (!error) {
            setNewContent("");
            setNewPhotoUrl("");
            fetchEntries();
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        const { error } = await supabase.from("journal_entries").delete().eq("id", id);
        if (!error) fetchEntries();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden">
                <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Camera className="w-5 h-5" /> Travel Journal
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Add New Entry */}
                    <div className="bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-xl space-y-3">
                        <textarea
                            value={newContent}
                            onChange={(e) => setNewContent(e.target.value)}
                            placeholder="Write a memory..."
                            className="w-full bg-transparent resize-none outline-none text-sm placeholder:text-neutral-500"
                            rows={3}
                        />
                        <input
                            type="text"
                            value={newPhotoUrl}
                            onChange={(e) => setNewPhotoUrl(e.target.value)}
                            placeholder="Paste photo URL (e.g. from Unsplash)..."
                            className="w-full text-xs bg-white dark:bg-neutral-900 p-2 rounded border border-neutral-200 dark:border-neutral-700 outline-none"
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={handleAddEntry}
                                disabled={loading || (!newContent && !newPhotoUrl)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-full disabled:opacity-50"
                            >
                                <Save className="w-3.5 h-3.5" /> Save Memory
                            </button>
                        </div>
                    </div>

                    {/* List Entries */}
                    <div className="space-y-4">
                        {entries.map((entry) => (
                            <div key={entry.id} className="relative group bg-white dark:bg-neutral-800 p-4 rounded-xl border border-neutral-100 dark:border-neutral-700 shadow-sm">
                                {entry.user_id === user.id && (
                                    <button
                                        onClick={() => handleDelete(entry.id)}
                                        className="absolute top-2 right-2 p-1 text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}

                                {entry.photo_url && (
                                    <div className="mb-3 rounded-lg overflow-hidden">
                                        <img src={entry.photo_url} alt="Memory" className="w-full h-auto object-cover" />
                                    </div>
                                )}
                                {entry.content && (
                                    <p className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">{entry.content}</p>
                                )}
                                <div className="mt-2 text-xs text-neutral-400">
                                    {new Date(entry.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                            </div>
                        ))}
                        {entries.length === 0 && (
                            <div className="text-center py-8 text-neutral-400 text-sm">
                                No memories yet. Add one above!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
