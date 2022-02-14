import { useCallback } from 'react';

type AddressComponentsTypes =
  | 'route' // street
  | 'street_number' // number
  | 'administrative_area_level_2' // city
  | 'administrative_area_level_1' // state
  | 'sublocality'; // neighborhood
type UseAddressComponents = {
  getAddressComponent: (
    addressComponents: google.maps.GeocoderAddressComponent[],
    type: AddressComponentsTypes,
    typeValue: 'short_name' | 'long_name'
  ) => string;
};

export function useAddressComponents(): UseAddressComponents {
  const getAddressComponent = useCallback(
    (addressComponents: google.maps.GeocoderAddressComponent[], type: AddressComponentsTypes, typeValue) => {
      const component = addressComponents.find(component =>
        component.types.find(componentType => componentType === type)
      );

      if (!component) return null;

      return component[typeValue];
    },
    []
  );

  return { getAddressComponent };
}
