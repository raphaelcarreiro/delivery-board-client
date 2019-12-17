export function setCustomer(customer) {
  return {
    type: '@order/SET_CUSTOMER',
    customer,
  };
}

export function setShipmentAddress(address) {
  return {
    type: '@order/SET_CUSTOMER',
    address,
  };
}

export function setPaymentMethod(paymentMethod) {
  return {
    type: '@order/SET_PAYMENT_METHOD',
    paymentMethod,
  };
}

export function setProducts(products) {
  return {
    type: '@order/SET_CUSTOMER',
    products,
  };
}
