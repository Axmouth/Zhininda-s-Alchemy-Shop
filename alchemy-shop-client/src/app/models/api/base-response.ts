import { Pagination } from './pagination';
export class BaseResponse<T> {
  data?: T;
  errors?: string[];
  messages?: string[];
  pagination?: Pagination;
  success: boolean;
}
