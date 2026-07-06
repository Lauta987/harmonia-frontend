const API_URL = "https://harmonia-backend-4uu0.onrender.com/api/inquiries";

export interface InquiryStatsResponse {
  totalConsultas: number;
  topProducts: {
    _id: string;
    productName: string;
    total: number;
  }[];
  chartData: {
    date: string;
    total: number;
  }[];
}

export const registerInquiry = async (
  productId: string,
  productName: string
) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      productId,
      productName,
      source: "whatsapp"
    })
  });

  return response.json();
};

export const getInquiryStats = async (): Promise<InquiryStatsResponse> => {
  const response = await fetch(`${API_URL}/stats`);
  return response.json();
}; 