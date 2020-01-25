const steps = [
  {
    id: 'STEP_SHIPMENT_METHOD',
    order: 1,
    title: 'Método de entrega',
    description: 'Qual é o método de entrega?',
  },
  {
    id: 'STEP_SHIPMENT',
    order: 2,
    title: 'Endereço de entrega',
    description: 'Qual é o endereço de entrega?',
  },
  {
    id: 'STEP_PAYMENT',
    order: 3,
    title: 'Pagamento',
    description: 'Como você vai pagar?',
  },
  {
    id: 'STEP_CONFIRM',
    order: 4,
    title: 'Finalizar',
    description: 'Confirmação do pedido',
  },
  {
    id: 'STEP_SUCCESS',
    order: 5,
    title: 'Pedido realizado',
    description: 'Recebemos seu pedido!',
  },
];

export { steps };
