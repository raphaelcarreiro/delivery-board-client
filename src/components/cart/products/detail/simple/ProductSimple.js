import React, { useState, useEffect, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import ProductSimpleAdditional from 'src/components/products/detail/simple/ProductSimpleAdditional';
import ProductSimpleIngredients from 'src/components/products/detail/simple/ProductSimpleIngredients';
import PropTypes from 'prop-types';
import CustomDialog from 'src/components/dialog/CustomDialog';
import { useCart } from '../../../hooks/useCart';
import CartProductUpdate from '../CartProductUpdate';
import { moneyFormat } from 'src/helpers/numberFormat';
import ProductDetail from 'src/components/products/detail/ProductDetail';
import ProductDetailInputAnnotation from 'src/components/products/detail/ProductDetailInputAnnotation';

const useStyles = makeStyles(theme => ({
  container: {
    marginBottom: 0,
  },
}));

ProductSimple.propTypes = {
  onExited: PropTypes.func.isRequired,
};

export default function ProductSimple({ onExited }) {
  const { selectedProduct } = useCart();
  const [amount, setAmount] = useState(selectedProduct.amount);
  const [product, setProduct] = useState(JSON.parse(JSON.stringify(selectedProduct)));
  const [additionalPrice, setAdditionalPrice] = useState(0);
  const classes = useStyles();

  const formattedTotal = useMemo(() => {
    if (!product) return moneyFormat(0);
    const productPrice =
      product.promotion_activated && product.special_price ? product.special_price : product.product_price;
    const total = (productPrice + additionalPrice) * amount;
    return moneyFormat(total);
  }, [additionalPrice, amount, product]);

  useEffect(() => {
    setAdditionalPrice(
      product.additional.reduce(
        (value, additional) => (additional.selected ? value + additional.price * additional.amount : value),
        0
      )
    );
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
      title="Atualizar produto"
      backgroundColor="#fafafa"
      handleModalState={onExited}
      displayBottomActions
    >
      <Grid container className={classes.container}>
        <Grid item xs={12}>
          <ProductDetail product={product} />
        </Grid>
        <Grid item xs={12}>
          {product.additional.length > 0 && (
            <ProductSimpleAdditional additional={product.additional} handleClickAdditional={handleClickAdditional} />
          )}
        </Grid>
        <Grid item xs={12}>
          {product.ingredients.length > 0 && (
            <ProductSimpleIngredients ingredients={product.ingredients} handleClickIngredient={handleClickIngredient} />
          )}
        </Grid>
        <ProductDetailInputAnnotation product={product} setProduct={setProduct} />
      </Grid>
      <CartProductUpdate
        handleAmountDown={handleAmountDown}
        amount={amount}
        handleAmountUp={handleAmountUp}
        product={product}
        total={formattedTotal}
      />
    </CustomDialog>
  );
}
