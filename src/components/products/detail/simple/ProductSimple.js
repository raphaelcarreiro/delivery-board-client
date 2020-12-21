import React, { useState, useEffect, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ProductViewIngredients from './ProductSimpleIngredients';
import ProductViewAdditional from './ProductSimpleAdditional';
import { Grid } from '@material-ui/core';
import CustomDialog from 'src/components/dialog/CustomDialog';
import { moneyFormat } from 'src/helpers/numberFormat';
import InsideLoading from 'src/components/loading/InsideLoading';
import { useProducts } from 'src/components/products/hooks/useProducts';
import ProductAdd from '../ProductAdd';
import { fetchSimpleProduct } from './fetchSimpleProduct';
import ProductDetail from '../ProductDetail';
import ProductDetailInputAnnotation from '../ProductDetailInputAnnotation';

const useStyles = makeStyles(theme => ({
  container: {
    marginBottom: 0,
  },
}));

export default function ProductSimple() {
  const [amount, setAmount] = useState(1);
  const [additionalPrice, setAdditionalPrice] = useState(0);
  const classes = useStyles();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { selectedProduct, handlePrepareProduct, handleSelectProduct } = useProducts();

  const formattedTotal = useMemo(() => {
    if (!product) return moneyFormat(0);
    const productPrice = product.promotion_activated && product.special_price ? product.special_price : product.price;
    const total = (productPrice + additionalPrice) * amount;
    return moneyFormat(total);
  }, [additionalPrice, amount, product]);

  useEffect(() => {
    fetchSimpleProduct(selectedProduct.id)
      .then(product => {
        setProduct(product);
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [selectedProduct]);

  useEffect(() => {
    if (product) {
      setAdditionalPrice(
        product.additional.reduce(
          (value, additional) => (additional.selected ? value + additional.price * additional.amount : value),
          0
        )
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

  function handleClickAdditional(additionalId, amount) {
    setProduct({
      ...product,
      additional: product.additional.map(additional => {
        if (additional.id === additionalId) {
          additional.selected = amount > 0;
          additional.amount = amount;
        }
        return additional;
      }),
    });
  }

  return (
    <CustomDialog
      maxWidth="sm"
      title="adicionar ao carrinho"
      backgroundColor="#fafafa"
      handleModalState={() => handleSelectProduct(null)}
      displayBottomActions
    >
      {loading ? (
        <InsideLoading />
      ) : (
        <>
          <Grid container className={classes.container} justify="center">
            <Grid item xs={12}>
              <ProductDetail product={product} />
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
              <ProductDetailInputAnnotation product={product} setProduct={setProduct} />
            </Grid>
          </Grid>
          <ProductAdd
            total={formattedTotal}
            handleAmountDown={handleAmountDown}
            handleAmountUp={handleAmountUp}
            product={product}
            amount={amount}
          />
        </>
      )}
    </CustomDialog>
  );
}
