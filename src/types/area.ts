export interface Area {
  city_id: number;
  restaurant_id: number;
  restaurant_address_id: number;
  max_distance: number | null;
  distances: AreaDistance[];
}

export interface AreaDistance {
  id: number;
  area_id: number;
  from_distance: number;
  until_distance: number;
  tax: number;
}
