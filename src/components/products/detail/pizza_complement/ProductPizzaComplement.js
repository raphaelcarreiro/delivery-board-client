import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ProductPizzaComplementItem from './ProductPizzaComplementItem';
import ProductPizzaComplementAdditional from './ProductPizzaComplementAdditional';
import ProductPizzaComplementIngredient from './ProductPizzaComplementIngredient';
import { moneyFormat } from '../../../../helpers/numberFormat';
import CustomDialog from 'src/components/dialog/CustomDialog';
import ProductPizzaComplementHeader from './ProductPizzaComplementHeader';
import { useSelector } from 'react-redux';
import InsideLoading from 'src/components/loading/InsideLoading';
import { useMessaging } from 'src/hooks/messaging';
import { useProducts } from 'src/components/products/hooks/useProducts';
import ProductAdd from '../ProductAdd';
import { fetchPizzaProduct } from './fetchPizzaProduct';
import { handleSelectPizzaProductComplement } from './handleSelectPizzaProductComplement';
import { calculatePizzaProductComplementPrice } from './calculatePizzaProductComplementsPrice';
import ProductDetail from '../ProductDetail';
import ProductDetailInputAnnotation from '../ProductDetailInputAnnotation';
import { handleSearchComplement } from './handleSearchComplement';

const useStyles = makeStyles({
  category: {
    display: 'block',
    marginBottom: 10,
  },
  container: {
    marginBottom: 0,
  },
});

export default function ProductPizzaComplement() {
  const classes = useStyles();
  const [amount, setAmount] = useState(1);
  const [product, setProduct] = useState(null);
  const [filteredProduct, setFilteredProduct] = useState(null);
  const [complementsPrice, setComplementsPrice] = useState(0);
  const [dialogIngredients, setDialogIngredients] = useState(false);
  const [dialogAdditional, setDialogAdditional] = useState(false);
  const [complementIdSelected, setComplementIdSelected] = useState(null);
  const [complementCategoryIdSelected, setComplementCategoryIdSelected] = useState(null);
  const [complementSizeSelected, setComplementSizeSelected] = useState({});
  const messaging = useMessaging();
  const restaurant = useSelector(state => state.restaurant);
  const [searchedCategoryId, setSearchedCategoryId] = useState(null);
  const [searchedValue, setSearchedValue] = useState('');
  const [loading, setLoading] = useState(true);
  const { handlePrepareProduct, selectedProduct, handleSelectProduct } = useProducts();

  const formattedTotal = useMemo(() => {
    if (!product) return moneyFormat(0);
    const total = (complementsPrice + product.price) * amount;
    return moneyFormat(total);
  }, [amount, complementsPrice, product]);

  const handleSearch = useCallback(
    (categoryId, searchValue) => {
      setSearchedValue(searchValue);

      if (searchValue === '') {
        setFilteredProduct(product);
        setSearchedCategoryId(null);
        return;
      }

      setSearchedCategoryId(categoryId);

      const newProduct = handleSearchComplement(product, searchValue, categoryId);

      setFilteredProduct(newProduct);
    },
    [product]
  );

  useEffect(() => {
    fetchPizzaProduct(selectedProduct.id)
      .then(payload => {
        setProduct(payload.product);
        setComplementSizeSelected(payload.sizeSelected);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedProduct]);

  useEffect(() => {
    handleSearch(searchedCategoryId, searchedValue);
  }, [handleSearch, searchedCategoryId, searchedValue]);

  useEffect(() => {
    if (!product) return;
    handlePrepareProduct(product, amount);
  }, [amount, product, handlePrepareProduct]);

  useEffect(() => {
    if (!product || !restaurant) return;

    const _complementsPrice = calculatePizzaProductComplementPrice(product, restaurant);

    setComplementsPrice(_complementsPrice);
  }, [product, restaurant]);

  function handleAmountUp() {
    if (!product.ready) {
      messaging.handleOpen('Você precisa selecionar os itens obrigatórios');
      return;
    }
    setAmount(amount + 1);
  }

  function handleAmountDown() {
    if (!product.ready) {
      messaging.handleOpen('Você precisa selecionar os itens obrigatórios');
      return;
    }
    if (amount > 1) {
      setAmount(amount - 1);
    }
  }

  function handleClickPizzaComplements(productId, complementCategoryId, complementId) {
    try {
      const { newProduct, sizeSelected } = handleSelectPizzaProductComplement(
        product,
        complementCategoryId,
        complementId
      );

      setProduct(newProduct);
      handleSearch(searchedCategoryId, searchedValue);
      setComplementSizeSelected(sizeSelected);

      if (newProduct.ready) handlePrepareProduct(newProduct);
    } catch (err) {
      messaging.handleOpen(err.message);
    }
  }

  function handleScroll(e) {
    product.complement_categories.forEach(category => {
      const el = document.getElementById(`complement-category-${category.id}`);
      if (!el) return;
      const bounds = el.getBoundingClientRect();
      console.log(bounds);
      if (bounds.y <= 93) {
        el.style.position = 'sticky';
        el.style.top = '15px';
        el.style.right = '15px';
        el.style.left = '15px';
        el.style.background = '#fafafa';
        el.style.zIndex = 100;
      } else el.removeAttribute('style');
    });
  }

  return (
    <CustomDialog
      backgroundColor="#fafafa"
      handleModalState={() => handleSelectProduct(null)}
      title={`adicionar ao carrinho`}
      displayBottomActions
      maxWidth="sm"
    >
      {dialogAdditional && (
        <ProductPizzaComplementAdditional
          onExited={() => setDialogAdditional(false)}
          product={product}
          complementIdSelected={complementIdSelected}
          complementCategoryIdSelected={complementCategoryIdSelected}
          setProduct={setProduct}
        />
      )}
      {dialogIngredients && (
        <ProductPizzaComplementIngredient
          onExited={() => setDialogIngredients(false)}
          complementIdSelected={complementIdSelected}
          complementCategoryIdSelected={complementCategoryIdSelected}
          product={product}
          setProduct={setProduct}
        />
      )}
      {loading ? (
        <InsideLoading />
      ) : (
        <>
          <Grid container className={classes.container} justify="center">
            <Grid item xs={12}>
              <ProductDetail product={product} />
            </Grid>
            <Grid item xs={12}>
              {filteredProduct.complement_categories.map(category => (
                <section className={classes.category} key={category.id}>
                  <ProductPizzaComplementHeader
                    category={category}
                    complementSizeSelected={complementSizeSelected}
                    handleSearch={handleSearch}
                  />
                  {(category.is_pizza_size || complementSizeSelected.id) && (
                    <ProductPizzaComplementItem
                      category={category}
                      productId={product.id}
                      handleClickPizzaComplements={handleClickPizzaComplements}
                      complements={category.complements}
                      setComplementCategoryIdSelected={setComplementCategoryIdSelected}
                      setComplementIdSelected={setComplementIdSelected}
                      openDialogAdditional={() => setDialogAdditional(true)}
                      openDialogIngredients={() => setDialogIngredients(true)}
                    />
                  )}
                </section>
              ))}
            </Grid>
            <ProductDetailInputAnnotation product={product} setProduct={setProduct} />
          </Grid>
          <ProductAdd
            amount={amount}
            handleAmountDown={handleAmountDown}
            handleAmountUp={handleAmountUp}
            product={product}
            total={formattedTotal}
          />
        </>
      )}
    </CustomDialog>
  );
}
