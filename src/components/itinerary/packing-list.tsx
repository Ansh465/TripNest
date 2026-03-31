"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { CheckSquare, Plus, Trash2, Wand2, Luggage } from "lucide-react";

interface PackingItem {
    id: string;
    item_name: string;
    is_checked: boolean;
    category: string;
}

interface PackingListProps {
    itineraryId: string;
}

const DEFAULT_ITEMS = [
    { name: "Passport / ID", category: "Documents" },
    { name: "Tickets / Booking Confirmations", category: "Documents" },
    { name: "Cash / Credit Cards", category: "Documents" },
    { name: "Phone Charger", category: "Electronics" },
    { name: "Power Bank", category: "Electronics" },
    { name: "Headphones", category: "Electronics" },
    { name: "Toothbrush & Toothpaste", category: "Toiletries" },
    { name: "Shampoo / Body Wash", category: "Toiletries" },
    { name: "Deodorant", category: "Toiletries" },
    { name: "Sunscreen", category: "Toiletries" },
    { name: "Underwear", category: "Clothes" },
    { name: "Socks", category: "Clothes" },
    { name: "T-Shirts", category: "Clothes" },
    { name: "Pants / Shorts", category: "Clothes" },
    { name: "Jacket / Hoodie", category: "Clothes" },
    { name: "Swimwear", category: "Clothes" },
    { name: "Comfortable Shoes", category: "Clothes" },
    { name: "Personal Medication", category: "Health" },
    { name: "First Aid Kit", category: "Health" },
];

export function PackingList({ itineraryId }: PackingListProps) {
    // Using stable supabase from @/lib/supabase
    const [items, setItems] = useState<PackingItem[]>([]);
    const [newItemName, setNewItemName] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchItems = useCallback(async () => {
        const { data } = await supabase
            .from("packing_items")
            .select("*")
            .eq("itinerary_id", itineraryId)
            .order("category", { ascending: true })
            .order("item_name", { ascending: true });

        if (data) setItems(data as PackingItem[]);
    }, [itineraryId]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const handleAddItem = async () => {
        if (!newItemName) return;
        setLoading(true);

        const { error } = await supabase.from("packing_items").insert({
            itinerary_id: itineraryId,
            item_name: newItemName,
            category: "Custom",
        });

        if (!error) {
            setNewItemName("");
            fetchItems();
        }
        setLoading(false);
    };

    const handleToggle = async (id: string, currentChecked: boolean) => {
        // Optimistic update
        setItems(items.map(i => i.id === id ? { ...i, is_checked: !currentChecked } : i));

        const { error } = await supabase
            .from("packing_items")
            .update({ is_checked: !currentChecked })
            .eq("id", id);

        if (error) fetchItems(); // Revert on error
    };

    const handleDelete = async (id: string) => {
        const { error } = await supabase.from("packing_items").delete().eq("id", id);
        if (!error) fetchItems();
    };

    const handleGenerateList = async () => {
        setLoading(true);
        // Bulk insert default items
        const itemsToInsert = DEFAULT_ITEMS.map(item => ({
            itinerary_id: itineraryId,
            item_name: item.name,
            category: item.category,
            is_checked: false
        }));

        const { error } = await supabase.from("packing_items").insert(itemsToInsert as any);

        if (!error) {
            fetchItems();
        }
        setLoading(false);
    };

    // Group items by category
    const itemsByCategory = items.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, PackingItem[]>);

    const totalItems = items.length;
    const checkedItems = items.filter(i => i.is_checked).length;
    const progress = totalItems === 0 ? 0 : Math.round((checkedItems / totalItems) * 100);

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 h-full flex flex-col">
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Luggage className="w-5 h-5 text-purple-600" /> Smart Packing List
                    </h3>
                    <div className="text-sm font-medium text-neutral-500">
                        {checkedItems} / {totalItems} Packed
                    </div>
                </div>

                <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                    <div
                        className="bg-purple-600 h-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                        <div className="p-4 bg-purple-100 dark:bg-purple-900/20 rounded-full text-purple-600 dark:text-purple-400">
                            <Wand2 className="w-8 h-8" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-lg text-neutral-900 dark:text-white">Start Packing</h4>
                            <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-xs mx-auto mt-1">
                                Generate a smart checklist based on travel essentials.
                            </p>
                        </div>
                        <button
                            onClick={handleGenerateList}
                            disabled={loading}
                            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-medium transition-colors shadow-lg shadow-purple-500/20 disabled:opacity-50"
                        >
                            {loading ? "Generating..." : "Generate List"}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Add Item Input */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                                placeholder="Add custom item..."
                                className="flex-1 p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                            />
                            <button
                                onClick={handleAddItem}
                                disabled={!newItemName || loading}
                                className="p-2 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-lg hover:opacity-90 disabled:opacity-50"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>

                        {/* List Categories */}
                        {Object.entries(itemsByCategory).sort().map(([category, categoryItems]) => (
                            <div key={category}>
                                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 sticky top-0 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm py-1 z-10">
                                    {category}
                                </h4>
                                <div className="space-y-1">
                                    {categoryItems.map(item => (
                                        <div
                                            key={item.id}
                                            className={`flex items-center justify-between p-2 rounded-lg transition-colors group ${item.is_checked
                                                ? 'bg-neutral-50 dark:bg-neutral-800/30 text-neutral-400 decoration-neutral-400'
                                                : 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800'
                                                }`}
                                        >
                                            <div
                                                className="flex items-center gap-3 flex-1 cursor-pointer"
                                                onClick={() => handleToggle(item.id, item.is_checked)}
                                            >
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${item.is_checked
                                                    ? 'bg-purple-600 border-purple-600 text-white'
                                                    : 'border-neutral-300 dark:border-neutral-600 bg-transparent'
                                                    }`}>
                                                    {item.is_checked && <CheckSquare className="w-3.5 h-3.5" />}
                                                </div>
                                                <span className={`text-sm select-none ${item.is_checked ? 'line-through' : ''}`}>
                                                    {item.item_name}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="text-neutral-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
