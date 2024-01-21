export interface IPagination {
  limit: number;
  skip: number;
  page: number;
  nextPage: number;
  prevPage: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  length: number;
}
