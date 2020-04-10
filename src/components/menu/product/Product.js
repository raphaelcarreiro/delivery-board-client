import React, { useState, useContext, useRef, useEffect } from 'react';
import ImagePreview from '../../image-preview/ImagePreview';
import PropTypes from 'prop-types';
import ProductView from './view/simple/ProductView';
import { useDispatch } from 'react-redux';
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
  categoryName: PropTypes.string,
  categoryUrl: PropTypes.string,
};

export default function Product({ products, categoryName, categoryUrl }) {
  const [imagePreview, setImagePreview] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dialogProductView, setDialogProductView] = useState(false);
  const [dialogProductComplement, setDialogProductComplement] = useState(false);
  const dispatch = useDispatch();
  const messaging = useContext(MessagingContext);
  const app = useContext(AppContext);
  const [isSearching, setIsSearching] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const classes = useStyles();
  const [search, setSearch] = useState('');
  const ref = useRef();
  const router = useRouter();

  useEffect(() => {
    if (products.length === 1) {
      const product = products[0];
      if (product.category.is_pizza) handleProductClick(product);
    }
  }, []);

  function handleProductClick(product) {
    setSelectedProduct(product);
    messaging.handleClose();

    if (product.category.has_complement) {
      setDialogProductComplement(true);
      return false;
    }

    setDialogProductView(true);
  }

  function handleOpenImagePreview(event, product) {
    // event.stopPropagation();
    setSelectedProduct(product);
    // setImagePreview(true);
  }

  function handlePrepareProduct(product, amount) {
    dispatch(prepareProduct(product, amount));
  }

  function handleAddProductToCart() {
    dispatch(addToCart());
    // messaging.handleOpen('Produto adicionado ao carrinho');
    app.handleCartVisibility(true);
    handleCancelSearch();
    if (categoryUrl !== '/offers') router.push('/menu');
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
          selectedProduct={selectedProduct}
        />
      )}
      {dialogProductComplement && (
        <>
          {selectedProduct.category.is_pizza ? (
            <ProductPizzaComplement
              onExited={() => setDialogProductComplement(false)}
              handleAddProductToCart={handleAddProductToCart}
              handlePrepareProduct={handlePrepareProduct}
              selectedProduct={selectedProduct}
            />
          ) : (
            <ProductComplement
              onExited={() => setDialogProductComplement(false)}
              handleAddProductToCart={handleAddProductToCart}
              handlePrepareProduct={handlePrepareProduct}
              selectedProduct={selectedProduct}
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
