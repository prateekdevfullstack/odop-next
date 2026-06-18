export interface GIProductCategory {
  id: number;
  name: string;
  slug: string;
  thumbnail: string | null;
}

export interface GIProductCategoryImage {
  id?: number;
  image?: string;
  url?: string;
  path?: string;
  altText?: string;
}

export interface GIProduct {
  id: number;
  category_id: number;
  name: string;
  nameHindi: string;
  slug: string;
  thumbnail: string | null;
  short_description: string | null;
  description: string | null;
  type: string;
  status: number;
  is_approved: number;
  isGIProduct: boolean;
  giTagIssueDate: string | null;
  isDeleted: number;
  createdAt: string;
  updatedAt: string;
  category: GIProductCategory;
  productCategoryImages: GIProductCategoryImage[];
}

export interface GIProductListResponse {
  success?: boolean;
  data?: GIProduct[];
}
