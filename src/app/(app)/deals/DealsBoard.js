"use client";
import React, { useState } from 'react';
import { DndContext, closestCorners, MouseSensor, TouchSensor, useSensor, useSensors, DragOverlay, useDroppable } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus } from 'lucide-react';

const stages = ["prospect", "proposal", "negotiation", "won", "lost"];

function SortableDealCard({ deal }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: deal.id, data: { ...deal } });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="bg-white dark:bg-gray-800 p-4 rounded shadow border border-gray-200 dark:border-gray-700 mb-3 cursor-grab hover:shadow-md touch-none">
      <h4 className="font-medium text-gray-900 dark:text-white">{deal.title}</h4>
      <p className="text-sm text-gray-500 dark:text-gray-400">{deal.client?.name}</p>
      <div className="flex justify-between mt-2 text-xs font-semibold">
           <span className="text-indigo-600 dark:text-indigo-400">{new Intl.NumberFormat('en-US', { style: 'currency', currency: deal.currency || 'USD' }).format(deal.value)}</span>
           <span className={deal.probability > 50 ? "text-green-600 dark:text-green-400" : "text-yellow-600 dark:text-yellow-400"}>{deal.probability}%</span>
      </div>
    </div>
  );
}

function KanbanColumn({ id, deals }) {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div ref={setNodeRef} className="bg-gray-100 dark:bg-gray-900/50 p-4 rounded-lg min-w-[280px] w-full md:w-1/5 flex flex-col h-full border border-transparent hover:border-indigo-500/20 transition-colors">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4 capitalize">{id} <span className="text-gray-400 ml-1 text-sm font-normal">({deals.length})</span></h3>
            <SortableContext items={deals.map(d => d.id)} strategy={verticalListSortingStrategy}>
                <div className="flex-1 space-y-3 min-h-[50px]">
                    {deals.map(deal => <SortableDealCard key={deal.id} deal={deal} />)}
                </div>
            </SortableContext>
            <button className="mt-2 w-full py-2 flex items-center justify-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 rounded transition-colors">
                <Plus className="w-4 h-4 mr-1"/> Add Deal
            </button>
        </div>
    );
}

export default function DealsBoard({ initialDeals }) {
    const [deals, setDeals] = useState(initialDeals);
    const [activeDeal, setActiveDeal] = useState(null);

    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
    );

    async function handleDragEnd(event) {
        const { active, over } = event;
        setActiveDeal(null);
        
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        // Find the deal being dragged
        const currentDeal = deals.find(d => d.id === activeId);
        if (!currentDeal) return;

        let newStage = currentDeal.stage;

        // If dropped on a column (stage name)
        if (stages.includes(overId)) {
             newStage = overId;
        } else {
             // Dropped on another card
             const overDeal = deals.find(d => d.id === overId);
             if (overDeal) {
                 newStage = overDeal.stage;
             }
        }

        if (newStage !== currentDeal.stage) {
            // Optimistic update
            const updatedDeals = deals.map(d => d.id === activeId ? { ...d, stage: newStage } : d);
            setDeals(updatedDeals);

            // API Call
            try {
                await fetch(`/api/deals/${activeId}`, {
                    method: 'PATCH',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ stage: newStage })
                });
            } catch (error) {
                console.error("Failed to update deal stage", error);
                setDeals(deals); // Revert
            }
        }
    }
    
    function handleDragStart(event) {
        const deal = deals.find(d => d.id === event.active.id);
        setActiveDeal(deal);
    }

    const dealsByStage = stages.reduce((acc, stage) => {
        acc[stage] = deals.filter(d => d.stage === stage);
        return acc;
    }, {});


    return (
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
            <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-180px)]">
                 {stages.map(stage => (
                     <KanbanColumn key={stage} id={stage} deals={dealsByStage[stage] || []} />
                 ))}
                 <DragOverlay>
                    {activeDeal ? (
                        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-lg border border-indigo-500 opacity-90 rotate-2 w-[280px]">
                           <h4 className="font-medium text-gray-900 dark:text-white">{activeDeal.title}</h4>
                        </div>
                    ) : null }
                 </DragOverlay>
            </div>
        </DndContext>
    );
}
