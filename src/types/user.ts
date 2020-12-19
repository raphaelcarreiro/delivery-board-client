import { Customer } from './customer';
import { Image } from './image';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  image: Image | null;
  customer: Customer;
}
