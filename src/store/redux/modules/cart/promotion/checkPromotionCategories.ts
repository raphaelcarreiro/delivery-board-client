import { Cart } from 'src/types/cart';
import { Promotion } from 'src/types/promotion';

export function checkCategories(cart: Cart, promotion: Promotion) {
  // monta array de categorias x total dos produtos
  // verifica se produtos no carrinho satisfação regra da promoção

  const cartCategories: any[] = [];

  cart.products.forEach(product => {
    if (!product.fromPromotion)
      if (!cartCategories.includes(product.category.id)) cartCategories.push({ id: product.category.id, value: 0 });
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
  const response = promotion.categories.every(promotionCategory => {
    const cartCategory = cartCategories.find(cartCategory => cartCategory.id === promotionCategory.category_id);
    if (cartCategory) return cartCategory.value >= promotionCategory.value;
    else return false;
  });

  return response;
}
