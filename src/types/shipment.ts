export type ShipmentMethods = 'customer_collect' | 'delivery' | 'board';

export interface Shipment {
  id: number;
  address: string;
  number: string;
  complement: string | null;
  postal_code: string;
  district: string;
  city: string;
  region: string;
  shipment_method: ShipmentMethods;
  scheduled_at: Date | string | null;
  formattedScheduledAt: string;
  created_at: string;
  distance: number | null;
  distance_tax: number | null;
  formattedDistance: string;
  formattedDistanceTax: string;
}
