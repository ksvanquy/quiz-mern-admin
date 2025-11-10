export type SortOrder = "asc" | "desc";

export type ListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: SortOrder;
};

export type PagedResponse<T> = {
  items: T[];
  total: number;
};


