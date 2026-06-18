export interface CfcActivity {
  id: number;
  cfc_id: number;
  activity_name: string;
  activity_date: string;
  isDeleted: boolean;
  cfc?: {
    id: number;
    name: string;
    city_id: number;
    City?: { id: number; districtName: string };
  };
  createdAt: string;
  updatedAt: string;
}

export interface CfcActivityFormData {
  activity_name: string;
  activity_date: string;
}

export interface CfcActivitiesListResponse {
  data: CfcActivity[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CfcActivityActionResponse {
  message: string;
  data: CfcActivity;
}
