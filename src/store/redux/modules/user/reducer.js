import { moneyFormat } from 'src/helpers/numberFormat';

export const INITIAL_STATE = {
  loadedFromStorage: true,
  id: null,
};

export default function user(state = INITIAL_STATE, action) {
  switch (action.type) {
    case '@user/SET_USER': {
      const customer = action.user.customer;
      const addresses = customer && customer.addresses;

      return {
        ...action.user,
        addresses:
          addresses &&
          addresses.map(address => {
            address.area_region = address.area_region && {
              ...address.area_region,
              formattedTax: moneyFormat(address.area_region.tax),
            };
            address.formattedDistanceTax = moneyFormat(address.distance_tax);
            return address;
          }),
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
      return {
        ...state,
        image: {
          ...state.image,
          selected: !state.image.selected,
        },
      };
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

    default: {
      return state;
    }
  }
}
