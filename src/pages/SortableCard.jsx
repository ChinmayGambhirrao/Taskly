import React from "react";
import { useDraggable } from "@dnd-kit/core";

export function SortableCard({ id, card, listId }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      data: { type: "card", listId },
    });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        opacity: isDragging ? 0.5 : 1,
      }}
      className="bg-white text-black rounded p-2 shadow cursor-pointer"
    >
      {card.title}
    </div>
  );
}
