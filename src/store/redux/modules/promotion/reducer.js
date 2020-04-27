export const INITIAL_STATE = null;

export default function promotions(state = INITIAL_STATE, action) {
  switch (action.type) {
    case '@promotion/SET_PROMOTIONS': {
      return action.promotions;
    }

    default: {
      return state;
    }
  }
}
