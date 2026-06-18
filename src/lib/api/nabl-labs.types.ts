export interface TestingLaboratory {
  id: number;
  city_id: number;
  product_id: number;
  lab_name: string;
  lab_name_hindi: string | null;
  lab_code: string;
  address: string;
  address_hindi: string | null;
  district: string;
  district_hindi: string | null;
  discipline: string[];
  contact_number: string;
  email: string;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;

  city: {
    id: number;
    districtName: string;
    state_id: number;
    status: number;
  } | null;

  product: {
    id: number;
    name: string;
    name_hindi: string | null;
    slug: string;
    status: number;
  };
}

export interface NablLabsListResponse {
  data: TestingLaboratory[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
