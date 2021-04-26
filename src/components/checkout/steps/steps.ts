export type CheckoutStepIds =
  | 'STEP_SHIPMENT_METHOD'
  | 'STEP_SHIPMENT'
  | 'STEP_PAYMENT'
  | 'STEP_CONFIRM'
  | 'STEP_SUCCESS';

export interface CheckoutStep {
  id: CheckoutStepIds;
  order: number;
  title: string;
  description: string;
}

const steps: CheckoutStep[] = [
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
    description: 'está tudo correto?',
  },
  {
    id: 'STEP_SUCCESS',
    order: 5,
    title: 'Pedido realizado',
    description: 'recebemos seu pedido!',
  },
];

export { steps };
