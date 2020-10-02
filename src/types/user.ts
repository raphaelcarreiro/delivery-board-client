import { Customer } from './customer';
import { Image } from './image';

export interface User {
  id: number | null;
  name: string;
  email: string;
  phone: string;
  rule: string;
  activated: string;
  image: Image | null;
  loadedFromStorage: boolean;
  customer: Customer;
}
