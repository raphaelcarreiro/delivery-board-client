import React, { useState, useEffect, useMemo } from 'react';
import CustomDialog from 'src/components/dialog/CustomDialog';
import { moneyFormat } from 'src/helpers/numberFormat';
import InsideLoading from 'src/components/loading/InsideLoading';
import { useMessaging } from 'src/providers/MessageProvider';
import { useProducts } from 'src/components/products/hooks/useProducts';
import ProductAdd from '../addToCart/ProductAdd';
import { fetchProductComplement } from './fetchProductComplement';
import { handleSelectProductComplement } from './handleSelectProductComplement';
import { calculateProductComplementsPrice } from './calculateProductComplementsPrice';
import ProductComplementDetail from './ProductComplementDetail';
import { ProductComplementProvider } from '../hooks/useProductComplement';

function ProductComplement() {
  const [amount, setAmount] = useState(1);
  const [product, setProduct] = useState(null);
  const messaging = useMessaging();
  const [complementsPrice, setComplementsPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const { handlePrepareProduct, selectedProduct, handleSelectProduct } = useProducts();

  const formattedTotal = useMemo(() => {
    if (!product) return moneyFormat(0);
    const productPrice = product.promotion_activated && product.special_price ? product.special_price : product.price;
    const _total = (complementsPrice + productPrice) * amount;
    return moneyFormat(_total);
  }, [amount, complementsPrice, product]);

  useEffect(() => {
    fetchProductComplement(selectedProduct.id)
      .then(product => {
        setProduct(product);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedProduct]);

  useEffect(() => {
    if (!product) return;

    handlePrepareProduct(product, amount);
  }, [amount, product, handlePrepareProduct]);

  useEffect(() => {
    if (!product) return;

    const price = calculateProductComplementsPrice(product);
    setComplementsPrice(price);
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

  function handleClickComplements(complementCategoryId, complementId, amount) {
    const { newProduct } = handleSelectProductComplement(complementCategoryId, complementId, product);

    setProduct(newProduct);

    if (newProduct.ready) handlePrepareProduct(newProduct);
  }

  const productComplementContextValue = {
    product,
    handleClickComplements,
    setProduct,
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
      {loading ? (
        <InsideLoading />
      ) : (
        <>
          <ProductComplementProvider value={productComplementContextValue}>
            <ProductComplementDetail />
          </ProductComplementProvider>
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

export default ProductComplement;
