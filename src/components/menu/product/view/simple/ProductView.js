import React, { useState, useEffect, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ProductViewIngredients from './ProductViewIngredients';
import ProductViewAdditional from './ProductViewAdditional';
import ProductViewAction from './ProductViewAction';
import { Grid, Typography, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import CustomDialog from 'src/components/dialog/CustomDialog';
import { moneyFormat } from 'src/helpers/numberFormat';
import ImagePreview from 'src/components/image-preview/ImagePreview';
import { api } from 'src/services/api';
import InsideLoading from 'src/components/loading/InsideLoading';

const useStyles = makeStyles(theme => ({
  imageContainer: {
    width: 200,
    maxHeight: 200,
    minHeight: 100,
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
  image: {
    width: '100%',
    cursor: 'zoom-in',
    borderRadius: 4,
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
  productData: {
    marginBottom: 15,
    marginTop: 10,
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap',
    },
  },
  annotationContainer: {
    marginTop: 15,
  },
  imageWrapper: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      marginBottom: 15,
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

ProductView.propTypes = {
  onExited: PropTypes.func.isRequired,
  handlePrepareProduct: PropTypes.func.isRequired,
  handleAddProductToCart: PropTypes.func.isRequired,
  productId: PropTypes.number.isRequired,
};

export default function ProductView({ onExited, handlePrepareProduct, handleAddProductToCart, productId }) {
  const [amount, setAmount] = useState(1);
  const [product, setProduct] = useState(null);
  const [additionalPrice, setAdditionalPrice] = useState(0);
  const [imagePreview, setImagePreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const classes = useStyles();

  useEffect(() => {
    api
      .get(`/products/${productId}`)
      .then(response => {
        const additional = response.data.additional.map(additional => {
          additional.selected = false;
          additional.additional_id = additional.id;
          additional.formattedPrice = additional.price ? moneyFormat(additional.price) : null;
          return additional;
        });

        const ingredients = response.data.ingredients.map(ingredient => {
          ingredient.ingredient_id = ingredient.id;
          ingredient.selected = true;
          return ingredient;
        });

        setProduct({
          ...response.data,
          formattedPrice: moneyFormat(response.data.price),
          formattedSpecialPrice: moneyFormat(response.data.special_price),
          additional,
          ingredients,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [productId]);

  const total = useMemo(() => {
    if (!product) return 0;
    const productPrice = product.promotion_activated && product.special_price ? product.special_price : product.price;
    const total = (productPrice + additionalPrice) * amount;
    return moneyFormat(total);
  }, [additionalPrice, amount, product]);

  useEffect(() => {
    if (product) {
      setAdditionalPrice(
        product.additional.reduce((value, additional) => (additional.selected ? value + additional.price : value), 0)
      );
      handlePrepareProduct(product, amount);
    }
  }, [product, amount, handlePrepareProduct]);

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

  function handleImagePreview() {
    setImagePreview(!imagePreview);
  }

  return (
    <CustomDialog title="adicionar produto" backgroundColor="#fafafa" handleModalState={onExited} displayBottomActions>
      {imagePreview && product.image && (
        <ImagePreview src={product.image.imageUrl} description={product.name} onExited={handleImagePreview} />
      )}
      {loading ? (
        <InsideLoading />
      ) : (
        <>
          <Grid container className={classes.container} justify="center">
            <Grid item xs={12}>
              <div className={classes.productData}>
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
                <div className={classes.productDescription}>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography>{product.description}</Typography>
                  {product.promotion_activated && product.special_price > 0 ? (
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
              <Grid item xs={12}>
                {product.additional.length > 0 && (
                  <ProductViewAdditional
                    additional={product.additional}
                    handleClickAdditional={handleClickAdditional}
                  />
                )}
              </Grid>
              <Grid item xs={12}>
                {product.ingredients.length > 0 && (
                  <ProductViewIngredients
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
          <ProductViewAction
            handleAmountDown={handleAmountDown}
            amount={amount}
            handleAmountUp={handleAmountUp}
            handleAddProductToCart={handleAddProductToCart}
            total={total}
            additionalPrice={additionalPrice}
          />
        </>
      )}
    </CustomDialog>
  );
}
