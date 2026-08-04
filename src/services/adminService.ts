import { API_BASE_URL, getAuthHeaders, handleApiResponse } from "./api";

const API_URL = `${API_BASE_URL}/admin`;

export const loginAdmin = async (
  username: string,
  password: string
) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username,
      password
    })
  });

  return handleApiResponse<{ token: string }>(response);
};

export const checkAdminSession = async (): Promise<boolean> => {
  const response = await fetch(`${API_URL}/check`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    localStorage.removeItem("token");
    return false;
  }

  return true;
}; 