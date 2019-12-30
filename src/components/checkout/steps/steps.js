const steps = [
  {
    id: 'STEP_SHIPMENT',
    order: 1,
    title: 'Endereço de entrega',
    description: 'Qual é o endereço de entrega?',
  },
  {
    id: 'STEP_PAYMENT',
    order: 2,
    title: 'Pagamento',
    description: 'Como você vai pagar?',
  },
  {
    id: 'STEP_CONFIRM',
    order: 3,
    title: 'Finalizar',
    description: 'Confirmação do pedido',
  },
  {
    id: 'STEP_SUCCESS',
    order: 4,
    title: 'Pedido realizado',
    description: 'Recebemos seu pedido!',
  },
];

export { steps };
