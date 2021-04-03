import React, { useEffect } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { Product } from 'src/types/product';
import { useSelector } from 'src/store/redux/selector';

const useStyles = makeStyles(theme => ({
  oldPrice: {
    textDecoration: 'line-through',
  },
  productDescription: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 15,
    [theme.breakpoints.down('sm')]: {
      marginTop: 15,
    },
  },
  priceContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 5,
    '& .special-price': {
      marginLeft: 15,
    },
  },
}));

type ProductDetailDescriptionProps = {
  product: Product;
};

const ProductDetailDescription: React.FC<ProductDetailDescriptionProps> = ({ product }) => {
  const classes = useStyles();
  const restaurant = useSelector(state => state.restaurant);

  useEffect(() => {
    gtag('event', 'view_item', {
      currency: 'BRL',
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          coupon: '',
          discount: 0,
          affiliation: restaurant?.name,
          item_brand: '',
          item_category: product.category.name,
          item_variant: '',
          price: product.price,
          currency: 'BRL',
          quantity: 1,
        },
      ],
      value: product.price,
    });
  }, [restaurant, product]);

  return (
    <div className={classes.productDescription}>
      <Typography variant="h6">{product.name}</Typography>
      <Typography>{product.description}</Typography>
      <div className={classes.priceContainer}>
        {product.promotion_activated && !!product.special_price && product.special_price > 0 ? (
          <>
            <Typography variant="body1" className={classes.oldPrice}>
              {product.formattedPrice}
            </Typography>
            <Typography variant="h5" color="primary" className="special-price">
              {product.formattedSpecialPrice}
            </Typography>
          </>
        ) : (
          product.price > 0 && <Typography variant="h5">{product.formattedPrice}</Typography>
        )}
      </div>
    </div>
  );
};

export default ProductDetailDescription;
