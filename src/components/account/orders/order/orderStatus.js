export const orderStatus = {
  p: 'aguardando pagamento',
  o: 'aberto',
  a: 'aprovado',
  d: 'saiu para entrega',
  c: 'completo',
  x: 'cancelado',
};

export function orderStatusName(shipmentMethod, status) {
  if (status === 'd') {
    if (shipmentMethod === 'delivery') return 'saiu para entrega';
    else return 'pronto para retirada';
  }

  return orderStatus[status];
}
