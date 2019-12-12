export function setUser(user) {
  return {
    type: '@user/SET_USER',
    user,
  };
}

export function removeUser() {
  return {
    type: '@user/REMOVE_USER',
  };
}

export function userChange(index, value) {
  return {
    type: '@user/USER_CHANGE',
    index,
    value,
  };
}

export function customerChange(index, value) {
  return {
    type: '@user/CUSTOMER_CHANGE',
    index,
    value,
  };
}

export function selectImage() {
  return {
    type: '@user/SELECT_IMAGE',
  };
}

export function deleteImage() {
  return {
    type: '@user/DELETE_IMAGE',
  };
}
