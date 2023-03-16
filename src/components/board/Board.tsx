import React, { FC, useMemo, useState } from 'react';
import { useSelector } from 'src/store/redux/selector';
import CustomAppbar from '../appbar/CustomAppbar';
import BoardProductList from './products/BoardProductsList';
import BoardTotal from './BoardTotal';
import { useFetchBoardMovementPayments } from './hooks/useFetchBoardMovementPayments';
import { useFecthBoardMovementProducts } from './hooks/useFetchBoardMovementProducts';
import { BoardProvider } from './hooks/useBoard';
import { BoardOrderProduct } from 'src/types/boardOrderProduct';
import ProductSimple from './products/detail/simple/ProductSimple';
import ProductPizzaComplement from './products/detail/pizza_complement/ProductPizzaComplement';
import ProductComplement from './products/detail/complement/ProductComplement';
import NoData from '../nodata/NoData';
import { useRouter } from 'next/router';

const Board: FC = () => {
  const movement = useSelector(state => state.boardMovement);
  const [isProductsLoading] = useFecthBoardMovementProducts(movement?.id);
  const [isPaymentLoading] = useFetchBoardMovementPayments(movement?.id);
  const [selectedProduct, setSelectedProduct] = useState<BoardOrderProduct | null>(null);
  const router = useRouter();

  const isPizza = useMemo(() => {
    return !!selectedProduct?.category.is_pizza;
  }, [selectedProduct]);

  const isComplement = useMemo(() => {
    return !!selectedProduct?.category.has_complement && !selectedProduct?.category.is_pizza;
  }, [selectedProduct]);

  const isSimple = useMemo(() => {
    return selectedProduct ? !selectedProduct.category.has_complement : false;
  }, [selectedProduct]);

  return (
    <BoardProvider value={{ selectedProduct, setSelectedProduct }}>
      {isSimple && <ProductSimple onExited={() => setSelectedProduct(null)} />}

      {isPizza && <ProductPizzaComplement onExited={() => setSelectedProduct(null)} />}

      {isComplement && <ProductComplement onExited={() => setSelectedProduct(null)} />}

      <CustomAppbar title={movement ? `Mesa ${movement?.board.number} - ${movement.customer.name}` : 'Mesa'} />

      {!movement ? (
        <NoData message="Você deve ler o código QR disponível na mesa" />
      ) : !movement.products.length ? (
        <NoData
          message="nenhum produto para mostrar"
          buttonText="acessar cardápio"
          action={() => router.push('/menu')}
        />
      ) : (
        <>
          <BoardProductList products={movement.products} />
          <BoardTotal />
        </>
      )}
    </BoardProvider>
  );
};

export default Board;
