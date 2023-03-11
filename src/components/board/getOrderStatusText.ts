import { OrderStatusOptions } from 'src/types/order';

export const orderStatus = {
  p: 'Aguardando pagamento',
  o: 'Aberto',
  a: 'Aprovado',
  d: 'Saiu para entrega',
  c: 'Completo',
  x: 'Cancelado',
};

export function getOrderStatusText(shipmentMethod: string, status: OrderStatusOptions): string {
  if (status === 'd') {
    return shipmentMethod === 'delivery' ? 'Saiu para entrega' : 'Pronto para retirada';
  }

  return orderStatus[status];
}
