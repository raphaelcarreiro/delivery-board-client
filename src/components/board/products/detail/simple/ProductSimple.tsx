import { useState, useEffect, useMemo } from 'react';
import { useBoard } from 'src/components/board/hooks/useBoard';
import Modal from 'src/components/modal/Modal';
import { moneyFormat } from 'src/helpers/numberFormat';
import { OrderProduct } from 'src/types/order';
import { Product } from 'src/types/product';
import BoardProductDetailActions from '../BoardProductDetailActions';
import { ProductSimpleProvider } from '../hooks/useProduct';
import ProductSimpleDetail from './ProductSimpleDetail';

interface ProductSimpleProps {
  onExited(): void;
  hideBackdrop?: boolean;
}

export default function ProductSimple({ onExited, hideBackdrop = false }: ProductSimpleProps) {
  const { selectedProduct } = useBoard();
  const [amount] = useState(selectedProduct?.amount ?? 0);
  const [product] = useState<OrderProduct | null>(JSON.parse(JSON.stringify(selectedProduct)));
  const [additionalPrice, setAdditionalPrice] = useState(0);

  const formattedTotal = useMemo(() => {
    if (!product) {
      return moneyFormat(0);
    }

    const productPrice =
      product.promotion_activated && product.special_price ? product.special_price : product.product_price;

    const total = (productPrice + additionalPrice) * amount;
    return moneyFormat(total);
  }, [additionalPrice, amount, product]);

  useEffect(() => {
    if (product) {
      setAdditionalPrice(
        product.additional.reduce(
          (value, additional) => (additional.selected ? value + additional.price * additional.amount : value),
          0
        )
      );
    }
  }, [product, amount]);

  return (
    <Modal
      maxWidth="lg"
      height="80vh"
      title="detalhes do produto"
      backgroundColor="#fafafa"
      onExited={onExited}
      displayBottomActions
      hideBackdrop={hideBackdrop}
    >
      <ProductSimpleProvider
        value={{
          product: product as Product,
        }}
      >
        <ProductSimpleDetail />
      </ProductSimpleProvider>

      <BoardProductDetailActions amount={amount} total={formattedTotal} />
    </Modal>
  );
}
