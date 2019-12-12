export const INITIAL_STATE = {
  loadedFromStorage: true,
  id: null,
};

export default function user(state = INITIAL_STATE, action) {
  switch (action.type) {
    case '@user/SET_USER': {
      return action.user;
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

    default: {
      return state;
    }
  }
}
