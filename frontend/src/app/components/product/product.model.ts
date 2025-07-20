export interface Product {
  id?: number;     // 👈 Add this
  sku: string;
  name: string;
  price: number;
  images?: string[];
}
