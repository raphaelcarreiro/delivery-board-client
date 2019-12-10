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
