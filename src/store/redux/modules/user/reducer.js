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
    default: {
      return state;
    }
  }
}
