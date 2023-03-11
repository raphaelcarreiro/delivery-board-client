import { OrderStatusOptions } from './order';

export interface BoardOrderProduct {
  id: number;
  uuid: string;
  description: string;
  amount: number;
  total: number;
  board_number: string;
  status: OrderStatusOptions;
  formattedTotal: string;
  formattedStatus: string;
  name: string;
  product_id: number;
  order_product_id: number;
  created_at: string;
}
