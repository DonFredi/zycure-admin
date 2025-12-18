export interface Order {
  id: string;

  customer: {
    name: string;
    phone: string;
    location?: string;
    email?: string;
  };

  paymentMethod: "cash" | "mpesa";

  items: Array<{
    productId: string;
    title: string;
    price: number;
    quantity: number;
  }>;

  totalPrice: number;
  totalQuantity: number;

  status: "pending" | "confirmed" | "delivered" | "cancelled";

  createdAt?: any; // Firestore Timestamp
}
