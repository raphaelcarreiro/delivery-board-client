import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'src/store/redux/selector';
import { OrderProduct } from 'src/types/order';
import { Product } from 'src/types/product';
import Modal from 'src/components/modal/Modal';
import BoardProductDetailActions from '../BoardProductDetailActions';
import { ProductPizzaProvider } from '../hooks/useProductPizza';
import ProductPizzaDetail from './ProductPizzaDetail';
import { useBoard } from 'src/components/board/hooks/useBoard';
import { moneyFormat } from 'src/helpers/numberFormat';
import { getPizzaComplementsPrice } from 'src/store/redux/modules/cart/cases/addProduct';

interface ProductPizzaComplementProps {
  onExited(): void;
  hideBackdrop?: boolean;
}

export default function ProductPizzaComplement({ onExited, hideBackdrop = false }: ProductPizzaComplementProps) {
  const restaurant = useSelector(state => state.restaurant);
  const { selectedProduct } = useBoard();
  const [amount] = useState(selectedProduct?.amount ?? 0);
  const [product] = useState<OrderProduct | null>(JSON.parse(JSON.stringify(selectedProduct)));
  const [complementsPrice, setComplementsPrice] = useState(0);

  const categoryComplementSize = useMemo(
    () => product?.complement_categories.find(category => category.is_pizza_size) || null,
    [product]
  );

  const complementSizeSelected = useMemo(
    () => categoryComplementSize?.complements.find(complement => complement.selected) || null,
    [categoryComplementSize]
  );

  const formattedTotal = useMemo(() => {
    if (!product) {
      return moneyFormat(0);
    }

    const total = (complementsPrice + product.product_price) * amount;
    return moneyFormat(total);
  }, [amount, complementsPrice, product]);

  useEffect(() => {
    if (!restaurant || !product) {
      return;
    }

    const price = getPizzaComplementsPrice(product.complement_categories, restaurant.configs);

    setComplementsPrice(price);
  }, [product, restaurant]);

  const productPizzaContextValue = {
    product: product as Product,
    complementSizeSelected,
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
      <ProductPizzaProvider value={productPizzaContextValue}>
        <ProductPizzaDetail />
      </ProductPizzaProvider>

      <BoardProductDetailActions total={formattedTotal} amount={amount} />
    </Modal>
  );
}
