import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ProductDetailInputAnnotation from '../ProductDetailInputAnnotation';
import ProductDetailImage from '../ProductDetailImage';
import ProductDetailDescription from '../ProductDetailDescription';
import { useProductPizza } from '../hooks/useProductPizza';
import ProductPizzaComplementCategories from './ProductPizzaComplementCategories';

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

export default function ProductPizzaDetail() {
  const classes = useStyles();
  const { product, setProduct } = useProductPizza();

  return (
    <div className={classes.container}>
      <ProductDetailImage product={product} />
      <div className={classes.options}>
        <ProductDetailDescription product={product} />
        <ProductPizzaComplementCategories />
        <ProductDetailInputAnnotation product={product} setProduct={setProduct} />
      </div>
    </div>
  );
}
