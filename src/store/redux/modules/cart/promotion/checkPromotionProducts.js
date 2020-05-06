export function checkProducts(cart, promotion) {
  // promoção com regras de produtos
  const cartProducts = cart.products;

  const response = promotion.products.every(promotionProduct => {
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
                  cartComplement.product_complement_id === complement.product_complement_id && cartComplement.selected
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

  return response;
}
