import { moneyFormat } from 'src/helpers/numberFormat';

export const INITIAL_STATE = {
  products: [],
  product: null,
  total: 0,
  history: [],
  configs: null,
  coupon: null,
  discount: 0,
  discountPercent: 0,
  subtotal: 0,
};

export default function cart(state = INITIAL_STATE, action) {
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
      const price = state.product.price;
      let additionalPrice = 0;
      let finalPrice = 0;
      let complementsPrice = 0;
      let tastePrice = 0;
      let counterTaste = 0;
      let complementAdditionalPrice = 0;
      const tastePrices = [];

      state.product.additional.forEach(additional => {
        if (additional.selected) additionalPrice += additional.price;
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

      finalPrice = (price + additionalPrice + complementsPrice) * state.product.amount;

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
        },
      ];

      const subtotal = products.reduce((sum, value) => sum + value.final_price, 0);
      const discount = subtotal * (state.discountPercent / 100);
      const total = subtotal - discount;

      return {
        ...state,
        product: null,
        products,
        subtotal,
        total,
        discount,
        formattedTotal: moneyFormat(total),
        formattedDiscount: moneyFormat(discount),
        formattedSubtotal: moneyFormat(subtotal),
      };
    }

    case '@cart/REMOVE_PRODUCT': {
      const products = state.products.filter(product => product.uid !== action.productUid);

      const subtotal = products.reduce((sum, value) => sum + value.final_price, 0);
      const discount = subtotal * (state.discountPercent / 100);
      const total = subtotal - discount;

      return {
        ...state,
        products,
        subtotal,
        total,
        discount,
        formattedTotal: moneyFormat(total),
        formattedDiscount: moneyFormat(discount),
        formattedSubtotal: moneyFormat(subtotal),
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
        if (additional.selected) additionalPrice += additional.price;
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

      const subtotal = products.reduce((sum, value) => sum + value.final_price, 0);
      const discount = subtotal * (state.discountPercent / 100);
      const total = subtotal - discount;

      return {
        ...state,
        products,
        subtotal,
        total,
        discount,
        formattedTotal: moneyFormat(total),
        formattedDiscount: moneyFormat(discount),
        formattedSubtotal: moneyFormat(subtotal),
      };
    }

    case '@cart/RESTORE_CART': {
      const subtotal = state.history.reduce((sum, value) => sum + value.final_price, 0);
      const discount = subtotal * (state.discountPercent / 100);
      const total = subtotal - discount;

      return {
        ...state,
        products: state.history,
        subtotal,
        total,
        discount,
        formattedTotal: moneyFormat(total),
        formattedDiscount: moneyFormat(discount),
        formattedSubtotal: moneyFormat(subtotal),
      };
    }

    case '@cart/CREATE_HISTORY': {
      return {
        ...state,
        history: action.products,
      };
    }

    case '@cart/CLEAR_CART': {
      localStorage.removeItem(process.env.LOCALSTORAGE_CART);
      return INITIAL_STATE;
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
      const subtotal = state.products.reduce((sum, value) => sum + value.final_price, 0);
      const discount = subtotal * (action.coupon.discount / 100);
      const total = subtotal - discount;

      return {
        ...state,
        coupon: action.coupon.name,
        subtotal,
        total,
        discount,
        discountPercent: action.coupon.discount,
        formattedTotal: moneyFormat(total),
        formattedDiscount: moneyFormat(discount),
        formattedSubtotal: moneyFormat(subtotal),
      };
    }

    case '@cart/REMOVE_COUPON': {
      const total = state.products.reduce((sum, value) => sum + value.final_price, 0);

      return {
        ...state,
        coupon: null,
        subtotal: total,
        total,
        discount: 0,
        discountPercent: 0,
        formattedTotal: moneyFormat(total),
        formattedDiscount: moneyFormat(0),
      };
    }

    default: {
      return state;
    }
  }
}
