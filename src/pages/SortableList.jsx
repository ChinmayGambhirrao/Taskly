import React, { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DndContext } from "@dnd-kit/core";
import { SortableCard } from "./SortableCard";
import { Plus } from "lucide-react";

export function SortableList({ id, title, colorClass, cards, onAddCard }) {
  const [newCardTitle, setNewCardTitle] = useState("");
  const { setNodeRef } = useDroppable({ id });

  const handleAddCard = (e) => {
    e.preventDefault();
    onAddCard(id, newCardTitle);
    setNewCardTitle("");
  };

  return (
    <div
      ref={setNodeRef}
      className={`rounded-lg shadow-lg w-80 p-4 flex-shrink-0 ${colorClass} text-white`}
      data-type="list"
    >
      <h2 className="font-bold text-lg mb-2">{title}</h2>
      <SortableContext
        items={cards.map((c) => c._id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="min-h-[60px] space-y-2">
          {cards.map((card, i) => (
            <SortableCard
              key={card._id}
              id={card._id}
              card={card}
              listId={id}
            />
          ))}
        </div>
      </SortableContext>
      {/* Add Card */}
      <form onSubmit={handleAddCard} className="flex mt-2">
        <input
          type="text"
          value={newCardTitle}
          onChange={(e) => setNewCardTitle(e.target.value)}
          placeholder="Add a card"
          className="border p-1 rounded text-black flex-1"
        />
        <button
          type="submit"
          className="ml-2 bg-white text-blue-700 px-2 py-1 rounded flex items-center"
        >
          <Plus size={16} />
        </button>
      </form>
    </div>
  );
}
