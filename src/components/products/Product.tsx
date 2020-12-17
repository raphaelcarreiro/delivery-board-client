import React, { useState, useContext, useRef, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { prepareProduct, addToCart } from 'src/store/redux/modules/cart/actions';
import ProductList from './ProductList';
import { AppContext } from 'src/App';
import CustomAppbar from 'src/components/appbar/CustomAppbar';
import ProductsActions from './ProductsActions';
import NoData from 'src/components/nodata/NoData';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, TextField, InputAdornment } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import { useRouter } from 'next/router';
import { useMessaging } from 'src/hooks/messaging';
import { Product } from 'src/types/product';
import ImagePreview from '../image-preview/ImagePreview';
import ProductView from '../menu/product/view/simple/ProductView';
import ProductPizzaComplement from '../menu/product/view/pizza_complement/ProductPizzaComplement';
import { useSelector } from 'src/store/redux/selector';
import ProductComplement from '../menu/product/view/complement/ProductComplement';

const useStyles = makeStyles(theme => ({
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
  iconCancelSearch: {
    cursor: 'pointer',
  },
  breadcrumb: {
    backgroundColor: '#fff',
    padding: '3px 5px',
    marginBottom: 15,
    borderLeft: `2px solid ${theme.palette.primary.main}`,
    '& span': {
      marginRight: 5,
      marginLeft: 5,
    },
    [theme.breakpoints.down('md')]: {
      marginBottom: 5,
    },
  },
}));

type ProductsProps = {
  products: Product[];
  categoryName: string;
  categoryUrl: string;
};

const Products: React.FC<ProductsProps> = ({ products, categoryName, categoryUrl }) => {
  const classes = useStyles();
  const app = useContext(AppContext);
  const messaging = useMessaging();
  const dispatch = useDispatch();
  const ref = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const restaurant = useSelector(state => state.restaurant);
  const [imagePreview, setImagePreview] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [dialogProductView, setDialogProductView] = useState(false);
  const [dialogProductComplement, setDialogProductComplement] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [search, setSearch] = useState('');

  const handleProductClick = useCallback(
    product => {
      setSelectedProduct(product);
      messaging.handleClose();

      if (product.category.has_complement) {
        setDialogProductComplement(true);
        return false;
      }

      setDialogProductView(true);
    },
    [] // eslint-disable-line
  );

  const handlePrepareProduct = useCallback(
    (product, amount) => {
      dispatch(prepareProduct(product, amount));
    },
    [dispatch]
  );

  useEffect(() => {
    if (products.length === 1) {
      const product = products[0];
      if (product.category.is_pizza) handleProductClick(product);
    }
  }, [handleProductClick, products]);

  useEffect(() => {
    if (selectedProduct && restaurant) {
      if (restaurant.configs.facebook_pixel_id) fbq('track', 'ViewContent');
    }
  }, [selectedProduct, restaurant]);

  function handleOpenImagePreview(event, product) {
    setSelectedProduct(product);
  }

  function handleAddProductToCart() {
    dispatch(addToCart());
    app.handleCartVisibility(true);
    handleCancelSearch();
    if (restaurant?.configs.facebook_pixel_id) fbq('track', 'AddToCart');
    if (selectedProduct?.category.url !== 'offers') router.push('/menu');
  }

  function handleSearch(searchValue) {
    setSearch(searchValue);
    const _products = products.filter(product => {
      const productName = product.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      return productName.indexOf(searchValue.toLowerCase()) !== -1;
    });

    setFilteredProducts(_products);
  }

  function handleCancelSearch() {
    setIsSearching(false);
    handleSearch('');
    setSearch('');
    ref.current?.focus();
  }

  return (
    <>
      <Grid item xs={12} className={classes.pageHeader}>
        <div>
          <Typography variant="h5" color="primary">
            {categoryName}
          </Typography>
          {filteredProducts.length > 0 ? (
            <Typography variant="body1" color="textSecondary">
              exibindo {filteredProducts.length} {filteredProducts.length > 1 ? 'produtos' : 'produto'}
            </Typography>
          ) : (
            <Typography variant="body1" color="textSecondary">
              sem produtos
            </Typography>
          )}
        </div>

        <TextField
          inputRef={ref}
          onChange={event => handleSearch(event.target.value)}
          value={search}
          autoFocus
          label="buscar"
          placeholder="digite sua busca"
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {search ? (
                  <ClearIcon className={classes.iconCancelSearch} onClick={() => handleCancelSearch()} />
                ) : (
                  <SearchIcon />
                )}
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <CustomAppbar
        cancel
        cancelAction={isSearching ? handleCancelSearch : () => router.push('/menu')}
        title={isSearching ? '' : categoryName}
        actionComponent={
          <ProductsActions
            isSearching={isSearching}
            openSearchBox={() => setIsSearching(true)}
            handleSearch={handleSearch}
          />
        }
      />
      {imagePreview && selectedProduct && (
        <ImagePreview
          src={selectedProduct.image.imageUrl}
          onExited={() => setImagePreview(false)}
          description={selectedProduct.name}
        />
      )}
      {dialogProductView && selectedProduct && (
        <ProductView
          handlePrepareProduct={handlePrepareProduct}
          handleAddProductToCart={handleAddProductToCart}
          onExited={() => setDialogProductView(false)}
          productId={selectedProduct.id}
        />
      )}
      {dialogProductComplement && selectedProduct && (
        <>
          {selectedProduct.category.is_pizza ? (
            <ProductPizzaComplement
              onExited={() => setDialogProductComplement(false)}
              handleAddProductToCart={handleAddProductToCart}
              handlePrepareProduct={handlePrepareProduct}
              productId={selectedProduct.id}
              productName={selectedProduct.name}
            />
          ) : (
            <ProductComplement
              onExited={() => setDialogProductComplement(false)}
              handleAddProductToCart={handleAddProductToCart}
              handlePrepareProduct={handlePrepareProduct}
              productId={selectedProduct.id}
              productName={selectedProduct.name}
            />
          )}
        </>
      )}
      {filteredProducts.length > 0 ? (
        <ProductList
          listType="col"
          products={filteredProducts}
          handleProductClick={handleProductClick}
          handleOpenImagePreview={handleOpenImagePreview}
        />
      ) : (
        <NoData message="Nenhum produto para exibir" />
      )}
    </>
  );
};

export default Products;
