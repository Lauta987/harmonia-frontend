export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("token");

  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const handleApiResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json();

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("token");
  }

  if (!response.ok) {
    throw new Error(data.message || "Error al comunicarse con el servidor");
  }

  return data as T;
}; 