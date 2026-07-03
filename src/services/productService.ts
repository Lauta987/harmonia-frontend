const API_URL = "https://harmonia-backend-4uu0.onrender.com/api/products";

export const getProducts = async () => {
  const response = await fetch(API_URL);
  return response.json();
};

export const getFeaturedProducts = async () => {
  const response = await fetch(`${API_URL}/featured`);
  return response.json();
};

export const getProductById = async (id: string) => {
  const response = await fetch(`${API_URL}/${id}`);
  return response.json();
};

export const createProduct = async (productData: FormData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    body: productData
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al crear producto");
  }

  return data;
};

export const updateProduct = async (
  id: string,
  productData: FormData
) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    body: productData
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al actualizar producto");
  }

  return data;
};

export const deleteProduct = async (id: string) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al eliminar producto");
  }

  return data;
};

export const getProductsAdmin = async () => {
  const response = await fetch(`${API_URL}/admin/all`);
  return response.json();
}; 