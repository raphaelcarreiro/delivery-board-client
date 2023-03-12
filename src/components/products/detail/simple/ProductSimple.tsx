import React, { useState, useEffect, useMemo } from 'react';
import { fetchSimpleProduct } from './fetchSimpleProduct';
import ProductSimpleDetail from './ProductSimpleDetail';
import { ProductSimpleProvider } from '../hooks/useProduct';
import { useProducts } from '../../hooks/useProducts';
import { moneyFormat } from 'src/helpers/numberFormat';
import Modal from 'src/components/modal/Modal';
import InsideLoading from 'src/components/loading/InsideLoading';
import ProductAdd from '../addToCart/ProductAdd';
import { Product } from 'src/types/product';

const ProductSimple: React.FC = () => {
  const [amount, setAmount] = useState(1);
  const [additionalPrice, setAdditionalPrice] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { selectedProduct, handleSelectProduct } = useProducts();

  const formattedTotal = useMemo(() => {
    if (!product) {
      return moneyFormat(0);
    }

    const productPrice = product.promotion_activated && product.special_price ? product.special_price : product.price;
    const total = (productPrice + additionalPrice) * amount;
    return moneyFormat(total);
  }, [additionalPrice, amount, product]);

  useEffect(() => {
    if (!selectedProduct) {
      return;
    }

    fetchSimpleProduct(selectedProduct.id)
      .then(product => {
        setProduct(product);
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [selectedProduct]);

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

  function handleAmountUp() {
    setAmount(amount + 1);
  }

  function handleAmountDown() {
    if (amount > 1) {
      setAmount(amount - 1);
    }
  }

  function handleClickIngredient(ingredientId: number) {
    setProduct(state => {
      if (!state) {
        return null;
      }

      return {
        ...state,
        ingredients: state.ingredients.map(ingredient => {
          if (ingredient.id === ingredientId) {
            ingredient.selected = !ingredient.selected;
          }

          return ingredient;
        }),
      };
    });
  }

  function handleClickAdditional(additionalId: number, amount: number) {
    setProduct(state => {
      if (!state) {
        return null;
      }

      return {
        ...state,
        additional: state.additional.map(additional => {
          if (additional.id === additionalId) {
            additional.selected = amount > 0;
            additional.amount = amount;
          }
          return additional;
        }),
      };
    });
  }

  const productSimpleContext = {
    handleClickAdditional,
    handleClickIngredient,
    product,
    setProduct,
  };

  return (
    <Modal
      maxWidth="lg"
      title="adicionar ao pedido"
      backgroundColor="#fafafa"
      onExited={() => handleSelectProduct(null)}
      displayBottomActions
      height="80vh"
    >
      {loading ? (
        <InsideLoading />
      ) : (
        <>
          <ProductSimpleProvider value={productSimpleContext}>
            <ProductSimpleDetail />
          </ProductSimpleProvider>

          <ProductAdd
            total={formattedTotal}
            handleAmountDown={handleAmountDown}
            handleAmountUp={handleAmountUp}
            product={product}
            amount={amount}
          />
        </>
      )}
    </Modal>
  );
};

export default ProductSimple;
