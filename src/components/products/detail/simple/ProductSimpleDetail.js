import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ProductViewIngredients from './ingredients/ProductSimpleIngredients';
import ProductViewAdditional from './additional/ProductSimpleAdditional';
import ProductDetailInputAnnotation from '../ProductDetailInputAnnotation';
import ProductDetailImage from '../ProductDetailImage';
import ProductDetailDescription from '../ProductDetailDescription';
import { useProduct } from '../hooks/useProduct';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    columnGap: '15px',
    maxHeight: '62vh',
    '@media (max-width: 1280px)': {
      maxHeight: '55vh',
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
      maxHeight: 'none',
      marginBottom: 15,
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
        {product.ingredients.length > 0 && (
          <ProductViewIngredients ingredients={product.ingredients} handleClickIngredient={handleClickIngredient} />
        )}
        {product.additional.length > 0 && (
          <ProductViewAdditional additional={product.additional} handleClickAdditional={handleClickAdditional} />
        )}
        <ProductDetailInputAnnotation product={product} setProduct={setProduct} />
      </div>
    </div>
  );
}
