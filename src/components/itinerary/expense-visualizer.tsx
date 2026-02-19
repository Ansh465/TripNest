'use client';

import { useMemo } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend
} from 'recharts';

interface ExpenseItem {
    id: string;
    amount: number;
    category: string;
    description: string;
}

interface ExpenseVisualizerProps {
    budget: number;
    expenses: ExpenseItem[];
    currency: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export function ExpenseVisualizer({ budget, expenses, currency }: ExpenseVisualizerProps) {
    const totalSpent = useMemo(() => expenses.reduce((acc, curr) => acc + curr.amount, 0), [expenses]);

    // Prevent division by zero
    const percentage = budget > 0 ? (totalSpent / budget) * 100 : 0;
    const progress = Math.min(percentage, 100);
    const isOverBudget = budget > 0 && totalSpent > budget;

    // Data for Pie Chart (Category Distribution)
    const categoryData = useMemo(() => {
        const categories: Record<string, number> = {};
        expenses.forEach(item => {
            const cat = item.category || 'Uncategorized';
            categories[cat] = (categories[cat] || 0) + item.amount;
        });

        return Object.entries(categories).map(([name, value]) => ({
            name,
            value
        })).sort((a, b) => b.value - a.value);
    }, [expenses]);

    if (expenses.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-neutral-500 bg-white rounded-xl border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800">
                <p>Add some expenses to see visual insights!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Budget Progress Card */}
            <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-xl border border-neutral-200 shadow-sm dark:bg-neutral-900 dark:border-neutral-800">
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wide">Total Spent</h3>
                        <div className="text-3xl font-bold text-neutral-900 dark:text-white">
                            {currency} {totalSpent.toLocaleString()}
                            <span className="text-sm text-neutral-400 font-normal ml-2">
                                / {currency} {budget.toLocaleString()}
                            </span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className={`text-sm font-bold ${isOverBudget ? 'text-red-500' : 'text-green-500'}`}>
                            {percentage.toFixed(1)}%
                        </div>
                    </div>
                </div>
                <div className="h-3 w-full bg-neutral-100 rounded-full overflow-hidden dark:bg-neutral-800">
                    <div
                        className={`h-full transition-all duration-500 ${isOverBudget ? 'bg-red-500' : 'bg-green-500'}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Category Distribution Chart */}
            <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm dark:bg-neutral-900 dark:border-neutral-800 h-[350px]">
                <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wide mb-4">
                    Spending by Category
                </h3>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 0, right: 0, bottom: 20, left: 0 }}>
                        <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: any) => `${currency} ${value.toLocaleString()}`}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Top Expenses List (Mini) */}
            <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm dark:bg-neutral-900 dark:border-neutral-800 h-[300px] overflow-y-auto">
                <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wide mb-4">
                    Top Expenses
                </h3>
                <div className="space-y-3">
                    {expenses
                        .sort((a, b) => b.amount - a.amount)
                        .slice(0, 5) // Top 5
                        .map((item) => (
                            <div key={item.id} className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: COLORS[categoryData.findIndex(c => c.name === item.category) % COLORS.length] || '#ccc' }}
                                    />
                                    <span className="text-neutral-700 dark:text-neutral-300 truncate max-w-[120px]">
                                        {item.description}
                                    </span>
                                </div>
                                <span className="font-semibold text-neutral-900 dark:text-white">
                                    {currency} {item.amount.toLocaleString()}
                                </span>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}
