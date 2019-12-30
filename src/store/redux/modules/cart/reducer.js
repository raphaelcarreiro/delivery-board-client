import { moneyFormat } from 'src/helpers/numberFormat';

export const INITIAL_STATE = {
  products: [],
  product: null,
  total: 0,
  history: [],
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
                if (category.is_pizza_taste)
                  tastePrice = price.selected && price.price ? tastePrice + price.price : tastePrice;
                else
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

      // calcula preço das pizzas pela média
      if (counterTaste > 0) {
        tastePrice = tastePrice / counterTaste;
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

      const total = products.reduce((sum, value) => sum + value.final_price, 0);

      return {
        ...state,
        product: null,
        products,
        total,
        formattedTotal: moneyFormat(total),
      };
    }

    case '@cart/REMOVE_PRODUCT': {
      const products = state.products.filter(product => product.uid !== action.productUid);
      const total = products.reduce((sum, value) => sum + value.final_price, 0);

      return {
        ...state,
        products,
        total,
        formattedTotal: moneyFormat(total),
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
                if (category.is_pizza_taste)
                  tastePrice = price.selected && price.price ? tastePrice + price.price : tastePrice;
                else
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

      // calcula preço das pizzas pela média
      if (counterTaste > 0) {
        tastePrice = tastePrice / counterTaste;
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

      const total = products.reduce((sum, value) => sum + value.final_price, 0);

      return {
        ...state,
        products,
        total,
        formattedTotal: moneyFormat(total),
      };
    }

    case '@cart/RESTORE_CART': {
      const total = state.history.reduce((sum, value) => sum + value.final_price, 0);

      return {
        ...state,
        products: state.history,
        total,
        formattedTotal: moneyFormat(total),
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

    default: {
      return state;
    }
  }
}
