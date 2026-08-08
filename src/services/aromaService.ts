import type { Aroma } from "../types/Aroma";
import { API_BASE_URL, getAuthHeaders, handleApiResponse } from "./api";

const API_URL = `${API_BASE_URL}/aromas`;

export const getAromas = async (): Promise<Aroma[]> => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Error al obtener los aromas");
  }

  return response.json();
};

export const getAromasAdmin = async (): Promise<Aroma[]> => {
  const response = await fetch(`${API_URL}/admin/all`, {
    headers: getAuthHeaders()
  });

  return handleApiResponse<Aroma[]>(response);
};

export const getAromaById = async (id: string): Promise<Aroma> => {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: getAuthHeaders()
  });

  return handleApiResponse<Aroma>(response);
};

export const createAroma = async (aromaData: {
  name: string;
  description: string;
  available: boolean;
}): Promise<Aroma> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify(aromaData)
  });

  return handleApiResponse<Aroma>(response);
};

export const updateAroma = async (
  id: string,
  aromaData: {
    name?: string;
    description?: string;
    available?: boolean;
  }
): Promise<Aroma> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify(aromaData)
  });

  return handleApiResponse<Aroma>(response);
};

export const deleteAroma = async (id: string): Promise<{ message: string }> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });

  return handleApiResponse<{ message: string }>(response);
}; 