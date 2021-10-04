export interface AreaRegion {
  id: number;
  name: string;
  tax: number;
  formattedTax: string;
  area_region_id: number | null;
}

export interface Address {
  id: number;
  address: string;
  number: string;
  complement: string | null;
  postal_code: string;
  district: string;
  city: string;
  region: string;
  is_main: boolean;
  area_region: AreaRegion | null;
  area_region_id: number | null;
  distance: number | null;
  distance_tax: number | null;
  formattedDistanceTax: string | number;
  reference_point: string | null;
  latitude: number | null;
  longitude: number | null;
}
