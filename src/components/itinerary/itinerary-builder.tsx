'use client';

import { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { DayColumn, SortableItem, ItineraryItem } from './sortable-components';

import { JournalModal } from './journal-modal';

interface ItineraryBuilderProps {
    itineraryId: string;
    items: ItineraryItem[];
    onItemsChange: (items: ItineraryItem[]) => void;
    user: any;
}

export function ItineraryBuilder({ itineraryId, items, onItemsChange, user }: ItineraryBuilderProps) {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [journalItemId, setJournalItemId] = useState<string | null>(null);

    // Calculate days based on items or default to 3. 
    // Ideally this should be dynamic or part of itinerary metadata.
    // We'll calculate max day from items + 1 buffer
    const maxDay = Math.max(...items.map(i => i.day_number), 3);
    const [days, setDays] = useState(Array.from({ length: maxDay }, (_, i) => i + 1));

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Group items by day
    const itemsByDay = days.reduce((acc, day) => {
        acc[day] = items
            .filter((item) => item.day_number === day)
            .sort((a, b) => a.order_in_day - b.order_in_day);
        return acc;
    }, {} as Record<number, ItineraryItem[]>);

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as string);
    }

    function handleDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        // Find the containers (days)
        const activeItem = items.find(i => i.id === activeId);
        if (!activeItem) return;

        const overDayId = over.data.current?.type === 'day' ? over.data.current.day : null;
        const overItem = items.find(i => i.id === overId);

        // Dropping over a day container directly
        if (overDayId && activeItem.day_number !== overDayId) {
            const newItems = items.map(item => {
                if (item.id === activeId) {
                    return { ...item, day_number: overDayId, order_in_day: itemsByDay[overDayId].length };
                }
                return item;
            });
            onItemsChange(newItems);
            return;
        }

        // Dropping over another item in a different day
        if (overItem && activeItem.day_number !== overItem.day_number) {
            const newItems = items.map(item => {
                if (item.id === activeId) {
                    return { ...item, day_number: overItem.day_number };
                }
                return item;
            });
            onItemsChange(newItems);
        }
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        const activeItem = items.find(i => i.id === activeId);
        const overItem = items.find(i => i.id === overId);

        if (activeItem && overItem && activeId !== overId) {
            // Reordering within the same day
            if (activeItem.day_number === overItem.day_number) {
                const dayItems = itemsByDay[activeItem.day_number];
                const oldIndex = dayItems.findIndex(i => i.id === activeId);
                const newIndex = dayItems.findIndex(i => i.id === overId);

                // Visual update
                const newDayItems = arrayMove(dayItems, oldIndex, newIndex);

                // Re-assign order_in_day
                const updatedDayItems = newDayItems.map((item, index) => ({ ...item, order_in_day: index }));

                const otherItems = items.filter(i => i.day_number !== activeItem.day_number);
                onItemsChange([...otherItems, ...updatedDayItems]);

                // TODO: Persist to API
            }
        }
    }

    // Helper to add a new place (called from parent or search)
    // Exported via context or prop reference in real app

    return (
        <>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {days.map(day => (
                        <DayColumn key={day} day={day} items={itemsByDay[day]}>
                            <SortableContext
                                items={itemsByDay[day].map(i => i.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {itemsByDay[day].map(item => (
                                    <SortableItem
                                        key={item.id}
                                        id={item.id}
                                        item={item}
                                        day={day}
                                        onJournalOpen={() => setJournalItemId(item.id)}
                                    />
                                ))}
                            </SortableContext>
                        </DayColumn>
                    ))}

                    <div className="flex items-center justify-center p-4">
                        <button
                            onClick={() => setDays(prev => [...prev, prev.length + 1])}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-dashed border-neutral-300 rounded-lg hover:bg-neutral-50 text-neutral-600 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                        >
                            Add Day {days.length + 1}
                        </button>
                    </div>
                </div>

                <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } }) }}>
                    {activeId ? (
                        <SortableItem
                            id={activeId}
                            item={items.find(i => i.id === activeId)!}
                            day={items.find(i => i.id === activeId)!.day_number}
                        />
                    ) : null}
                </DragOverlay>
            </DndContext>

            {user && journalItemId && (
                <JournalModal
                    itemId={journalItemId}
                    isOpen={!!journalItemId}
                    onClose={() => setJournalItemId(null)}
                    user={user}
                />
            )}
        </>
    );
}
