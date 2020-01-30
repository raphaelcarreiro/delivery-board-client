export function setCustomer(customer) {
  return {
    type: '@order/SET_CUSTOMER',
    customer,
  };
}

export function setShipmentAddress(address) {
  return {
    type: '@order/SET_SHIPMENT_ADDRESS',
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
    type: '@order/SET_PRODUCTS',
    products,
  };
}

export function setChange(value) {
  return {
    type: '@order/SET_CHANGE',
    value,
  };
}

export function changeCreditCard(index, value) {
  return {
    type: '@order/CHANGE_CREDITCARD',
    index,
    value,
  };
}

export function orderChange(index, value) {
  return {
    type: '@order/CHANGE',
    index,
    value,
  };
}

export function setCustomerCollect() {
  return {
    type: '@order/SET_CUSTOMER_COLLECT',
  };
}

export function setInitialState() {
  return {
    type: '@order/SET_INITIAL_STATE',
  };
}

export function clearCard() {
  return {
    type: '@order/CLEAR_CARD',
  };
}
