import axios from "axios";
const API = 'http://localhost:5000/api/lists';

// Get all lists for a board
export const getLists = (boardId) => axios.get(API, {params: {boardId}});

// Create a new list in a board
export const createList = (title, boardId) => axios.post(API, {title, boardId});

// Update a list
export const updateList = (id, title) => axios.put(`${API}/${id}`, {title});

// Delete a list
export const deleteList = (id) => axios.delete(`${API}/${id}`);