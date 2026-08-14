export type Product = {
  id: string | number;
  name: string;
  description?: string;
  modelName?: string;
  manufacturerName?: string;
  categoryId?: number;
  categoryName?: string;
  sellerId?: number;
  sellerName?: string;
  price: number;
  availableQty?: number;
  images?: string[];
  brand?: string;
  discount?: number;
  stock?: number;
  rating?: {
    average: number;
    count: number;
  };
  reviews?: Array<{
    stars: number;
    message: string;
    by: string;
    date: string;
    images: string[];
  }>;
  architectureName?: string;
  specs?: Record<string, string | number | undefined>;
};

export type CategoryOption = {
  id: string | number;
  name: string;
};