import { FC, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { Product } from 'src/types/product';
import ImagePreview from 'src/components/image-preview/ImagePreview';

const useStyles = makeStyles(theme => ({
  imageContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrapper: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    cursor: 'pointer',
    maxWidth: 590,
    maxHeight: 590,
    width: '100%',
    objectFit: 'contain',
    [theme.breakpoints.down('sm')]: {
      maxWidth: 400,
    },
  },
}));

type ProductDetailImageProps = {
  product: Product | null;
};

const ProductDetailImage: FC<ProductDetailImageProps> = ({ product }) => {
  const classes = useStyles();
  const [imagePreview, setImagePreview] = useState(false);

  return (
    <>
      {imagePreview && product?.image && (
        <ImagePreview src={product.image.imageUrl} description={product.name} onExited={() => setImagePreview(false)} />
      )}

      <div className={classes.imageWrapper}>
        <div className={classes.imageContainer}>
          {product?.image && (
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
