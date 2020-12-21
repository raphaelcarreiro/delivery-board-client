import { makeStyles, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import ImagePreview from 'src/components/image-preview/ImagePreview';
import { Product } from 'src/types/product';

const useStyles = makeStyles(theme => ({
  imageContainer: {
    width: 200,
    minHeight: 100,
    maxHeight: 200,
    marginRight: 20,
    marginBottom: 10,
    borderRadius: 4,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
      marginRight: 0,
    },
  },
  imageWrapper: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      marginBottom: 15,
    },
  },
  image: {
    width: '100%',
    cursor: 'zoom-in',
    borderRadius: 4,
  },
  productData: {
    marginBottom: 15,
    marginTop: 10,
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap',
    },
  },
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
  },
}));

type ProductDetailProps = {
  product: Product;
};

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const classes = useStyles();
  const [imagePreview, setImagePreview] = useState(false);

  return (
    <>
      {imagePreview && product.image && (
        <ImagePreview src={product.image.imageUrl} description={product.name} onExited={() => setImagePreview(false)} />
      )}
      <div className={classes.productData}>
        <div className={classes.imageWrapper}>
          <div className={classes.imageContainer}>
            <img
              onClick={() => setImagePreview(true)}
              className={classes.image}
              src={product.image && product.image.imageUrl}
              alt={product.name}
            />
          </div>
        </div>
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
      </div>
    </>
  );
};

export default ProductDetail;
