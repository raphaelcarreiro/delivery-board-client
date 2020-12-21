import { Complement, Product } from 'src/types/product';

export function handleSelectPizzaProductComplement(
  product: Product,
  complementCategoryId: number,
  complementId: number
): { newProduct: Product; sizeSelected: Complement } {
  const complementCategory = product.complement_categories.find(category => category.id === complementCategoryId);
  if (!complementCategory) throw new Error('Não foi possível identificar a categoria do complemento');

  const complementCategorySize = product.complement_categories.find(category => category.is_pizza_size);
  if (!complementCategorySize) throw new Error('Não foi possível identificar o complemento de tamanho');

  let sizeSelected = complementCategorySize.complements.find(complement => complement.selected) as Complement;

  const categories = product.complement_categories.map(category => {
    if (category.id === complementCategoryId) {
      const selectedAmount = category.complements.reduce((sum, complement) => {
        return complement.selected ? sum + 1 : sum;
      }, 0);

      // marca o complemento selecionado
      category.complements = category.complements.map(complement => {
        if (category.is_pizza_size) {
          complement.selected = complement.id === complementId;
        } else if (category.is_pizza_taste) {
          if (sizeSelected.taste_amount === 1) complement.selected = complement.id === complementId;
          else {
            if (complement.id === complementId) {
              if (complement.selected) complement.selected = !complement.selected;
              else if (sizeSelected.taste_amount > selectedAmount) complement.selected = !complement.selected;
              else if (sizeSelected.taste_amount === selectedAmount)
                throw new Error(
                  `Apenas ${sizeSelected.taste_amount} ${
                    sizeSelected.taste_amount > 1 ? 'sabores' : 'sabor'
                  } você pode selecionar`
                );
            }
          }
        } else if (category.max_quantity === 1) {
          complement.selected = complement.id === complementId && !complement.selected;
        } else {
          if (complement.id === complementId) {
            if (complement.selected) complement.selected = !complement.selected;
            else if (category.max_quantity > selectedAmount) complement.selected = !complement.selected;
          }
        }
        return complement;
      });
    }

    return category;
  });

  sizeSelected = complementCategorySize.complements.find(complement => complement.selected) as Complement;

  // marca os preços de acordo com o tamanho selecionado
  if (complementCategory.is_pizza_size && sizeSelected)
    product.complement_categories.map(category => {
      category.complements.map(complement => {
        // desmarca todos os sabores caso o tamanho tenha sido alterado
        if (complementCategory.is_pizza_size)
          complement.selected = category.is_pizza_taste ? false : complement.selected;
        complement.prices = complement.prices.map(price => {
          price.selected = price.product_complement_size_id === sizeSelected.id;
          return price;
        });
        complement.additional = complement.additional.map(additional => {
          additional.prices = additional.prices.map(price => {
            price.selected = price.product_complement_size_id === sizeSelected.id;
            return price;
          });
          return additional;
        });
        return complement;
      });
      return category;
    });

  // verifica se o produto pode ser adicionado ao pedido
  const ready = product.complement_categories.every(category => {
    if (category.is_required) {
      const selectedAmount = category.complements.reduce((sum, complement) => {
        return complement.selected ? sum + 1 : sum;
      }, 0);

      return category.min_quantity <= selectedAmount;
    }
    return true;
  });

  return {
    newProduct: {
      ...product,
      ready,
      complement_categories: categories,
    },
    sizeSelected,
  };
}
