import { Product } from './product';
import { Coupon } from './coupon';
import { RestaurantConfigTaxMode, RestaurantConfigPizzaCalculate } from './restaurant';

export type CartRestaurantConfigs = {
  pizza_calculate: RestaurantConfigPizzaCalculate;
  tax_mode: RestaurantConfigTaxMode;
  tax_value: number;
  order_minimum_value: number;
  order_minimum_products_amount: number;
  cart_accumulate_discount: boolean;
};

export interface CartProduct extends CartPrepareProduct {
  uid: string;
  additionalPrice: number;
  complementsPrice: number;
  product_price: number;
  final_price: number;
  formattedFinalPrice: string;
  formattedProductPrice: string;
  fromPromotion?: boolean;
  product_id: number;
  promotion: { id: number; name: string } | null;
}

interface CartPrepareProduct extends Product {
  amount: number;
}

export interface Cart {
  products: CartProduct[];
  product: CartPrepareProduct | null;
  total: number;
  history: CartProduct[];
  configs: CartRestaurantConfigs | null;
  coupon: Coupon | null;
  discount: number;
  subtotal: number;
  tax: number;
  productsAmount: number;
  promotionDiscount: number;
  formattedTax: string;
  formattedSubtotal: string;
  formattedDiscount: string;
  formattedTotal: string;
}
