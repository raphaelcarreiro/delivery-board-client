import React, { useState, useEffect, useMemo } from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles, fade } from '@material-ui/core/styles';
import ProductPizzaComplementItem from 'src/components/products/detail/pizza_complement/ProductPizzaComplementItem';
import CustomDialog from 'src/components/dialog/CustomDialog';
import ProductPizzaComplementAdditional from 'src/components/products/detail/pizza_complement/ProductPizzaComplementAdditional';
import ProductPizzaComplementIngredient from 'src/components/products/detail/pizza_complement/ProductPizzaComplementIngredient';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import ProductPizzaComplementHeader from 'src/components/products/detail/pizza_complement/ProductPizzaComplementHeader';
import { useMessaging } from 'src/hooks/messaging';
import { handleSelectPizzaProductComplement } from 'src/components/products/detail/pizza_complement/handleSelectPizzaProductComplement';
import { calculatePizzaProductComplementPrice } from 'src/components/products/detail/pizza_complement/calculatePizzaProductComplementsPrice';
import { useCart } from '../../../hooks/useCart';
import CartProductUpdate from '../CartProductUpdate';
import { moneyFormat } from 'src/helpers/numberFormat';
import ProductDetail from 'src/components/products/detail/ProductDetail';
import ProductDetailInputAnnotation from 'src/components/products/detail/ProductDetailInputAnnotation';
import { handleSearchComplement } from 'src/components/products/detail/pizza_complement/handleSearchComplement';

const useStyles = makeStyles(theme => ({
  header: {
    border: `1px solid ${fade(theme.palette.primary.main, 0.1)}`,
    padding: '7px 15px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chip: {
    display: 'inline-block',
    padding: '3px 5px',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
    fontSize: 10,
  },
  category: {
    display: 'block',
    marginBottom: 10,
  },
  categoryName: {
    fontWeight: 400,
  },
  container: {
    marginBottom: 0,
  },
}));

ProductPizzaComplement.propTypes = {
  onExited: PropTypes.func.isRequired,
};

export default function ProductPizzaComplement({ onExited }) {
  const messaging = useMessaging();
  const classes = useStyles();
  const restaurant = useSelector(state => state.restaurant);
  const cart = useCart();
  const [amount, setAmount] = useState(cart.selectedProduct.amount);
  const [product, setProduct] = useState(JSON.parse(JSON.stringify(cart.selectedProduct)));
  const [filteredProduct, setFilteredProduct] = useState(product);
  const [complementsPrice, setComplementsPrice] = useState(0);
  const [dialogIngredients, setDialogIngredients] = useState(false);
  const [dialogAdditional, setDialogAdditional] = useState(false);
  const [complementIdSelected, setComplementIdSelected] = useState(null);
  const [complementCategoryIdSelected, setComplementCategoryIdSelected] = useState(null);
  const [searchedCategoryId, setSearchedCategoryId] = useState(null);
  const [searchedValue, setSearchedValue] = useState('');

  const categoryComplementSize = useMemo(() => product.complement_categories.find(category => category.is_pizza_size), [
    product,
  ]);

  const complementSizeSelected = useMemo(
    () => categoryComplementSize.complements.find(complement => complement.selected),
    [categoryComplementSize]
  );

  const formattedTotal = useMemo(() => {
    if (!product) return moneyFormat(0);
    const total = (complementsPrice + product.product_price) * amount;
    return moneyFormat(total);
  }, [amount, complementsPrice, product]);

  useEffect(() => {
    if (!restaurant) return;
    const price = calculatePizzaProductComplementPrice(product, restaurant);

    setComplementsPrice(price);
  }, [product, restaurant]);

  useEffect(() => {
    setFilteredProduct(product);
  }, [product]);

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

  function handleClickPizzaComplements(productId, complementCategoryId, complementId) {
    try {
      const { newProduct } = handleSelectPizzaProductComplement(product, complementCategoryId, complementId);

      setProduct(newProduct);
      handleSearch(searchedCategoryId, searchedValue);
    } catch (err) {
      messaging.handleOpen(err.message);
    }
  }

  function handleSearch(categoryId, searchValue) {
    setSearchedValue(searchValue);

    if (searchValue === '') {
      setFilteredProduct(product);
      setSearchedCategoryId(null);
      return;
    }

    setSearchedCategoryId(categoryId);

    const newProduct = handleSearchComplement(product, searchValue, categoryId);

    setFilteredProduct(newProduct);
  }

  return (
    <CustomDialog
      backgroundColor="#fafafa"
      handleModalState={onExited}
      title={`${product.name} - Complementos`}
      displayBottomActions
      maxWidth="sm"
    >
      {dialogAdditional && (
        <ProductPizzaComplementAdditional
          onExited={() => setDialogAdditional(false)}
          product={product}
          complementIdSelected={complementIdSelected}
          complementCategoryIdSelected={complementCategoryIdSelected}
          setProduct={setProduct}
        />
      )}
      {dialogIngredients && (
        <ProductPizzaComplementIngredient
          onExited={() => setDialogIngredients(false)}
          complementIdSelected={complementIdSelected}
          complementCategoryIdSelected={complementCategoryIdSelected}
          product={product}
          setProduct={setProduct}
        />
      )}
      <Grid container className={classes.container}>
        <Grid item xs={12}>
          <ProductDetail product={product} />
        </Grid>
        <Grid item xs={12}>
          {filteredProduct.complement_categories.map(category => (
            <section className={classes.category} key={category.id}>
              <ProductPizzaComplementHeader
                handleSearch={handleSearch}
                complementSizeSelected={complementSizeSelected}
                category={category}
              />
              <ProductPizzaComplementItem
                category={category}
                productId={product.id}
                handleClickPizzaComplements={handleClickPizzaComplements}
                complements={category.complements}
                setComplementCategoryIdSelected={setComplementCategoryIdSelected}
                setComplementIdSelected={setComplementIdSelected}
                openDialogAdditional={() => setDialogAdditional(true)}
                openDialogIngredients={() => setDialogIngredients(true)}
              />
            </section>
          ))}
        </Grid>
        <ProductDetailInputAnnotation product={product} setProduct={setProduct} />
      </Grid>
      <CartProductUpdate
        product={product}
        handleAmountDown={handleAmountDown}
        handleAmountUp={handleAmountUp}
        total={formattedTotal}
        amount={amount}
      />
    </CustomDialog>
  );
}
