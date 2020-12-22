import { makeStyles } from '@material-ui/core';
import React from 'react';
import { useProductPizza } from '../hooks/useProductPizza';
import ProductPizzaComplementHeader from './ProductPizzaComplementHeader';
import ProductPizzaComplementItem from './ProductPizzaComplementItem';

const useStyles = makeStyles({
  category: {
    display: 'block',
    marginBottom: 10,
  },
  container: {
    marginBottom: 0,
  },
});

const ProductPizzaComplementCategories: React.FC = () => {
  const classes = useStyles();
  const {
    filteredProduct,
    handleSearch,
    handleClickPizzaComplements,
    openDialogAdditional,
    openDialogIngredients,
    complementSizeSelected,
    setComplementCategoryIdSelected,
    setComplementIdSelected,
  } = useProductPizza();

  return (
    <div>
      {filteredProduct.complement_categories.map(category => (
        <section className={classes.category} key={category.id}>
          <ProductPizzaComplementHeader
            category={category}
            complementSizeSelected={complementSizeSelected}
            handleSearch={handleSearch}
          />
          {(category.is_pizza_size || complementSizeSelected.id) && (
            <ProductPizzaComplementItem
              category={category}
              productId={filteredProduct.id}
              handleClickPizzaComplements={handleClickPizzaComplements}
              complements={category.complements}
              setComplementCategoryIdSelected={setComplementCategoryIdSelected}
              setComplementIdSelected={setComplementIdSelected}
              openDialogAdditional={openDialogAdditional}
              openDialogIngredients={openDialogIngredients}
            />
          )}
        </section>
      ))}
    </div>
  );
};

export default ProductPizzaComplementCategories;
