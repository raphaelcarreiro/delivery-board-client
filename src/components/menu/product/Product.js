import React, { useState, useContext, useRef, useEffect, useCallback } from 'react';
import ImagePreview from '../../image-preview/ImagePreview';
import PropTypes from 'prop-types';
import ProductView from './view/simple/ProductView';
import { useDispatch, useSelector } from 'react-redux';
import { prepareProduct, addToCart } from 'src/store/redux/modules/cart/actions';
import { MessagingContext } from '../../messaging/Messaging';
import ProductPizzaComplement from './view/pizza_complement/ProductPizzaComplement';
import ProductComplement from './view/complement/ProductComplement';
import ProductList from './ProductList';
import { AppContext } from 'src/App';
import CustomAppbar from 'src/components/appbar/CustomAppbar';
import ProductAction from './ProductAction';
import NoData from 'src/components/nodata/NoData';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, TextField, InputAdornment } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import { useRouter } from 'next/router';

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

Product.propTypes = {
  products: PropTypes.array.isRequired,
  categoryName: PropTypes.string.isRequired,
  categoryUrl: PropTypes.string.isRequired,
};

export default function Product({ products, categoryName, categoryUrl }) {
  const classes = useStyles();
  const app = useContext(AppContext);
  const messaging = useContext(MessagingContext);
  const dispatch = useDispatch();
  const ref = useRef();
  const router = useRouter();
  const restaurant = useSelector(state => state.restaurant);
  const [imagePreview, setImagePreview] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dialogProductView, setDialogProductView] = useState(false);
  const [dialogProductComplement, setDialogProductComplement] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(products);
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
    if (restaurant.configs.facebook_pixel_id) fbq('track', 'AddToCart');
    if (selectedProduct.category.url !== 'offers') router.push('/menu');
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
    ref.current.focus();
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
              Exibindo {filteredProducts.length} {filteredProducts.length > 1 ? 'produtos' : 'produto'}
            </Typography>
          ) : (
            <Typography variant="body1" color="textSecondary">
              Sem produtos
            </Typography>
          )}
        </div>

        <TextField
          inputRef={ref}
          onChange={event => handleSearch(event.target.value)}
          value={search}
          autoFocus
          label="Buscar"
          placeholder="Digite sua busca"
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
        cancel={isSearching}
        cancelAction={handleCancelSearch}
        title={isSearching ? '' : categoryName}
        actionComponent={
          <ProductAction
            isSearching={isSearching}
            openSearchBox={() => setIsSearching(true)}
            handleSearch={handleSearch}
          />
        }
      />
      {imagePreview && (
        <ImagePreview
          src={selectedProduct.image.imageUrl}
          onExited={() => setImagePreview(false)}
          description={selectedProduct.name}
        />
      )}
      {dialogProductView && (
        <ProductView
          handlePrepareProduct={handlePrepareProduct}
          handleAddProductToCart={handleAddProductToCart}
          onExited={() => setDialogProductView(false)}
          productId={selectedProduct.id}
        />
      )}
      {dialogProductComplement && (
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
          products={filteredProducts}
          handleProductClick={handleProductClick}
          handleOpenImagePreview={handleOpenImagePreview}
        />
      ) : (
        <NoData message="Nenhum produto para exibir" />
      )}
    </>
  );
}
