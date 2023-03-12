import { OrderStatusOptions } from './order';
import { CreatedOrderProduct } from './product';

export interface BoardOrderProduct extends CreatedOrderProduct {
  order_id: number;
  order_uuid: string;
  amount: number;
  board_number: string;
  status: OrderStatusOptions;
  formattedStatus: string;
  name: string;
  product_id: number;
  order_product_id: number;
  created_at: string;
}
