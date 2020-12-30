import React, { useState, useEffect, useMemo } from 'react';
import CustomDialog from 'src/components/dialog/CustomDialog';
import { moneyFormat } from 'src/helpers/numberFormat';
import InsideLoading from 'src/components/loading/InsideLoading';
import { useProducts } from 'src/components/products/hooks/useProducts';
import ProductAdd from '../addToCart/ProductAdd';
import { fetchSimpleProduct } from './fetchSimpleProduct';
import ProductSimpleDetail from './ProductSimpleDetail';
import { ProductSimpleProvider } from '../hooks/useProduct';

export default function ProductSimple() {
  const [amount, setAmount] = useState(1);
  const [additionalPrice, setAdditionalPrice] = useState(0);
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

  const productSimpleContext = {
    handleClickAdditional,
    handleClickIngredient,
    product,
    setProduct,
  };

  return (
    <CustomDialog
      maxWidth="lg"
      title="adicionar ao carrinho"
      backgroundColor="#fafafa"
      handleModalState={() => handleSelectProduct(null)}
      displayBottomActions
      height="80vh"
    >
      {loading ? (
        <InsideLoading />
      ) : (
        <>
          <ProductSimpleProvider value={productSimpleContext}>
            <ProductSimpleDetail />
          </ProductSimpleProvider>
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
