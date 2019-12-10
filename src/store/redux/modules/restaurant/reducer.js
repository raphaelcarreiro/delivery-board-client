export const INITIAL_STATE = {
  id: null,
};

export default function restaurant(state = INITIAL_STATE, action) {
  switch (action.type) {
    case '@restaurant/SET_RESTAURANT': {
      return action.restaurant;
    }

    default: {
      return state;
    }
  }
}
