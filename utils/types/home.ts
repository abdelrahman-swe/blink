import { Product, Image, ProductsResponse, Pagination, DealInfo, DealProduct, DealsResponse } from "./product";

export type { Product, DealInfo, DealProduct };
export type BannerImages = Image;

export interface Banner {
    id: number;
    section: string;
    slug: string;
    images: BannerImages;
    sort_order: number;
}

export interface BannerResponse {
    status: string;
    message: string;
    data: Banner[];
}

export type BestSellingProductsResponse = ProductsResponse;
export type NewArrivalProductsResponse = ProductsResponse;
export type DealsOfTheDayResponse = DealsResponse;



//////////////////////////////////////////////////////////


export interface Brand {
    id: number;
    name: string;
    slug: string;
    description: string;
    status: string;
    images: Image;
}

export interface BrandsResponse {
    status: string;
    message: string;
    data: Brand[];
}
