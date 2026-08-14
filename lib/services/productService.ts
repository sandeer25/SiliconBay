import { Product } from "@/types/product";
import { requestBackend } from "@/lib/backend";
import { CategoryOption } from "@/types/product";

export const productService = {
  async getFeaturedProducts(): Promise<Product[]> {
    const data = await requestBackend<{ products?: Product[] }>("/products/featured");
    return data.products || [];
  },

  async getBestSellerProducts(): Promise<Product[]> {
    const data = await requestBackend<{ products?: Product[] }>("/products/best-sellers");
    return data.products || [];
  },

  async getProductById(id: string | number): Promise<Product | null> {
    const data = await requestBackend<{ product?: Product }>(`/products/${id}`);
    return data.product || null;
  },

  async getMyProducts(): Promise<Product[]> {
    const data = await requestBackend<{ products?: Product[] }>("/products/mine");
    return data.products || [];
  },

  async getCategories(): Promise<CategoryOption[]> {
    const data = await requestBackend<{ categories?: CategoryOption[] }>("/categories");
    return data.categories || [];
  },

  async createProduct(formData: FormData): Promise<Product | null> {
    const data = await requestBackend<{ product?: Product }>("/products", {
      method: "POST",
      body: formData,
    });
    return data.product || null;
  },

  async updateProduct(id: string | number, formData: FormData): Promise<Product | null> {
    const data = await requestBackend<{ product?: Product }>(`/products/${id}`, {
      method: "PUT",
      body: formData,
    });
    return data.product || null;
  },


};
