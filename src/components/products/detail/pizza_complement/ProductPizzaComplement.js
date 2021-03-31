import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ProductPizzaComplementAdditional from './ProductPizzaComplementAdditional';
import ProductPizzaComplementIngredient from './ProductPizzaComplementIngredient';
import { moneyFormat } from '../../../../helpers/numberFormat';
import CustomDialog from 'src/components/dialog/CustomDialog';
import { useSelector } from 'react-redux';
import InsideLoading from 'src/components/loading/InsideLoading';
import { useMessaging } from 'src/hooks/messaging';
import { useProducts } from 'src/components/products/hooks/useProducts';
import ProductAdd from '../addToCart/ProductAdd';
import { fetchPizzaProduct } from './fetchPizzaProduct';
import { handleSelectPizzaProductComplement } from './handleSelectPizzaProductComplement';
import { calculatePizzaProductComplementPrice } from './calculatePizzaProductComplementsPrice';
import { handleSearchComplement } from './handleSearchComplement';
import { ProductPizzaProvider } from '../hooks/useProductPizza';
import ProductPizzaDetail from './ProductPizzaDetail';

export default function ProductPizzaComplement() {
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
    const productPrice = product.promotion_activated && product.special_price ? product.special_price : product.price;
    const total = (complementsPrice + productPrice) * amount;
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

  const productPizzaContextValue = {
    product,
    setProduct,
    filteredProduct,
    handleClickPizzaComplements,
    openDialogAdditional: () => setDialogAdditional(true),
    openDialogIngredients: () => setDialogIngredients(true),
    setComplementCategoryIdSelected,
    setComplementIdSelected,
    complementCategoryIdSelected,
    complementIdSelected,
    complementSizeSelected,
    handleSearch,
  };

  return (
    <CustomDialog
      backgroundColor="#fafafa"
      handleModalState={() => handleSelectProduct(null)}
      title={`adicionar ao carrinho`}
      displayBottomActions
      maxWidth="lg"
      height="80vh"
    >
      <ProductPizzaProvider value={productPizzaContextValue}>
        {dialogAdditional && <ProductPizzaComplementAdditional onExited={() => setDialogAdditional(false)} />}
        {dialogIngredients && <ProductPizzaComplementIngredient onExited={() => setDialogIngredients(false)} />}
      </ProductPizzaProvider>
      {loading ? (
        <InsideLoading />
      ) : (
        <>
          <ProductPizzaProvider value={productPizzaContextValue}>
            <ProductPizzaDetail />
          </ProductPizzaProvider>
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
