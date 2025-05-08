import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableList } from "./SortableList";
import { SortableCard } from "./SortableCard";
import { Plus, Trash2 } from "lucide-react";

const LIST_COLORS = [
  "bg-yellow-700",
  "bg-green-800",
  "bg-black",
  "bg-blue-800",
  "bg-purple-800",
];

export default function BoardDetails({ boardId }) {
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState({});
  const [newListTitle, setNewListTitle] = useState("");
  const [activeListId, setActiveListId] = useState(null);

  // Fetch lists and cards
  useEffect(() => {
    const fetchData = async () => {
      const listsRes = await axios.get("http://localhost:5000/api/lists", {
        params: { boardId },
      });
      setLists(listsRes.data);

      // Fetch cards for each list
      const cardsObj = {};
      for (const list of listsRes.data) {
        const cardsRes = await axios.get("http://localhost:5000/api/cards", {
          params: { listId: list._id },
        });
        cardsObj[list._id] = cardsRes.data;
      }
      setCards(cardsObj);
    };
    fetchData();
  }, [boardId]);

  // Add new list
  const handleAddList = async (e) => {
    e.preventDefault();
    if (!newListTitle) return;
    const res = await axios.post("http://localhost:5000/api/lists", {
      title: newListTitle,
      boardId,
    });
    setLists([...lists, res.data]);
    setNewListTitle("");
  };

  // Add new card
  const handleAddCard = async (listId, title) => {
    if (!title) return;
    const res = await axios.post("http://localhost:5000/api/cards", {
      title,
      listId,
    });
    setCards({
      ...cards,
      [listId]: [...(cards[listId] || []), res.data],
    });
  };
  // Drag and drop handlers
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    // Dragging lists (columns)
    if (active.data.current?.type === "list") {
      if (active.id !== over.id) {
        const oldIndex = lists.findIndex((l) => l._id === active.id);
        const newIndex = lists.findIndex((l) => l._id === over.id);
        setLists(arrayMove(lists, oldIndex, newIndex));
      }
    }

    // Dragging cards
    if (active.data.current?.type === "card") {
      const { listId: fromListId } = active.data.current;
      const { listId: toListId } = over.data.current;
      if (fromListId === toListId) {
        // Reorder within the same list
        const oldIndex = cards[fromListId].findIndex(
          (c) => c._id === active.id
        );
        const newIndex = cards[toListId].findIndex((c) => c._id === over.id);
        setCards({
          ...cards,
          [fromListId]: arrayMove(cards[fromListId], oldIndex, newIndex),
        });
      } else {
        // Move card to another list
        const card = cards[fromListId].find((c) => c._id === active.id);
        setCards({
          ...cards,
          [fromListId]: cards[fromListId].filter((c) => c._id !== active.id),
          [toListId]: [card, ...(cards[toListId] || [])],
        });
        // Update backend
        axios.put(`http://localhost:5000/api/cards/${active.id}`, {
          ...card,
          listId: toListId,
        });
      }
    }
  };

  return (
    <div
      className="min-h-screen p-6"
      style={{
        background: "linear-gradient(120deg, #a18cd1 0%, #fbc2eb 100%)",
      }}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={lists.map((l) => l._id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex gap-4 overflow-x-auto pb-4">
            {lists.map((list, idx) => (
              <SortableList
                key={list._id}
                id={list._id}
                title={list.title}
                colorClass={LIST_COLORS[idx % LIST_COLORS.length]}
                cards={cards[list._id] || []}
                onAddCard={handleAddCard}
              />
            ))}
            {/* Add List */}
            <form
              onSubmit={handleAddList}
              className="rounded-lg bg-white/80 shadow-lg w-80 p-4 flex-shrink-0 flex flex-col justify-center items-center"
            >
              <input
                type="text"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                placeholder="Add another list"
                className="border p-2 rounded w-full mb-2"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
              >
                Add List
              </button>
            </form>
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
