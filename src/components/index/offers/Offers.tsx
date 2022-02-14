import { makeStyles, Typography } from '@material-ui/core';
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import ProductComplement from 'src/components/products/detail/complement/ProductComplement';
import ProductPizzaComplement from 'src/components/products/detail/pizza_complement/ProductPizzaComplement';
import ProductSimple from 'src/components/products/detail/simple/ProductSimple';
import { ProductsProvider } from 'src/components/products/hooks/useProducts';
import { moneyFormat } from 'src/helpers/numberFormat';
import { useApp } from 'src/providers/AppProvider';
import { api } from 'src/services/api';
import { addToCart, prepareProduct } from 'src/store/redux/modules/cart/actions';
import { useSelector } from 'src/store/redux/selector';
import { AnimatedBackground } from 'src/styles/animatedBackground';
import { Product } from 'src/types/product';
import OffersList from './OffersList';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    marginBottom: 20,
    marginTop: 15,
  },
  header: {
    marginBottom: 15,
    [theme.breakpoints.down('sm')]: {
      marginLeft: 15,
    },
  },
  loading: {
    display: 'grid',
    columnGap: '10px',
    overflowX: 'hidden',
    gridAutoFlow: 'column',
    gridAutoColumns: 'min-content',
    [theme.breakpoints.down('sm')]: {
      paddingLeft: 15,
    },
  },
  animated: {
    height: 305,
    width: 200,
    [theme.breakpoints.down('sm')]: {
      width: 'calc(100vw / 3 + 30px)',
    },
  },
  categoryItem: {
    marginRight: 10,
  },
}));

const ActivePromotions: React.FC = () => {
  const classes = useStyles();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const dispatch = useDispatch();
  const { handleCartVisibility } = useApp();
  const restaurant = useSelector(state => state.restaurant);

  const isPizza = useMemo(() => {
    return !!selectedProduct?.category.is_pizza;
  }, [selectedProduct]);

  const isComplement = useMemo(() => {
    return !!selectedProduct?.category.has_complement && !selectedProduct?.category.is_pizza;
  }, [selectedProduct]);

  const isSimple = useMemo(() => {
    return selectedProduct ? !selectedProduct.category.has_complement : false;
  }, [selectedProduct]);

  useEffect(() => {
    api
      .get<Product[]>('/products')
      .then(response => {
        setProducts(
          response.data.map(product => ({
            ...product,
            formattedPrice: moneyFormat(product.price),
            formattedSpecialPrice: moneyFormat(product.special_price),
          }))
        );
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleAddProductToCart = useCallback(() => {
    dispatch(addToCart());
    handleCartVisibility(true);
    if (restaurant?.configs.facebook_pixel_id) fbq('track', 'AddToCart');
  }, [dispatch, handleCartVisibility, restaurant]);

  const handlePrepareProduct = useCallback(
    (product, amount) => {
      dispatch(prepareProduct(product, amount));
    },
    [dispatch]
  );

  if (products.length === 0 && !loading) return <Fragment />;

  return (
    <ProductsProvider
      value={{
        selectedProduct,
        handlePrepareProduct,
        handleSelectProduct: (product: Product | null) => setSelectedProduct(product),
        handleAddProductToCart,
        isPizza,
        isComplement,
        isSimple,
        redirectToMenuAfterAddToCart: false,
      }}
    >
      {isSimple && <ProductSimple />}
      {isPizza && <ProductPizzaComplement />}
      {isComplement && <ProductComplement />}

      <div className={classes.container}>
        <div className={classes.header}>
          <Typography variant="h5">ofertas</Typography>
        </div>

        {loading ? (
          <div className={classes.loading}>
            {Array.from(Array(10).keys()).map(item => (
              <AnimatedBackground className={classes.animated} key={item} />
            ))}
          </div>
        ) : (
          products.length > 0 && <OffersList products={products} />
        )}
      </div>
    </ProductsProvider>
  );
};

export default ActivePromotions;
