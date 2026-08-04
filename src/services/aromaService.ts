import { API_BASE_URL } from "./api";

const API_URL = `${API_BASE_URL}/aromas`;

export const getAromas = async () => {
  const response = await fetch(API_URL);
  return response.json();
};