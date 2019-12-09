export const INITIAL_STATE = {
  name: '',
  phone: '',
  email: '',
  password: '',
  passwordConfirm: '',
};

export default function userReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'CHANGE': {
      return {
        ...state,
        [action.index]: action.value,
      };
    }
    default: {
      return state;
    }
  }
}
