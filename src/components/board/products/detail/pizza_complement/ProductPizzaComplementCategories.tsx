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
  const { complementSizeSelected, product } = useProductPizza();

  return (
    <div>
      {product?.complement_categories.map(category => (
        <section className={classes.category} key={category.id}>
          <ProductPizzaComplementHeader category={category} complementSizeSelected={complementSizeSelected} />

          {(category.is_pizza_size || complementSizeSelected) && (
            <ProductPizzaComplementItem category={category} complements={category.complements} />
          )}
        </section>
      ))}
    </div>
  );
};

export default ProductPizzaComplementCategories;
