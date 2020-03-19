export const orderStatus = {
  o: 'Aberto',
  a: 'Aprovado',
  d: 'Saiu para entrega',
  c: 'Completo',
  x: 'Cancelado',
};

export function orderStatusName(shipmentMethod, status) {
  if (status === 'd') {
    if (shipmentMethod === 'delivery') return 'Saiu para entrega';
    else return 'Pronto para retirada';
  }

  return orderStatus[status];
}
