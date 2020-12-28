import { makeStyles } from '@material-ui/core';
import React, { useState } from 'react';
import ImagePreview from 'src/components/image-preview/ImagePreview';
import { useApp } from 'src/hooks/app';
import { Product } from 'src/types/product';

const useStyles = makeStyles(theme => ({
  imageContainer: (props: { windowWidth: number }) => ({
    width: 590,
    maxHeight: 590,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    [theme.breakpoints.between('md', 'lg')]: {
      width: props.windowWidth * 0.3,
      maxHeight: props.windowWidth * 0.3,
    },
    [theme.breakpoints.down('sm')]: {
      marginRight: 0,
      width: '100%',
      maxHeight: props.windowWidth - 30,
    },
  }),
  imageWrapper: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  const { windowWidth } = useApp();
  const classes = useStyles({ windowWidth });
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
