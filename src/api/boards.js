import axios from "axios";
const API = "http://localhost:5000/api/boards";

export const getBoards = () => axios.get(API);
export const createBoard = (title) => axios.post(API, { title });
export const updateBoard = (id, title) => axios.put(`${API}/${id}`, { title });
export const deleteBoard = (id) => axios.delete(`${API}/${id}`);
