import React, { useState, Fragment, useEffect, useMemo } from 'react';
import { Typography, Grid } from '@material-ui/core';
import { makeStyles, fade } from '@material-ui/core/styles';
import ProductComplementItem from 'src/components/products/detail/complement/ProductComplementItem';
import PropTypes from 'prop-types';
import CustomDialog from 'src/components/dialog/CustomDialog';
import { useMessaging } from 'src/hooks/messaging';
import { useCart } from '../../../hooks/useCart';
import { calculateProductComplementsPrice } from 'src/components/products/detail/complement/calculateProductComplementsPrice';
import { handleSelectProductComplement } from 'src/components/products/detail/complement/handleSelectProductComplement';
import CartProductUpdate from '../CartProductUpdate';
import { moneyFormat } from 'src/helpers/numberFormat';
import ProductDetail from 'src/components/products/detail/ProductDetail';
import ProductDetailInputAnnotation from 'src/components/products/detail/ProductDetailInputAnnotation';

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

ProductComplement.propTypes = {
  onExited: PropTypes.func.isRequired,
};

export default function ProductComplement({ onExited }) {
  const { selectedProduct } = useCart();
  const [amount, setAmount] = useState(selectedProduct.amount);
  const messaging = useMessaging();
  const classes = useStyles({ isSelected: selectedProduct.selected });
  const [product, setProduct] = useState(JSON.parse(JSON.stringify(selectedProduct)));
  const [complementsPrice, setComplementsPrice] = useState(0);

  const formattedTotal = useMemo(() => {
    if (!product) return moneyFormat(0);
    const total = (complementsPrice + product.product_price) * amount;
    return moneyFormat(total);
  }, [amount, complementsPrice, product]);

  useEffect(() => {
    const price = calculateProductComplementsPrice(product);
    setComplementsPrice(price);
  }, [product]);

  function handleClickComplements(complementCategoryId, complementId) {
    const { newProduct } = handleSelectProductComplement(complementCategoryId, complementId, product);
    setProduct(newProduct);
  }

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

  return (
    <CustomDialog
      backgroundColor="#fafafa"
      handleModalState={onExited}
      title={`${product.name} - Complementos`}
      displayBottomActions
      maxWidth="sm"
    >
      <>
        <Grid container className={classes.container}>
          <Grid item xs={12}>
            <ProductDetail product={product} />
          </Grid>
          <Grid item xs={12}>
            {product.complement_categories.map(item => (
              <section className={classes.category} key={item.id}>
                <div className={classes.header}>
                  <div>
                    <Typography className={classes.categoryName} variant="h6">
                      {item.name}
                    </Typography>
                    {item.max_quantity === 1 ? (
                      <Typography color="textSecondary" variant="body2">
                        Escolha 1 opção.
                      </Typography>
                    ) : (
                      <Typography color="textSecondary" variant="body2">
                        Escolha até {item.max_quantity} opções.
                      </Typography>
                    )}
                  </div>
                  <div>{item.is_required && <span className={classes.chip}>Obrigatório</span>}</div>
                </div>
                <ProductComplementItem
                  productId={product.id}
                  complementCategoryId={item.id}
                  handleClickComplements={handleClickComplements}
                  complements={item.complements}
                />
              </section>
            ))}
          </Grid>
          <ProductDetailInputAnnotation product={product} setProduct={setProduct} />
        </Grid>
        <CartProductUpdate
          handleAmountDown={handleAmountDown}
          handleAmountUp={handleAmountUp}
          product={product}
          amount={amount}
          total={formattedTotal}
        />
      </>
    </CustomDialog>
  );
}
