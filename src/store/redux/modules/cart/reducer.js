import { moneyFormat } from 'src/helpers/numberFormat';

export const INITIAL_STATE = {
  products: [],
  product: null,
  total: 0,
  history: [],
  configs: null,
  coupon: null,
  discount: 0,
  subtotal: 0,
  tax: 0,
  productsAmount: 0,
  promotionDiscount: 0,
};

export default function cart(state = INITIAL_STATE, action) {
  function addToCart(promotion = null) {
    const price =
      state.product.promotion_activated && state.product.special_price > 0
        ? state.product.special_price
        : state.product.price;
    let additionalPrice = 0;
    let finalPrice = 0;
    let complementsPrice = 0;
    let tastePrice = 0;
    let counterTaste = 0;
    let complementAdditionalPrice = 0;
    const tastePrices = [];

    state.product.additional.forEach(additional => {
      if (additional.selected) additionalPrice += additional.price * additional.amount;
    });

    // soma os preços dos complementos de pizza
    if (state.product.category.is_pizza)
      state.product.complement_categories.forEach(category => {
        category.complements.forEach(complement => {
          if (complement.selected) {
            counterTaste = category.is_pizza_taste && complement.selected ? counterTaste + 1 : counterTaste;
            complement.prices.forEach(price => {
              if (category.is_pizza_taste) {
                tastePrice = price.selected && price.price ? tastePrice + price.price : tastePrice;
                if (price.selected) tastePrices.push(price.price);
              } else
                complementsPrice = price.selected && price.price ? complementsPrice + price.price : complementsPrice;
            });
            complement.additional.forEach(additional => {
              if (additional.selected)
                additional.prices.forEach(price => {
                  complementAdditionalPrice = price.selected
                    ? price.price + complementAdditionalPrice
                    : complementAdditionalPrice;
                });
              return additional;
            });
          }
        });
      });
    // soma os preços dos complementos em geral
    else
      state.product.complement_categories.forEach(category => {
        complementsPrice = category.complements.reduce((sum, complement) => {
          return complement.selected && complement.price ? sum + complement.price : sum;
        }, complementsPrice);
      });

    // calcula do valor das pizzas
    if (counterTaste > 0) {
      if (state.configs.pizza_calculate === 'average_value') {
        tastePrice = tastePrice / counterTaste;
      } else if (state.configs.pizza_calculate === 'higher_value') {
        tastePrice = Math.max.apply(Math, tastePrices);
      }

      complementsPrice = complementsPrice + tastePrice + complementAdditionalPrice;
    }

    finalPrice = promotion ? 0 : (price + additionalPrice + complementsPrice) * state.product.amount;

    const products = [
      ...state.products,
      {
        ...state.product,
        uid: new Date().getTime(),
        product_price: price,
        formattedProductPrice: moneyFormat(price),
        price: price + additionalPrice + complementsPrice,
        final_price: finalPrice,
        additionalPrice: additionalPrice,
        complementsPrice: complementsPrice,
        formattedPrice: moneyFormat(price + additionalPrice + complementsPrice),
        formattedFinalPrice: moneyFormat(finalPrice),
        promotion,
      },
    ];

    gtag('event', 'add_to_cart', {
      currency: 'BRL',
      items: [
        {
          id: state.product.id,
          name: state.product.name,
          brand: '',
          category: state.product.category.name,
          variant: '',
          price: state.product.price,
          currency: 'BRL',
          quantity: state.product.amount,
        },
      ],
      value: state.product.final_price,
    });

    return {
      ...state,
      product: null,
      products,
    };
  }

  switch (action.type) {
    case '@cart/SET_CART': {
      return action.cart;
    }

    case '@cart/PREPARE_PRODUCT': {
      return {
        ...state,
        product: {
          amount: action.amount,
          ...action.product,
        },
      };
    }

    case '@cart/ADD_PRODUCT': {
      return addToCart();
    }

    case '@cart/PROMOTION_ADD_PRODUCT': {
      return addToCart({ id: action.promotion.id, name: action.promotion.name });
    }

    case '@cart/REMOVE_PRODUCT': {
      const products = state.products.filter(product => product.uid !== action.productUid);

      return {
        ...state,
        products,
      };
    }

    case '@cart/PROMOTION_REMOVE_PRODUCT': {
      const products = state.products.filter(product => {
        if (!product.promotion) return true;
        else return product.promotion.id !== action.promotionId;
      });

      return {
        ...state,
        products,
      };
    }

    case '@cart/INACTIVE_PROMOTION_REMOVE_PRODUCT': {
      const products = state.products.filter(product => {
        if (!product.promotion) return true;
        else return action.promotions.some(promotion => promotion.id === product.promotion.id);
      });

      return {
        ...state,
        products,
      };
    }

    case '@cart/UPDATE_PRODUCT': {
      const price = action.product.product_price;
      let additionalPrice = 0;
      let finalPrice = 0;
      let complementsPrice = 0;
      let tastePrice = 0;
      let counterTaste = 0;
      let complementAdditionalPrice = 0;
      const tastePrices = [];

      action.product.additional.forEach(additional => {
        if (additional.selected) additionalPrice += additional.price * additional.amount;
      });

      // soma os preços dos complementos de pizza
      if (action.product.category.is_pizza)
        action.product.complement_categories.forEach(category => {
          category.complements.forEach(complement => {
            if (complement.selected) {
              counterTaste = category.is_pizza_taste && complement.selected ? counterTaste + 1 : counterTaste;
              complement.prices.forEach(price => {
                if (category.is_pizza_taste) {
                  tastePrice = price.selected && price.price ? tastePrice + price.price : tastePrice;
                  if (price.selected) tastePrices.push(price.price);
                } else
                  complementsPrice = price.selected && price.price ? complementsPrice + price.price : complementsPrice;
              });
              complement.additional.forEach(additional => {
                if (additional.selected)
                  additional.prices.forEach(price => {
                    complementAdditionalPrice = price.selected
                      ? price.price + complementAdditionalPrice
                      : complementAdditionalPrice;
                  });
                return additional;
              });
            }
          });
        });
      // soma os preços dos complementos em geral
      else
        action.product.complement_categories.forEach(category => {
          complementsPrice = category.complements.reduce((sum, complement) => {
            return complement.selected && complement.price ? sum + complement.price : sum;
          }, complementsPrice);
        });

      // calcula do valor das pizzas
      if (counterTaste > 0) {
        if (state.configs.pizza_calculate === 'average_value') {
          tastePrice = tastePrice / counterTaste;
        } else if (state.configs.pizza_calculate === 'higher_value') {
          tastePrice = Math.max.apply(Math, tastePrices);
        }

        complementsPrice = complementsPrice + tastePrice + complementAdditionalPrice;
      }

      finalPrice = (price + additionalPrice + complementsPrice) * action.amount;

      const updatedProduct = {
        ...action.product,
        amount: action.amount,
        product_price: price,
        formattedProductPrice: moneyFormat(price),
        price: price + additionalPrice + complementsPrice,
        final_price: finalPrice,
        additionalPrice: additionalPrice,
        complementsPrice: complementsPrice,
        formattedPrice: moneyFormat(price + additionalPrice + complementsPrice),
        formattedFinalPrice: moneyFormat(finalPrice),
      };

      const products = state.products.map(product => {
        if (product.uid === updatedProduct.uid) {
          product = updatedProduct;
        }
        return product;
      });

      return {
        ...state,
        products,
      };
    }

    case '@cart/RESTORE_CART': {
      return {
        ...state,
        products: state.history,
      };
    }

    case '@cart/CREATE_HISTORY': {
      return {
        ...state,
        history: action.products,
      };
    }

    case '@cart/CLEAR_CART': {
      return {
        ...INITIAL_STATE,
        configs: {
          ...state.configs,
        },
      };
    }

    case '@cart/SET_CONFIGS': {
      return {
        ...state,
        configs: {
          ...state.configs,
          ...action.configs,
        },
      };
    }

    case '@cart/SET_COUPON': {
      return {
        ...state,
        coupon: action.coupon,
      };
    }

    case '@cart/REMOVE_COUPON': {
      return {
        ...state,
        coupon: null,
      };
    }

    case '@cart/SET_TAX': {
      return {
        ...state,
        tax: action.tax,
        formattedTax: moneyFormat(action.tax),
      };
    }

    case '@cart/SET_DISCOUNT': {
      if (action.discount === 0)
        return {
          ...state,
          promotionDiscount: 0,
        };

      const subtotal = state.products.reduce((sum, value) => sum + value.final_price, 0);

      let promotionDiscount = action.discountType === 'percent' ? subtotal * (action.discount / 100) : action.discount;

      if (state.configs.cart_accumulate_discount) promotionDiscount = state.promotionDiscount + promotionDiscount;
      else
        promotionDiscount = state.promotionDiscount > promotionDiscount ? state.promotionDiscount : promotionDiscount;

      return {
        ...state,
        promotionDiscount,
      };
    }

    case '@cart/UPDATE_TOTAL': {
      const { configs } = state;
      const { coupon } = state;
      const promotionDiscount = state.promotionDiscount;

      let tax = state.tax;
      let discount = 0;
      let total = 0;
      let couponDiscount = 0;

      const subtotal = state.products.reduce((sum, value) => sum + value.final_price, 0);
      const productsAmount = state.products.reduce((carry, product) => carry + product.amount, 0);
      const hasProductNoTax = state.products.some(product => product.no_tax);

      if (coupon)
        couponDiscount = coupon.discount_type === 'percent' ? subtotal * (coupon.discount / 100) : coupon.discount;

      if (configs.cart_accumulate_discount) discount = promotionDiscount + couponDiscount;
      else discount = couponDiscount > promotionDiscount ? couponDiscount : promotionDiscount;

      if (action.shipmentMethod === 'delivery') {
        switch (configs.tax_mode) {
          case 'order_value': {
            tax = configs.tax_value > 0 && subtotal < configs.order_minimum_value ? configs.tax_value : 0;
            break;
          }

          case 'products_amount': {
            tax = productsAmount <= configs.order_minimum_products_amount ? configs.tax_value : 0;
          }
        }
      }

      if (action.shipmentMethod !== 'delivery' || hasProductNoTax) tax = 0;

      total = subtotal - discount + tax;

      total = total < 0 ? 0 : total;

      return {
        ...state,
        tax,
        subtotal,
        total,
        discount,
        formattedSubtotal: moneyFormat(subtotal),
        formattedDiscount: moneyFormat(discount),
        formattedTax: moneyFormat(tax),
        formattedTotal: moneyFormat(total),
        productsAmount,
      };
    }

    default: {
      return state;
    }
  }
}
