import { useState, useEffect, useMemo } from 'react';
import { useBoard } from 'src/components/board/hooks/useBoard';
import Modal from 'src/components/modal/Modal';
import { calculateProductComplementsPrice } from 'src/components/products/detail/complement/calculateProductComplementsPrice';
import { moneyFormat } from 'src/helpers/numberFormat';
import { OrderProduct } from 'src/types/order';
import { Product } from 'src/types/product';
import BoardProductDetailActions from '../BoardProductDetailActions';
import { ProductComplementProvider } from '../hooks/useProductComplement';
import ProductComplementDetail from './ProductComplementDetail';

interface ProductComplementProps {
  onExited(): void;
  hideBackdrop?: boolean;
}

export default function ProductComplement({ onExited, hideBackdrop = false }: ProductComplementProps) {
  const { selectedProduct } = useBoard();
  const [amount] = useState(selectedProduct?.amount ?? 0);
  const [product] = useState<OrderProduct | null>(JSON.parse(JSON.stringify(selectedProduct)));
  const [complementsPrice, setComplementsPrice] = useState(0);

  const formattedTotal = useMemo(() => {
    if (!product) {
      return moneyFormat(0);
    }

    const total = (complementsPrice + product.product_price) * amount;
    return moneyFormat(total);
  }, [amount, complementsPrice, product]);

  useEffect(() => {
    const price = calculateProductComplementsPrice(product as Product);
    setComplementsPrice(price);
  }, [product]);

  const productComplementContextValue = {
    product: product as Product,
  };

  return (
    <Modal
      backgroundColor="#fafafa"
      onExited={onExited}
      title="detalhes do produto"
      displayBottomActions
      maxWidth="lg"
      height="80vh"
      hideBackdrop={hideBackdrop}
    >
      <ProductComplementProvider value={productComplementContextValue}>
        <ProductComplementDetail />
      </ProductComplementProvider>

      <BoardProductDetailActions amount={amount} total={formattedTotal} />
    </Modal>
  );
}
