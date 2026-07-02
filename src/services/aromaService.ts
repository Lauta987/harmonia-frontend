const API_URL = "http://localhost:4000/api/aromas";

export const getAromas = async () => {
  const response = await fetch(API_URL);
  return response.json();
};