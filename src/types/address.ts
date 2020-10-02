export interface AreaRegion {
  id: number;
  name: string;
  tax: number;
  formattedTax: string;
}

export interface Address {
  id: number;
  address: string;
  number: string;
  address_complement: string | null;
  postal_code: string;
  district: string;
  city: string;
  region: string;
  is_main: boolean;
  area_region: AreaRegion | null;
  distance: number | null;
  distance_tax: number | null;
  formattedDistanceTax: string | number;
}
