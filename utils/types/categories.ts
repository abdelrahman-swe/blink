import { Product, Image as CentralImage, ProductsResponse as StandardProductsResponse } from "./product";

export type { Product };
export type Image = CentralImage;

export interface Brand {
  name: string;
  slug: string;
  images: Image;
}



export interface Category {
  name: string;
  slug: string;
  has_children: boolean;
  full_path: string;
  full_path_slugs: string;
  images: Image;
  level: number;
  products_count: number;
  children?: Category[];
  parents?: Category[];
  top_brands?: Brand[];
}

export interface SearchResultSuggestion {
  data: string[];
}

export interface SearchByNameResponse {
  name: string;
  product_count: number;
  brands: Brand[];
  categories: {
    name: string;
    slug: string;
  }[];
}

export type CategoriesResponse = Category[];
export type ProductsResponse = Product[];
export type SearchSuggestionResponse = SearchResultSuggestion;
