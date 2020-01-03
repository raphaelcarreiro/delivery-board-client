export function setRestaurant(restaurant) {
  return {
    type: '@restaurant/SET_RESTAURANT',
    restaurant,
  };
}

export function setRestaurantIsOpen(state) {
  return {
    type: '@restaurant/SET_RESTAURANT_IS_OPEN',
    state,
  };
}
