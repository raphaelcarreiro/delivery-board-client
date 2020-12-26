import { makeStyles } from '@material-ui/core';
import React, { useState } from 'react';
import ImagePreview from 'src/components/image-preview/ImagePreview';
import { Product } from 'src/types/product';

const useStyles = makeStyles(theme => ({
  imageContainer: {
    width: 590,
    maxHeight: 590,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    overflow: 'hidden',
    [theme.breakpoints.down('lg')]: {
      width: 560,
      maxHeight: 560,
    },
    [theme.breakpoints.down('sm')]: {
      marginRight: 0,
      width: '100%',
    },
  },
  imageWrapper: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    cursor: 'pointer',
  },
}));

type ProductDetailImageProps = {
  product: Product;
};

const ProductDetailImage: React.FC<ProductDetailImageProps> = ({ product }) => {
  const classes = useStyles();
  const [imagePreview, setImagePreview] = useState(false);

  return (
    <>
      {imagePreview && product.image && (
        <ImagePreview src={product.image.imageUrl} description={product.name} onExited={() => setImagePreview(false)} />
      )}
      <div className={classes.imageWrapper}>
        <div className={classes.imageContainer}>
          {product.image && (
            <img
              onClick={() => setImagePreview(true)}
              className={classes.image}
              src={product.image.imageUrl}
              alt={product.name}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetailImage;
