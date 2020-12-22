import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { Product } from 'src/types/product';

const useStyles = makeStyles(theme => ({
  price: {
    fontWeight: 300,
  },
  oldPrice: {
    textDecoration: 'line-through',
  },
  specialPrice: {},
  productDescription: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 15,
    [theme.breakpoints.down('sm')]: {
      marginTop: 15,
    },
  },
}));

type ProductDetailDescriptionProps = {
  product: Product;
};

const ProductDetailDescription: React.FC<ProductDetailDescriptionProps> = ({ product }) => {
  const classes = useStyles();

  return (
    <div className={classes.productDescription}>
      <Typography variant="h6">{product.name}</Typography>
      <Typography>{product.description}</Typography>
      {product.promotion_activated && !!product.special_price && product.special_price > 0 ? (
        <>
          <Typography variant="body1" color="textSecondary" className={classes.oldPrice}>
            {product.formattedPrice}
          </Typography>
          <Typography variant="h6" color="secondary" className={classes.specialPrice}>
            {product.formattedSpecialPrice}
          </Typography>
        </>
      ) : (
        <Typography color="textSecondary" className={classes.price}>
          {product.formattedPrice}
        </Typography>
      )}
    </div>
  );
};

export default ProductDetailDescription;
