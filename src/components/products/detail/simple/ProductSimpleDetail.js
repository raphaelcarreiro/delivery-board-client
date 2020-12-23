import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ProductViewIngredients from './ProductSimpleIngredients';
import ProductViewAdditional from './ProductSimpleAdditional';
import ProductDetailInputAnnotation from '../ProductDetailInputAnnotation';
import ProductDetailImage from '../ProductDetailImage';
import ProductDetailDescription from '../ProductDetailDescription';
import { useProduct } from '../hooks/useProduct';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    marginBottom: 20,
    maxHeight: '60vh',
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
      maxHeight: 'none',
    },
  },
  options: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: 3,
    },
    [theme.breakpoints.down('sm')]: {
      overflowY: 'unset',
    },
  },
}));

export default function ProductSimpleDetail() {
  const classes = useStyles();
  const { product, handleClickAdditional, handleClickIngredient, setProduct } = useProduct();

  return (
    <div className={classes.container}>
      <ProductDetailImage product={product} />
      <div className={classes.options}>
        <ProductDetailDescription product={product} />
        {product.additional.length > 0 && (
          <ProductViewAdditional additional={product.additional} handleClickAdditional={handleClickAdditional} />
        )}
        {product.ingredients.length > 0 && (
          <ProductViewIngredients ingredients={product.ingredients} handleClickIngredient={handleClickIngredient} />
        )}
        <ProductDetailInputAnnotation product={product} setProduct={setProduct} />
      </div>
    </div>
  );
}
