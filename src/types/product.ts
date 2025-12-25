export interface Product {
  id: string;
  title: string;
  price: number;
  categoryId: string;
  imageSrc?: { url: string; publicId: string };
  description?: string;
  benefit?: string;
  use?: string;
  createdAt: string | null;
  updatedAt: string | null;
}
