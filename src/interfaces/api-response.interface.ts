import { Link } from './link.interface';

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  links?: Array<Link>;
  data: T;
}
