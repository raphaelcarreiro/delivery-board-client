import React, { useState, useEffect, useMemo } from 'react';
import CustomDialog from 'src/components/dialog/CustomDialog';
import ProductPizzaComplementAdditional from 'src/components/products/detail/pizza_complement/ProductPizzaComplementAdditional';
import ProductPizzaComplementIngredient from 'src/components/products/detail/pizza_complement/ProductPizzaComplementIngredient';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useMessaging } from 'src/hooks/messaging';
import { handleSelectPizzaProductComplement } from 'src/components/products/detail/pizza_complement/handleSelectPizzaProductComplement';
import { calculatePizzaProductComplementPrice } from 'src/components/products/detail/pizza_complement/calculatePizzaProductComplementsPrice';
import { useCart } from '../../../hooks/useCart';
import CartProductUpdate from '../CartProductUpdate';
import { moneyFormat } from 'src/helpers/numberFormat';
import { handleSearchComplement } from 'src/components/products/detail/pizza_complement/handleSearchComplement';
import { ProductPizzaProvider } from 'src/components/products/detail/hooks/useProductPizza';
import ProductPizzaDetail from 'src/components/products/detail/pizza_complement/ProductPizzaDetail';

ProductPizzaComplement.propTypes = {
  onExited: PropTypes.func.isRequired,
};

export default function ProductPizzaComplement({ onExited }) {
  const messaging = useMessaging();
  const restaurant = useSelector(state => state.restaurant);
  const cart = useCart();
  const [amount, setAmount] = useState(cart.selectedProduct.amount);
  const [product, setProduct] = useState(JSON.parse(JSON.stringify(cart.selectedProduct)));
  const [filteredProduct, setFilteredProduct] = useState(product);
  const [complementsPrice, setComplementsPrice] = useState(0);
  const [dialogIngredients, setDialogIngredients] = useState(false);
  const [dialogAdditional, setDialogAdditional] = useState(false);
  const [complementIdSelected, setComplementIdSelected] = useState(null);
  const [complementCategoryIdSelected, setComplementCategoryIdSelected] = useState(null);
  const [searchedCategoryId, setSearchedCategoryId] = useState(null);
  const [searchedValue, setSearchedValue] = useState('');

  const categoryComplementSize = useMemo(() => product.complement_categories.find(category => category.is_pizza_size), [
    product,
  ]);

  const complementSizeSelected = useMemo(
    () => categoryComplementSize.complements.find(complement => complement.selected),
    [categoryComplementSize]
  );

  const formattedTotal = useMemo(() => {
    if (!product) return moneyFormat(0);
    const total = (complementsPrice + product.product_price) * amount;
    return moneyFormat(total);
  }, [amount, complementsPrice, product]);

  useEffect(() => {
    if (!restaurant) return;
    const price = calculatePizzaProductComplementPrice(product, restaurant);

    setComplementsPrice(price);
  }, [product, restaurant]);

  useEffect(() => {
    setFilteredProduct(product);
  }, [product]);

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
      const { newProduct } = handleSelectPizzaProductComplement(product, complementCategoryId, complementId);

      setProduct(newProduct);
      handleSearch(searchedCategoryId, searchedValue);
    } catch (err) {
      messaging.handleOpen(err.message);
    }
  }

  function handleSearch(categoryId, searchValue) {
    setSearchedValue(searchValue);

    if (searchValue === '') {
      setFilteredProduct(product);
      setSearchedCategoryId(null);
      return;
    }

    setSearchedCategoryId(categoryId);

    const newProduct = handleSearchComplement(product, searchValue, categoryId);

    setFilteredProduct(newProduct);
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
      handleModalState={onExited}
      title={`${product.name} - Complementos`}
      displayBottomActions
      maxWidth="lg"
      height="80vh"
    >
      {dialogAdditional && <ProductPizzaComplementAdditional onExited={() => setDialogAdditional(false)} />}
      {dialogIngredients && <ProductPizzaComplementIngredient onExited={() => setDialogIngredients(false)} />}
      <ProductPizzaProvider value={productPizzaContextValue}>
        <ProductPizzaDetail />
      </ProductPizzaProvider>
      <CartProductUpdate
        product={product}
        handleAmountDown={handleAmountDown}
        handleAmountUp={handleAmountUp}
        total={formattedTotal}
        amount={amount}
      />
    </CustomDialog>
  );
}
