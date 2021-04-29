import { moneyFormat } from 'src/helpers/numberFormat';
import { Customer } from 'src/types/customer';
import { Image } from 'src/types/image';
import { User } from 'src/types/user';
import { UserActionsType } from './types';

export const INITIAL_STATE: User = {
  id: 0,
  customer: {} as Customer,
  email: '',
  image: {} as Image,
  name: '',
  phone: '',
};

export default function user(state = INITIAL_STATE, action: UserActionsType): User {
  switch (action.type) {
    case '@user/SET_USER': {
      return {
        ...action.user,
        customer: {
          ...action.user.customer,
          addresses: action.user.customer.addresses.map(address => {
            address.area_region = address.area_region && {
              ...address.area_region,
              formattedTax: moneyFormat(address.area_region.tax),
            };
            address.formattedDistanceTax = moneyFormat(address.distance_tax);
            return address;
          }),
        },
      };
    }

    case '@user/REMOVE_USER': {
      return INITIAL_STATE;
    }

    case '@user/USER_CHANGE': {
      return {
        ...state,
        [action.index]: action.value,
      };
    }

    case '@user/CUSTOMER_CHANGE': {
      return {
        ...state,
        customer: {
          ...state.customer,
          [action.index]: action.value,
        },
      };
    }

    case '@user/SELECT_IMAGE': {
      if (state.image)
        return {
          ...state,
          image: {
            ...state.image,
            selected: !state.image.selected,
          },
        };

      return state;
    }

    case '@user/DELETE_IMAGE': {
      return {
        ...state,
        image: null,
      };
    }

    case '@user/ADD_ADDRESS': {
      return {
        ...state,
        customer: {
          ...state.customer,
          addresses: [
            ...state.customer.addresses,
            {
              ...action.address,
              area_region: action.address.area_region && {
                ...action.address.area_region,
                formattedTax: moneyFormat(action.address.area_region.tax),
              },
              formattedDistanceTax: moneyFormat(action.address.distance_tax),
            },
          ],
        },
      };
    }

    case '@user/DELETE_ADDRESS': {
      const addresses = state.customer.addresses.filter(address => address.id !== action.addressId);

      return {
        ...state,
        customer: {
          ...state.customer,
          addresses,
        },
      };
    }

    case '@user/UPDATE_ADDRESS': {
      const addresses = state.customer.addresses.map(address => {
        if (address.id === action.address.id) {
          return {
            ...action.address,
            area_region: action.address.area_region && {
              ...action.address.area_region,
              formattedTax: moneyFormat(action.address.area_region.tax),
            },
            formattedDistanceTax: moneyFormat(action.address.distance_tax),
          };
        }

        return address;
      });

      return {
        ...state,
        customer: {
          ...state.customer,
          addresses,
        },
      };
    }
    case '@user/SET_MAIN_ADDRESS': {
      const addresses = state.customer.addresses.map(address => {
        address.is_main = address.id === action.addressId;
        return address;
      });

      return {
        ...state,
        customer: {
          ...state.customer,
          addresses,
        },
      };
    }

    case '@user/SET_CUSTOMER_ADDRESSES': {
      const addresses = action.addresses.map(address => {
        address.formattedDistanceTax = moneyFormat(address.distance_tax);
        address.area_region = address.area_region
          ? {
              ...address.area_region,
              formattedTax: moneyFormat(address.area_region.tax),
            }
          : null;

        return address;
      });

      return {
        ...state,
        customer: {
          ...state.customer,
          addresses,
        },
      };
    }

    default: {
      return state;
    }
  }
}
