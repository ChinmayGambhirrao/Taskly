import React, { useState, useEffect } from "react";
import axios from "axios";

const BoardList = () => {
  const [boards, setBoards] = useState([]);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Fetch all boards on component mount
  useEffect(() => {
    const fetchBoards = async () => {
      const response = await axios.get("http://localhost:5000/api/boards");
      setBoards(response.data);
    };
    fetchBoards();
  }, []);

  // Create a new board
  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!newBoardTitle) return;

    const response = await axios.post("http://localhost:5000/api/boards", {
      title: newBoardTitle,
    });
    setBoards([...boards, response.data]);
    setNewBoardTitle("");
    setIsCreating(false);
  };

  // Delete a board
  const handleDeleteBoard = async (id) => {
    await axios.delete(`http://localhost:5000/api/boards/${id}`);
    setBoards(boards.filter((board) => board._id !== id));
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">My Boards</h1>

      {/* Create Board Button */}
      {!isCreating ? (
        <button
          onClick={() => setIsCreating(true)}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Create New Board
        </button>
      ) : (
        <form onSubmit={handleCreateBoard} className="mb-4">
          <input
            type="text"
            value={newBoardTitle}
            onChange={(e) => setNewBoardTitle(e.target.value)}
            placeholder="New Board Title"
            className="border p-2 mr-2 rounded"
            autoFocus
          />
          <button
            type="submit"
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Create
          </button>
          <button
            type="button"
            onClick={() => setIsCreating(false)}
            className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 ml-2"
          >
            Cancel
          </button>
        </form>
      )}
      {/* List of Boards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {boards.map((board) => (
          <div
            key={board._id}
            className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{board.title}</h2>
            <div className="flex justify-between items-center">
              <button
                onClick={() => handleDeleteBoard(board._id)}
                className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() =>
                  (className =
                    "bg-blue-500 text-white p-1 rounded hover:bg-blue-600")
                }
              >
                Open
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoardList;
