export interface KnowledgeHubScrollItem {
  id: number;
  title: string;
  description: string | null;
  department: string | null;
  titleHindi: string | null;
  descriptionHindi: string | null;
  departmentHindi: string | null;
  attachment: string | null;
  hyperlink: string | null;
  status: string;
  created_by: number | null;
  updated_by: number | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeHubScrollResponse {
  data: KnowledgeHubScrollItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
