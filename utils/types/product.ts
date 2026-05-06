export interface Image {
  id: number;
  thumb: string;
  small: string;
  medium: string;
  large: string;
  original: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string | null;
  price: string;
  sale_price: string | null;
  deal_price: string | null;
  discount_percentage: number | null;
  stock: number,
  in_stock: boolean;
  status: string;
  images?: Image;
  image?: Image;
  avg_rating?: string | number | null;
  reviews_count?: string;
  brand?: {
    name: string;
  };
  category?: {
    name: string;
  };
  is_favorite: boolean;
}

/////////////////// DEALS INFO ////////////////////

export interface DealInfo {
  status: string;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface DealProduct extends Product {
  deal_info: DealInfo;
}

export interface Pagination {
  type: string;
  next_cursor: string | null;
  prev_cursor: string | null;
  has_more: boolean;
  limit: number;
  product_count: number;
  total_pages: number;
}

export interface ProductsResponse {
  status: string;
  message: string;
  data: {
    items: Product[];
    pagination?: Pagination;
  };
}

export interface DealsResponse {
  status: string;
  message: string;
  data: {
    items: DealProduct[];
    pagination?: Pagination;
  };
}


/////////////////// PRODUCT REVIEWS ////////////////////



export interface Review {
  id: number;
  user_id?: number;
  user_name: string;
  avatar: Image | null;
  rating: number;
  body: string;
  created_at: string;
  helpful_count: number;
  is_helpful: boolean;
  is_me: boolean;
}

export interface RatingBreakdown {
  rating: number;
  count: number;
  percentage: number;
}

export interface RatingSummary {
  avg_rating: number;
  total_reviews: number;
  breakdown: RatingBreakdown[];
}

export interface ProductReviewsResponse {
  status: string;
  message: string;
  data: {
    items: Review[];
    pagination: {
      type: string;
      next_cursor: string | null;
      prev_cursor: string | null;
      has_more: boolean;
      limit: number;
    };
    rating_summary: RatingSummary;
    can_review: boolean;
  };
}

export interface AddReviewResponse {
  status: string;
  message: string;
  data: {
    review: {
      id: number;
      rating: number;
      body: string;
      status: string;
      created_at: string;
    }
  }
}

export interface EditReviewResponse {
  status: string;
  message: string;
  data: {
    edit: {
      id: number;
      rating: number;
      body: string;
      status: string;
      created_at: string;
    }
  }
}

export interface DeleteReviewResponse {
  status: string;
  message: string;
  data: null;
}

export interface ToggleHelpfulReviewResponse {
  status: string;
  message: string;
  data: {
    status: string;
    helpful_count: number;
    is_helpful: boolean;
  };
}



// --- ProductDetails (matches `data` object in your response) ---

export interface ProductImages {
  original: string;
  images: Image;
}

export interface ProductBrand {
  name: string;
  slug?: string;
}

export interface ProductCategory {
  name: string;
  slug?: string;
  full_path: string;
  full_path_slugs: string;
}

export interface ProductSpecifications {
  id: number;
  name: string;
  value: string;
  type: string;
  code: string;
}

/////////////////// PRODUCT SEO ////////////////////

export interface ProductSeoMeta {
  title: string;
  description: string;
  robots: string;
  canonical: string;
}

export interface ProductSeoOg {
  title: string;
  description: string;
  image: string;
  type: string;
  url: string;
  site_name: string;
  locale: string;
}

export interface ProductSeoAlternate {
  lang: string;
  href: string;
}

export interface ProductSeo {
  meta: ProductSeoMeta;
  og: ProductSeoOg;
  alternates: ProductSeoAlternate[];
  content_blocks: unknown[];
  jsonLd: Record<string, unknown>[];
}

/////////////////// PRODUCT DETAILS ////////////////////

export interface ProductDetails {
  id?: number;
  product_id?: number;
  deal_id?: number | null;
  is_on_deal?: boolean;
  max_quantity_per_order?: number | string | null;
  name: string;
  slug: string;
  sku: string | null;
  price: string;
  sale_price: string | null;
  deal_price: string | null;
  discount_percentage: number | null;
  stock?: number;
  quantity?: number;
  category?: ProductCategory;
  brand?: ProductBrand;
  description?: string;
  images?: ProductImages[];
  similar_products?: Product[];
  image?: Image;
  total?: number | string;
  total_price?: number;
  avg_rating: string | number | null;
  reviews_count: number;
  is_favorite: boolean;
  specifications: ProductSpecifications[];
  can_review?: boolean;
  seo?: ProductSeo;
}

export type ProductsDetailsResponse = ProductDetails[];
