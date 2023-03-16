import { Grid, makeStyles, TextField } from '@material-ui/core';
import { ChangeEvent, Dispatch, FC, SetStateAction } from 'react';
import { Product } from 'types/product';

const useStyles = makeStyles({
  annotationContainer: {
    marginTop: 15,
    marginBottom: 30,
  },
});

type ProductDetailInputAnnotionProps = {
  setProduct?: Dispatch<SetStateAction<Product | null>>;
  product: Product | null;
};

const ProductDetailInputAnnotation: FC<ProductDetailInputAnnotionProps> = ({ setProduct, product }) => {
  const classes = useStyles();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (!setProduct) {
      return;
    }

    setProduct(state => {
      if (!state) {
        return null;
      }

      return {
        ...state,
        annotation: event.target.value,
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
        value={product?.annotation ?? ''}
        onChange={handleChange}
      />
    </Grid>
  );
};

export default ProductDetailInputAnnotation;
