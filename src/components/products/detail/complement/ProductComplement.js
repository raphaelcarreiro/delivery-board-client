import React, { useState, useEffect, useMemo } from 'react';
import { Typography, Grid } from '@material-ui/core';
import { makeStyles, fade } from '@material-ui/core/styles';
import ProductComplementItem from './ProductComplementItem';
import CustomDialog from 'src/components/dialog/CustomDialog';
import { moneyFormat } from 'src/helpers/numberFormat';
import InsideLoading from 'src/components/loading/InsideLoading';
import { useMessaging } from 'src/hooks/messaging';
import { useProducts } from 'src/components/products/hooks/useProducts';
import ProductAdd from '../ProductAdd';
import { fetchProductComplement } from './fetchProductComplement';
import { handleSelectProductComplement } from './handleSelectProductComplement';
import { calculateProductComplementsPrice } from './calculateProductComplementsPrice';
import ProductDetail from '../ProductDetail';
import ProductDetailInputAnnotation from '../ProductDetailInputAnnotation';

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
    backgroundColor: theme.palette.primary.main,
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

function ProductComplement() {
  const [amount, setAmount] = useState(1);
  const [product, setProduct] = useState(null);
  const messaging = useMessaging();
  const classes = useStyles();
  const [complementsPrice, setComplementsPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const { handlePrepareProduct, selectedProduct, handleSelectProduct } = useProducts();

  const formattedTotal = useMemo(() => {
    if (!product) return moneyFormat(0);
    const _total = (complementsPrice + product.price) * amount;
    return moneyFormat(_total);
  }, [amount, complementsPrice, product]);

  useEffect(() => {
    fetchProductComplement(selectedProduct.id)
      .then(product => {
        setProduct(product);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedProduct]);

  useEffect(() => {
    if (!product) return;

    handlePrepareProduct(product, amount);
  }, [amount, product, handlePrepareProduct]);

  useEffect(() => {
    if (!product) return;

    const price = calculateProductComplementsPrice(product);
    setComplementsPrice(price);
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

  function handleClickComplements(complementCategoryId, complementId, amount) {
    const { newProduct } = handleSelectProductComplement(complementCategoryId, complementId, product);

    setProduct(newProduct);

    if (newProduct.ready) handlePrepareProduct(newProduct);
  }

  return (
    <CustomDialog
      backgroundColor="#fafafa"
      handleModalState={() => handleSelectProduct(null)}
      title={`adicionar ao carrinho`}
      displayBottomActions
      maxWidth="sm"
    >
      {loading ? (
        <InsideLoading />
      ) : (
        <>
          <Grid container className={classes.container}>
            <Grid item xs={12}>
              <ProductDetail product={product} />
            </Grid>
            <Grid item xs={12}>
              {product.complement_categories.map(category => (
                <section className={classes.category} key={category.id}>
                  <div className={classes.header}>
                    <div>
                      <Typography className={classes.categoryName} variant="h6">
                        {category.name}
                      </Typography>
                      {category.max_quantity === 1 ? (
                        <Typography color="textSecondary" variant="body2">
                          Escolha 1 opção.
                        </Typography>
                      ) : (
                        <Typography color="textSecondary" variant="body2">
                          Escolha até {category.max_quantity} opções.
                        </Typography>
                      )}
                    </div>
                    <div>{category.is_required && <span className={classes.chip}>Obrigatório</span>}</div>
                  </div>
                  <ProductComplementItem
                    complementCategoryId={category.id}
                    handleClickComplements={handleClickComplements}
                    complements={category.complements}
                  />
                </section>
              ))}
            </Grid>
            <ProductDetailInputAnnotation product={product} setProduct={setProduct} />
          </Grid>
          <ProductAdd
            amount={amount}
            handleAmountDown={handleAmountDown}
            handleAmountUp={handleAmountUp}
            product={product}
            total={formattedTotal}
          />
        </>
      )}
    </CustomDialog>
  );
}

export default ProductComplement;
