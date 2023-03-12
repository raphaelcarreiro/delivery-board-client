import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ProductPizzaComplementAdditional from './ProductPizzaComplementAdditional';
import ProductPizzaComplementIngredient from './ProductPizzaComplementIngredient';
import ProductAdd from '../addToCart/ProductAdd';
import { fetchPizzaProduct } from './fetchPizzaProduct';
import { handleSelectPizzaProductComplement } from './handleSelectPizzaProductComplement';
import { handleSearchComplement } from './handleSearchComplement';
import { ProductPizzaProvider } from '../hooks/useProductPizza';
import ProductPizzaDetail from './ProductPizzaDetail';
import Modal from 'src/components/modal/Modal';
import { useProducts } from '../../hooks/useProducts';
import { Complement, Product } from 'src/types/product';
import { useMessaging } from 'src/providers/MessageProvider';
import { useSelector } from 'src/store/redux/selector';
import { moneyFormat } from 'src/helpers/numberFormat';
import { getPizzaComplementsPrice } from 'src/store/redux/modules/cart/cases/addProduct';
import InsideLoading from 'src/components/loading/InsideLoading';

const ProductPizzaComplement: React.FC = () => {
  const [amount, setAmount] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [filteredProduct, setFilteredProduct] = useState<Product | null>(null);
  const [complementsPrice, setComplementsPrice] = useState(0);
  const [dialogIngredients, setDialogIngredients] = useState(false);
  const [dialogAdditional, setDialogAdditional] = useState(false);
  const [complementIdSelected, setComplementIdSelected] = useState<number | null>(null);
  const [complementCategoryIdSelected, setComplementCategoryIdSelected] = useState<number | null>(null);
  const [complementSizeSelected, setComplementSizeSelected] = useState<Complement | null>(null);
  const messaging = useMessaging();
  const restaurant = useSelector(state => state.restaurant);
  const [searchedCategoryId, setSearchedCategoryId] = useState<number | null>(null);
  const [searchedValue, setSearchedValue] = useState('');
  const [loading, setLoading] = useState(true);
  const { selectedProduct, handleSelectProduct } = useProducts();

  const formattedTotal = useMemo(() => {
    if (!product) {
      return moneyFormat(0);
    }

    const productPrice = product.promotion_activated && product.special_price ? product.special_price : product.price;
    const total = (complementsPrice + productPrice) * amount;
    return moneyFormat(total);
  }, [amount, complementsPrice, product]);

  const handleSearch = useCallback(
    (categoryId: number, searchValue: string) => {
      setSearchedValue(searchValue);

      if (searchValue === '') {
        setFilteredProduct(product);
        setSearchedCategoryId(null);
        return;
      }

      setSearchedCategoryId(categoryId);

      if (!product) {
        return;
      }

      const newProduct = handleSearchComplement(product, searchValue, categoryId);

      setFilteredProduct(newProduct);
    },
    [product]
  );

  useEffect(() => {
    if (!selectedProduct) {
      return;
    }

    fetchPizzaProduct(selectedProduct?.id)
      .then(payload => {
        setProduct(payload.product);
        setFilteredProduct(payload.product);
        setComplementSizeSelected(payload.sizeSelected);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedProduct]);

  useEffect(() => {
    if (!product || !restaurant) return;

    const _complementsPrice = getPizzaComplementsPrice(product.complement_categories, restaurant.configs);

    setComplementsPrice(_complementsPrice);
  }, [product, restaurant]);

  function handleAmountUp() {
    if (!product?.ready) {
      messaging.handleOpen('Você precisa selecionar os itens obrigatórios');
      return;
    }
    setAmount(amount + 1);
  }

  function handleAmountDown() {
    if (!product?.ready) {
      messaging.handleOpen('Você precisa selecionar os itens obrigatórios');
      return;
    }

    if (amount > 1) {
      setAmount(amount - 1);
    }
  }

  function handleClickPizzaComplements(productId: number, complementCategoryId: number, complementId: number) {
    try {
      if (!product) {
        return;
      }

      const { newProduct, sizeSelected } = handleSelectPizzaProductComplement(
        product,
        complementCategoryId,
        complementId
      );

      setProduct(newProduct);
      setComplementSizeSelected(sizeSelected);

      if (!searchedCategoryId) {
        return;
      }

      handleSearch(searchedCategoryId, searchedValue);
    } catch (err) {
      const error = err as any;

      messaging.handleOpen(error.message);
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
    <Modal
      backgroundColor="#fafafa"
      onExited={() => handleSelectProduct(null)}
      title={`adicionar ao pedido`}
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
    </Modal>
  );
};

export default ProductPizzaComplement;
