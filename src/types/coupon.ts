export interface Coupon {
  id: number;
  name: string;
  description: string;
  discount: number;
  discount_type: 'percent' | 'value';
  valid_at: string;
  usage_amount: number;
  activated: boolean;
}
