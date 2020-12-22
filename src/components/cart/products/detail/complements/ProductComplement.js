import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import CustomDialog from 'src/components/dialog/CustomDialog';
import { useMessaging } from 'src/hooks/messaging';
import { useCart } from '../../../hooks/useCart';
import { calculateProductComplementsPrice } from 'src/components/products/detail/complement/calculateProductComplementsPrice';
import { handleSelectProductComplement } from 'src/components/products/detail/complement/handleSelectProductComplement';
import CartProductUpdate from '../CartProductUpdate';
import { moneyFormat } from 'src/helpers/numberFormat';
import { ProductComplementProvider } from 'src/components/products/detail/hooks/useProductComplement';
import ProductComplementDetail from 'src/components/products/detail/complement/ProductComplementDetail';

ProductComplement.propTypes = {
  onExited: PropTypes.func.isRequired,
};

export default function ProductComplement({ onExited }) {
  const { selectedProduct } = useCart();
  const [amount, setAmount] = useState(selectedProduct.amount);
  const messaging = useMessaging();
  const [product, setProduct] = useState(JSON.parse(JSON.stringify(selectedProduct)));
  const [complementsPrice, setComplementsPrice] = useState(0);

  const formattedTotal = useMemo(() => {
    if (!product) return moneyFormat(0);
    const total = (complementsPrice + product.product_price) * amount;
    return moneyFormat(total);
  }, [amount, complementsPrice, product]);

  useEffect(() => {
    const price = calculateProductComplementsPrice(product);
    setComplementsPrice(price);
  }, [product]);

  function handleClickComplements(complementCategoryId, complementId) {
    const { newProduct } = handleSelectProductComplement(complementCategoryId, complementId, product);
    setProduct(newProduct);
  }

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

  const productComplementContextValue = {
    product,
    handleClickComplements,
    setProduct,
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
      <ProductComplementProvider value={productComplementContextValue}>
        <ProductComplementDetail />
      </ProductComplementProvider>
      <CartProductUpdate
        handleAmountDown={handleAmountDown}
        handleAmountUp={handleAmountUp}
        product={product}
        amount={amount}
        total={formattedTotal}
      />
    </CustomDialog>
  );
}
