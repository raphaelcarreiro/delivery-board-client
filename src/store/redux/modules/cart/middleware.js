import {
  createHistory,
  setConfigs,
  updateTotal,
  setTax,
  setDiscount,
  prepareProduct,
  promotionAddToCart,
  promotionRemoveFromCart,
} from './actions';

const saveCartAtLocalStorage = cart => {
  localStorage.setItem(process.env.LOCALSTORAGE_CART, JSON.stringify(cart));
};

export const cartMiddlware = store => next => action => {
  // actions para atualizar total e salvar carrinho em local storage
  const actionsToSaveCart = [
    '@cart/ADD_PRODUCT',
    '@cart/REMOVE_PRODUCT',
    '@cart/UPDATE_PRODUCT',
    '@cart/RESTORE_CART',
    '@cart/SET_COUPON',
    '@cart/REMOVE_COUPON',
    '@cart/SET_CART',
    '@order/SET_SHIPMENT_METHOD',
    '@order/SET_SHIPMENT_ADDRESS',
    '@promotion/SET_PROMOTIONS',
  ];

  // actions para salvar configurações do restaurante no carrinho
  const actionsToSetConfigs = ['@restaurant/SET_RESTAURANT', '@cart/SET_CART'];

  // cria histórico para recuperar item excluído do carrinho
  if (action.type === '@cart/REMOVE_PRODUCT') {
    const cart = store.getState().cart;
    store.dispatch(createHistory(cart.products));
  }

  next(action);

  if (action.type === '@order/SET_SHIPMENT_METHOD') {
    const restaurant = store.getState().restaurant;
    const order = store.getState().order;
    if (restaurant.configs.tax_mode === 'district') {
      const { area_region } = order.shipment;
      if (!area_region) return;
      const tax = area_region.tax;
      store.dispatch(setTax(tax));
    }
  }

  if (action.type === '@order/SET_SHIPMENT_ADDRESS') {
    const restaurant = store.getState().restaurant;
    if (restaurant.configs.tax_mode === 'district') {
      const { area_region } = action.address;
      if (!area_region) return;
      const tax = area_region.tax;
      store.dispatch(setTax(tax));
    }
  }

  // atualiza as configurações do restaurante no carrinho para calculos
  if (actionsToSetConfigs.includes(action.type)) {
    const { configs } = store.getState().restaurant;
    store.dispatch(
      setConfigs({
        pizza_calculate: configs.pizza_calculate,
        tax_mode: configs.tax_mode,
        tax_value: configs.tax_value,
        order_minimum_value: configs.order_minimum_value,
      })
    );
  }

  // atualiza total do carrinho de acordo com a action emitida
  if (actionsToSaveCart.includes(action.type)) {
    const order = store.getState().order;
    store.dispatch(updateTotal(order.shipment.shipment_method || 'delivery'));
  }

  /*
   * verifica se há promoções e aplica ao carrinho depois da atualização do total.
   * total é atualizado novamente
   */
  if (actionsToSaveCart.includes(action.type)) {
    const promotions = store.getState().promotion;
    const cart = store.getState().cart;
    const order = store.getState().order;

    if (promotions) {
      promotions.forEach(promotion => {
        let checked = false;
        if (promotion.categories.length > 0) {
          // promoção com regras de categorias

          // monta array de categorias x total dos produtos
          const cartCategories = [];
          cart.products.forEach(product => {
            if (!product.fromPromotion)
              if (!cartCategories.includes(product.category.id))
                cartCategories.push({ id: product.category.id, value: 0 });
          });
          cart.products.forEach(product => {
            cartCategories.map(category => {
              if (!product.fromPromotion)
                if (category.id === product.category.id) {
                  category.value += product.final_price;
                }
              return category;
            });
          });

          // verifica se produtos no carrinho satisfação regra da promoção
          checked = promotion.categories.every(promotionCategory => {
            const cartCategory = cartCategories.find(cartCategory => cartCategory.id === promotionCategory.category_id);
            if (cartCategory) return cartCategory.value >= promotionCategory.value;
            else return false;
          });

          store.dispatch(updateTotal(order.shipment.shipment_method || 'delivery'));
        } else if (promotion.products.length > 0) {
          // promoção com regras de produtos
          const cartProducts = cart.products;

          checked = promotion.products.every(promotionProduct => {
            const cartProduct = cartProducts.find(cp => cp.id === promotionProduct.product_id);
            if (cartProduct) {
              let checkedComplements = [];
              if (promotionProduct.complement_categories.length > 0) {
                promotionProduct.complement_categories.forEach(category => {
                  const cartComplementCategory = cartProduct.complement_categories.find(
                    cc => cc.id === category.product_complement_category_id
                  );

                  category.complements.forEach(complement => {
                    if (cartComplementCategory) {
                      const checkedCategory = checkedComplements.some(
                        c => c.complement_category_id === cartComplementCategory.id
                      );
                      if (!checkedCategory)
                        checkedComplements.push({
                          complement_category_id: cartComplementCategory.id,
                          complements: [],
                        });
                      const test = cartComplementCategory.complements.some(
                        cartComplement =>
                          cartComplement.product_complement_id === complement.product_complement_id &&
                          cartComplement.selected
                      );
                      checkedComplements = checkedComplements.map(_category => {
                        if (_category.complement_category_id === cartComplementCategory.id)
                          _category.complements = [
                            ..._category.complements,
                            {
                              complement_id: complement.product_complement_id,
                              test,
                            },
                          ];

                        return _category;
                      });
                    } else {
                      checkedComplements.push({
                        complement_category_id: category.id,
                        complements: [],
                      });
                    }
                  });
                });
              }
              checkedComplements = checkedComplements.every(category => {
                const checkedComplement = category.complements.some(complement => complement.test);
                return checkedComplement;
              });
              return cartProduct.amount >= promotionProduct.amount && checkedComplements;
            } else return false;
          });
        } else if (promotion.order_value) {
          // promoção com regra de valor de pedido
          const { order_value: orderValue } = promotion.order_value;
          checked = cart.subtotal >= orderValue;
        }

        // se carrinho setisfez condições de alguma promoção ativa.
        if (checked) {
          if (promotion.type === 'safe') {
            const { safe } = promotion;
            store.dispatch(setDiscount(safe.discount_type, safe.discount));
          } else if (promotion.type === 'get') {
            store.dispatch(promotionRemoveFromCart(promotion.id));
            promotion.offered_products.forEach(product => {
              store.dispatch(prepareProduct(product, product.amount));
              store.dispatch(promotionAddToCart({ id: promotion.id, name: promotion.name }));
            });
          }
        } else {
          if (promotion.type === 'safe') store.dispatch(setDiscount('value', 0));
          else store.dispatch(promotionRemoveFromCart(promotion.id));
        }
        store.dispatch(updateTotal(order.shipment.shipment_method || 'delivery'));
      });
    } else {
      store.dispatch(setDiscount('value', 0));
      store.dispatch(updateTotal(order.shipment.shipment_method || 'delivery'));
      store.dispatch(promotionRemoveFromCart());
    }
  }

  // salva o carrinho em local storage
  if (actionsToSaveCart.includes(action.type)) {
    const cart = store.getState().cart;
    saveCartAtLocalStorage(cart);
  }
};
