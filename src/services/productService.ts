import type { Product } from "../types/Product";
import { API_BASE_URL, getAuthHeaders, handleApiResponse } from "./api";

const API_URL = `${API_BASE_URL}/products`;

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
    headers: getAuthHeaders(),
    body: productData
  });

  return handleApiResponse<Product>(response);
};

export const updateProduct = async (
  id: string,
  productData: FormData
) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: productData
  });

  return handleApiResponse<Product>(response);
};

export const deleteProduct = async (id: string) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });

  return handleApiResponse<{ message: string }>(response);
};

export const getProductsAdmin = async (): Promise<Product[]> => {
  const response = await fetch(`${API_URL}/admin/all`, {
    headers: getAuthHeaders()
  });
  return handleApiResponse<Product[]>(response);
};