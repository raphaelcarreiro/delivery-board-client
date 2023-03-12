import React, { Dispatch, SetStateAction } from 'react';
import { Grid, makeStyles, TextField } from '@material-ui/core';
import { Product } from 'src/types/product';

const useStyles = makeStyles({
  annotationContainer: {
    marginTop: 15,
    marginBottom: 30,
  },
});

type ProductDetailInputAnnotionProps = {
  setProduct: Dispatch<SetStateAction<Product | null>>;
  product: Product | null;
};

const ProductDetailInputAnnotation: React.FC<ProductDetailInputAnnotionProps> = ({ setProduct, product }) => {
  const classes = useStyles();

  function handleChange(value: string) {
    setProduct(state => {
      if (!state) {
        return null;
      }

      return {
        ...state,
        annotation: value,
      };
    });
  }

  return (
    <Grid item xs={12} className={classes.annotationContainer}>
      <TextField
        variant="outlined"
        multiline
        minRows={4}
        label="Tem alguma observação?"
        placeholder="Por exemplo, carne do hamburguer bem passada"
        fullWidth
        value={product?.annotation || ''}
        onChange={event => handleChange(event.target.value)}
      />
    </Grid>
  );
};

export default ProductDetailInputAnnotation;
