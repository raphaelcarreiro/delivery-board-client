import { Customer } from './customer';
import { CartProduct } from './cart';
import { Coupon } from './coupon';
import { PaymentMethod } from './paymentMethod';
import { CreatedOrderProduct, OrderProductAdditional, Product } from './product';
import { RestaurantConfig } from './restaurant';
import { ShipmentMethods } from './shipment';

export interface CreditCart {
  number: string;
  name: string;
  card_id?: string;
  expiration_date: string;
  cvv: string;
  cpf: string;
}

export interface OrderShipment {
  id: number;
  order_id?: number;
  customer_address_id?: number;
  restaurant_address_id?: number;
  address: string;
  number: string;
  complement: string | null;
  postal_code: string;
  district: string;
  city: string;
  region: string;
  shipment_method: ShipmentMethods;
  scheduled_at: string | null | Date;
  formattedScheduledAt: string | null;
  distance: number | null;
  distance_tax: number | null;
}

interface OrderStatus {
  id: number;
  status: OrderStatusOptions;
  statusName: string;
  created_at: string;
  formattedDate?: string;
}

export interface Order {
  id: string;
  formattedId: string;
  shipment: {
    shipment_method: ShipmentMethods;
  };
  customer: Customer | null;
  paymentMethod: PaymentMethod | null;
  products: CartProduct[];
  change: number;
  creditCard: CreditCart | null;
  coupon: Coupon | null;
  tax: number;
  discount: number;
  formattedChange: string;
  formattedTax: string;
  origin: OrderOrigin;
  settings?: RestaurantConfig | null;
}

export interface OrderOrigin {
  version: string | null;
  app_name: string | null;
  platform: 'admin' | 'web-app' | 'native-app' | null;
}

export type OrderStatusOptions = 'p' | 'o' | 'a' | 'd' | 'c' | 'x';

interface PicPayPayment {
  payment_url: string;
}

interface PixPayment {
  order_id: number;
  qr_code: string;
  qr_code_base64: string;
  expires_at: string;
  paid_at: string;
  created_at: string;
}

export interface OrderProduct extends Product {
  final_price: number;
  product_price: number;
  formattedFinalPrice: string;
  formattedProductPrice: string;
  amount: number;
  additional: OrderProductAdditional[];
  promotion_id: number | null;
  product_id: any;
  uid: string;
  complementsPrice: number;
  additionalPrice: number;
  ready: boolean;
}

export interface CreatedOrder {
  id: number;
  uuid: string;
  formattedId: string;
  customer: Customer;
  payment_method: PaymentMethod;
  shipment: OrderShipment;
  products: CreatedOrderProduct[];
  coupon: Coupon;
  created_at: string;
  formattedDate: string;
  dateDistance: string;
  subtotal: number;
  formattedSubtotal: string;
  formattedDiscount: string;
  tax: number;
  formattedTax: string;
  discount: number;
  change: number;
  formattedChange: string;
  total: number;
  formattedTotal: string;
  order_status: OrderStatus[];
  status: OrderStatusOptions;
  statusName: string;
  picpay_payment?: PicPayPayment;
  pix_payment?: PixPayment;
}
