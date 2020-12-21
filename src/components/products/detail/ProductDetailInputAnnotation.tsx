import React from 'react';
import { Grid, makeStyles, TextField } from '@material-ui/core';
import { Product } from 'src/types/product';

const useStyles = makeStyles({
  annotationContainer: {
    marginTop: 15,
  },
});

type ProductDetailInputAnnotionProps = {
  setProduct(product: Product): void;
  product: Product;
};

const ProductDetailInputAnnotation: React.FC<ProductDetailInputAnnotionProps> = ({ setProduct, product }) => {
  const classes = useStyles();
  return (
    <Grid item xs={12} className={classes.annotationContainer}>
      <TextField
        variant="outlined"
        multiline
        rows={4}
        label="Tem alguma observação?"
        placeholder="Por exemplo, carne do hamburguer bem passada"
        fullWidth
        margin="normal"
        value={product.annotation}
        onChange={event => {
          setProduct({ ...product, annotation: event.target.value });
        }}
      />
    </Grid>
  );
};

export default ProductDetailInputAnnotation;
