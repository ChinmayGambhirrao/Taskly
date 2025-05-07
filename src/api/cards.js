import axios from "axios";
const API = "http://localhost:5000/api/cards";

// Get all cards for a list
export const getCards = (listId) => axios.get(API, { params: { listId } });

// Create a new card in a list
export const createCard = (title, description, listId) =>
  axios.post(API, { title, description, listId });

// Update a card
export const updateCard = (id, title, description, listId) =>
  axios.put(`${API}/${id}`, { title, description, listId });

// Delete a card
export const deleteCard = (id) => axios.delete(`${API}/${id}`);
