import { moneyFormat } from 'src/helpers/numberFormat';

export const INITIAL_STATE = {
  products: [],
  product: null,
  total: 0,
};

export default function cart(state = INITIAL_STATE, action) {
  switch (action.type) {
    case '@cart/PREPARE_PRODUCT': {
      return {
        ...state,
        product: {
          amount: action.amount,
          ...action.product,
        },
      };
    }

    case '@cart/ADD_TO_CART': {
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

    case '@cart/REMOVE_FROM_CART': {
      const products = state.products.filter(product => product.uid !== action.productUid);
      const total = products.reduce((sum, value) => sum + value.final_price, 0);

      return {
        ...state,
        products,
        total,
        formattedTotal: moneyFormat(total),
      };
    }

    default: {
      return state;
    }
  }
}
