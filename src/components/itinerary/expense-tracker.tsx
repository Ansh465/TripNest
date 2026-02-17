"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import { DollarSign, Plus, Trash2, PieChart, TrendingUp } from "lucide-react";
import { ExpenseVisualizer } from "./expense-visualizer";

interface Expense {
    id: string;
    amount: number;
    category: string;
    description: string;
    date: string;
}

interface ExpenseTrackerProps {
    itineraryId: string;
    initialBudget: number;
    currency: string;
    onBudgetUpdate: (newBudget: number) => void;
}

export function ExpenseTracker({ itineraryId, initialBudget, currency, onBudgetUpdate }: ExpenseTrackerProps) {
    const supabase = createClient();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [budget, setBudget] = useState(initialBudget);
    const [isEditingBudget, setIsEditingBudget] = useState(false);
    const [newBudget, setNewBudget] = useState(initialBudget.toString());

    // New Expense State
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("Food");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchExpenses = useCallback(async () => {
        const { data } = await supabase
            .from("expenses")
            .select("*")
            .eq("itinerary_id", itineraryId)
            .order("date", { ascending: false });

        if (data) setExpenses(data as any);
    }, [itineraryId, supabase]);

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    const handleAddExpense = async () => {
        if (!amount) return;
        setLoading(true);

        const { error } = await supabase.from("expenses").insert({
            itinerary_id: itineraryId,
            amount: parseFloat(amount),
            category,
            description,
            date: new Date().toISOString(),
        });

        if (!error) {
            setAmount("");
            setDescription("");
            fetchExpenses();
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        const { error } = await supabase.from("expenses").delete().eq("id", id);
        if (!error) fetchExpenses();
    };

    const handleUpdateBudget = async () => {
        const budgetNum = parseFloat(newBudget);
        if (isNaN(budgetNum)) return;

        const { error } = await supabase
            .from("itineraries")
            .update({ budget: budgetNum })
            .eq("id", itineraryId);

        if (!error) {
            setBudget(budgetNum);
            onBudgetUpdate(budgetNum);
            setIsEditingBudget(false);
        }
    };

    const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const remaining = budget - totalSpent;
    const progress = Math.min((totalSpent / budget) * 100, 100);

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-600" /> Budget & Expenses
                    </h3>
                    <div className="text-sm font-medium text-neutral-500">
                        {currency}
                    </div>
                </div>

                {/* Budget Summary Card */}
                <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 h-1 bg-green-500 transition-all duration-500" style={{ width: `${progress}%` }} />

                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Budget</div>
                            {isEditingBudget ? (
                                <div className="flex items-center justify-center gap-2">
                                    <input
                                        type="number"
                                        value={newBudget}
                                        onChange={(e) => setNewBudget(e.target.value)}
                                        className="w-20 text-center border rounded p-1 text-sm bg-neutral-50 dark:bg-neutral-900"
                                    />
                                    <button onClick={handleUpdateBudget} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Save</button>
                                </div>
                            ) : (
                                <div
                                    onClick={() => setIsEditingBudget(true)}
                                    className="font-bold text-xl text-neutral-900 dark:text-white cursor-pointer hover:text-blue-500 transition-colors"
                                >
                                    {budget.toLocaleString()}
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Spent</div>
                            <div className="font-bold text-xl text-red-500">{totalSpent.toLocaleString()}</div>
                        </div>
                        <div>
                            <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Remaining</div>
                            <div className={`font-bold text-xl ${remaining < 0 ? 'text-red-500' : 'text-green-500'}`}>{remaining.toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                <ExpenseVisualizer budget={budget} expenses={expenses} currency={currency} />

                {/* Add Expense Form */}
                <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-3 bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800">
                    <div className="md:col-span-1">
                        <label className="block text-xs font-medium text-neutral-500 mb-1">Amount</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm"
                        />
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-xs font-medium text-neutral-500 mb-1">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm"
                        >
                            <option>Food</option>
                            <option>Transport</option>
                            <option>Accommodation</option>
                            <option>Activity</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div className="md:col-span-2 flex items-end gap-2">
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-neutral-500 mb-1">Description</label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Dinner, Taxi, etc."
                                className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm"
                            />
                        </div>
                        <button
                            onClick={handleAddExpense}
                            disabled={loading || !amount}
                            className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 p-2 rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Expense List */}
                <h4 className="font-semibold text-sm text-neutral-900 dark:text-white mb-3">Recent Expenses</h4>
                <div className="space-y-3">
                    {expenses.map((expense) => (
                        <div key={expense.id} className="flex items-center justify-between p-3 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-100 dark:border-neutral-700 group hover:shadow-sm transition-shadow">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                                    ${expense.category === 'Food' ? 'bg-orange-100 text-orange-600' :
                                        expense.category === 'Transport' ? 'bg-blue-100 text-blue-600' :
                                            expense.category === 'Accommodation' ? 'bg-purple-100 text-purple-600' :
                                                'bg-gray-100 text-gray-600'
                                    }`}>
                                    {expense.category[0]}
                                </div>
                                <div>
                                    <div className="font-medium text-sm text-neutral-900 dark:text-neutral-100">{expense.description || expense.category}</div>
                                    <div className="text-xs text-neutral-400">{new Date(expense.date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-neutral-900 dark:text-white">
                                    {expense.amount.toFixed(2)}
                                </span>
                                <button
                                    onClick={() => handleDelete(expense.id)}
                                    className="text-neutral-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {expenses.length === 0 && (
                        <div className="text-center py-8 text-neutral-400 text-sm">
                            No expenses recorded yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
