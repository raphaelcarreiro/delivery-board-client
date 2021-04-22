const steps = [
  {
    id: 'STEP_RESTAURANT_ADDRESSES',
    order: 1,
    title: 'Endereço da loja',
    description: 'para qual loja enviar o pedido?',
  },
  {
    id: 'STEP_SHIPMENT_METHOD',
    order: 1,
    title: 'Método de entrega',
    description: 'qual é o método de entrega?',
  },
  {
    id: 'STEP_SHIPMENT',
    order: 2,
    title: 'Endereço de entrega',
    description: 'qual é o endereço de entrega?',
  },
  {
    id: 'STEP_PAYMENT',
    order: 3,
    title: 'Pagamento',
    description: 'como você vai pagar?',
  },
  {
    id: 'STEP_CONFIRM',
    order: 4,
    title: 'Finalizar',
    description: 'confirmação do pedido',
  },
  {
    id: 'STEP_SUCCESS',
    order: 5,
    title: 'Pedido realizado',
    description: 'recebemos seu pedido!',
  },
];

export { steps };
