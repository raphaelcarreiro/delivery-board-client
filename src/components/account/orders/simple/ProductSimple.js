import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, TextField } from '@material-ui/core';
import ProductSimpleAdditional from './ProductSimpleAdditional';
import ProductSimpleIngredients from './ProductSimpleIngredients';
import ImagePreview from 'src/components/image-preview/ImagePreview';
import PropTypes from 'prop-types';
import CustomDialog from 'src/components/dialog/CustomDialog';

const useStyles = makeStyles(theme => ({
  imageContainer: {
    width: 200,
    maxHeight: 300,
    marginRight: 20,
    marginBottom: 10,
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 195,
    backgroundColor: '#eee',
    borderRadius: 4,
    cursor: 'zoom-in',
  },
  container: {
    marginBottom: 0,
  },
  icon: {
    backgroundColor: '#fff',
    borderRadius: '50%',
    position: 'absolute',
    right: 15,
  },
  complementName: {
    fontWeight: 400,
  },
  price: {
    fontWeight: 500,
  },
  productData: {
    marginBottom: 15,
  },
  annotationContainer: {
    marginTop: 15,
  },
  imageWrapper: {
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      marginBottom: 15,
    },
  },
}));

ProductSimple.propTypes = {
  onExited: PropTypes.func.isRequired,
  selectedProduct: PropTypes.object.isRequired,
  handleUpdateCartProduct: PropTypes.func.isRequired,
};

export default function ProductSimple({ onExited, selectedProduct, handleUpdateCartProduct }) {
  const [amount, setAmount] = useState(selectedProduct.amount);
  const [product, setProduct] = useState(JSON.parse(JSON.stringify(selectedProduct)));
  const [additionalPrice, setAdditionalPrice] = useState(0);
  const [imagePreview, setImagePreview] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    setAdditionalPrice(
      product.additional.reduce((value, additional) => (additional.selected ? value + additional.price : value), 0)
    );
    // eslint-disable-next-line
  }, [product.additional]);

  function handleAmountUp() {
    setAmount(amount + 1);
  }

  function handleAmountDown() {
    if (amount > 1) {
      setAmount(amount - 1);
    }
  }

  function handleClickIngredient(ingredientId) {
    setProduct({
      ...product,
      ingredient: product.ingredients.map(ingredient => {
        if (ingredient.id === ingredientId) ingredient.selected = !ingredient.selected;
        return ingredient;
      }),
    });
  }

  function handleClickAdditional(additionalId) {
    setProduct({
      ...product,
      additional: product.additional.map(additional => {
        if (additional.id === additionalId) additional.selected = !additional.selected;
        return additional;
      }),
    });
  }

  function handleUpdateClick() {
    handleUpdateCartProduct(product, amount);
  }

  function handleImagePreview() {
    setImagePreview(!imagePreview);
  }

  return (
    <CustomDialog title="Atualizar produto" backgroundColor="#fafafa" handleModalState={onExited}>
      {imagePreview && product.image && (
        <ImagePreview src={product.image.imageUrl} description={product.name} onExited={handleImagePreview} />
      )}
      <Grid container className={classes.container}>
        <Grid item xs={12}>
          <Grid item xs={12} container direction="row" className={classes.productData}>
            <div className={classes.imageWrapper}>
              <div className={classes.imageContainer}>
                <img
                  onClick={handleImagePreview}
                  className={classes.image}
                  src={product.image && product.image.imageUrl}
                  alt={product.name}
                />
              </div>
            </div>
            <div>
              <Typography color="primary" variant="caption" display="block">
                Produto {product.id}
              </Typography>
              <Typography variant="h6">{product.name}</Typography>
              <Typography>{product.description}</Typography>
              <Typography color="textSecondary">{product.formattedProductPrice}</Typography>
            </div>
          </Grid>
          <Grid item xs={12}>
            {product.additional.length > 0 && (
              <ProductSimpleAdditional additional={product.additional} handleClickAdditional={handleClickAdditional} />
            )}
          </Grid>
          <Grid item xs={12}>
            {product.ingredients.length > 0 && (
              <ProductSimpleIngredients
                ingredients={product.ingredients}
                handleClickIngredient={handleClickIngredient}
              />
            )}
          </Grid>
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
        </Grid>
      </Grid>
    </CustomDialog>
  );
}
