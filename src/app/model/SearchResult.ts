export interface SearchResult<T> {
  data: T[];
  totalElements: number;
  totalPages: number;
  pageSize: number;
}
