export interface Board {
  id: string;
  restaurant_id: number;
  number: string;
  qr_code: string;
  description: string;
  active: boolean;
  created_at: string;
  customer_name_required: boolean;
  delivery_location_required: boolean;
  max_value: number;
  state?: 'busy' | 'free';
}
