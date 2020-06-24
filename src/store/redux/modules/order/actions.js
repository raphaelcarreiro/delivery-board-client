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

export function setShipmentMethod(shipmentMethod) {
  return {
    type: '@order/SET_SHIPMENT_METHOD',
    shipmentMethod,
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

export function setCoupon(coupon) {
  return {
    type: '@order/SET_COUPON',
    coupon,
  };
}

export function setTax(tax) {
  return {
    type: '@order/SET_TAX',
    tax,
  };
}

export function setSchedule(date) {
  return {
    type: '@order/SET_SCHEDULE',
    date,
  };
}

export function setDiscount(discount) {
  return {
    type: '@order/SET_DISCOUNT',
    discount,
  };
}

export function setCard(card) {
  return {
    type: '@order/SET_CARD',
    card,
  };
}
