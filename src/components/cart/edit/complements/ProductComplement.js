import React, { useState, useContext, Fragment, useEffect } from 'react';
import { Typography, Grid, TextField } from '@material-ui/core';
import { makeStyles, fade } from '@material-ui/core/styles';
import { MessagingContext } from 'src/components/messaging/Messaging';
import ProductComplementItem from './ProductComplementItem';
import ProductComplementAction from './ProductComplementAction';
import PropTypes from 'prop-types';
import CustomDialog from 'src/components/dialog/CustomDialog';
import ImagePreview from 'src/components/image-preview/ImagePreview';

const useStyles = makeStyles(theme => ({
  imageContainer: {
    width: 200,
    minHeight: 100,
    maxHeight: 200,
    marginRight: 20,
    marginBottom: 10,
    borderRadius: 4,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  imageWrapper: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      marginBottom: 15,
    },
  },
  image: {
    width: '100%',
    cursor: 'zoom-in',
    borderRadius: 4,
  },
  productData: {
    marginBottom: 15,
    marginTop: 10,
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap',
    },
  },
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
    borderRadius: 4,
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
  actionContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 20,
  },
  amountControl: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    border: '1px solid #eee',
    borderRadius: 4,
    marginRight: 10,
    height: 40,
  },
  action: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    display: 'flex',
    backgroundColor: '#fff',
    boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
  },
  amount: {
    textAlign: 'center',
  },
  buttonAmount: {
    minWidth: 50,
  },
  finalPrice: {
    color: ({ isSelected }) => (isSelected ? theme.palette.primary.contrastText : '#888'),
    textAlign: 'right',
    minWidth: 80,
    fontWeight: 500,
  },
}));

ProductComplement.propTypes = {
  onExited: PropTypes.func.isRequired,
  selectedProduct: PropTypes.object.isRequired,
  handleUpdateCartProduct: PropTypes.func.isRequired,
};

export default function ProductComplement({ onExited, selectedProduct, handleUpdateCartProduct }) {
  const [amount, setAmount] = useState(selectedProduct.amount);
  const messaging = useContext(MessagingContext);
  const classes = useStyles({ isSelected: selectedProduct.selected });
  const [product, setProduct] = useState(JSON.parse(JSON.stringify(selectedProduct)));
  const [complementsPrice, setComplementsPrice] = useState(0);
  const [imagePreview, setImagePreview] = useState(false);

  useEffect(() => {
    setComplementsPrice(
      product.complement_categories.reduce((value, category) => {
        const categoryPrice = category.complements.reduce((sum, complement) => {
          return complement.selected && complement.price ? sum + complement.price : sum;
        }, 0);
        return categoryPrice + value;
      }, 0)
    );
  }, [product]);

  function handleClickComplements(productId, complementCategoryId, complementId) {
    const complementCategories = product.complement_categories.map(category => {
      if (category.id === complementCategoryId) {
        const selectedAmount = category.complements.reduce((sum, complement) => {
          return complement.selected ? sum + 1 : sum;
        }, 0);

        category.complements = category.complements.map(complement => {
          if (category.max_quantity === 1) {
            complement.selected = complement.id === complementId && !complement.selected;
          } else {
            if (complement.id === complementId) {
              if (complement.selected) complement.selected = !complement.selected;
              else if (category.max_quantity > selectedAmount) complement.selected = !complement.selected;
            }
          }

          return complement;
        });
      }
      return category;
    });

    const ready = complementCategories.every(category => {
      if (category.is_required) {
        const selectedAmount = category.complements.reduce((sum, complement) => {
          return complement.selected ? sum + 1 : sum;
        }, 0);

        return category.min_quantity <= selectedAmount;
      }
      return true;
    });

    setProduct({
      ...product,
      ready: ready,
      complement_categories: complementCategories,
    });
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

  function handleImagePreview() {
    setImagePreview(!imagePreview);
  }

  return (
    <CustomDialog
      backgroundColor="#fafafa"
      handleModalState={onExited}
      title={`${product.name} - Complementos`}
      displayBottomActions
    >
      {imagePreview && product.image && (
        <ImagePreview src={product.image.imageUrl} description={product.name} onExited={handleImagePreview} />
      )}
      <Fragment>
        <Grid container className={classes.container}>
          <Grid item xs={12}>
            <div className={classes.productData}>
              <div className={classes.imageWrapper}>
                <div className={classes.imageContainer}>
                  <img
                    onClick={handleImagePreview}
                    className={classes.image}
                    src={product.image && product.image.imageUrl}
                    alt={product.name}
                  />
                </div>
              </div>
              <div className={classes.productDescription}>
                <Typography color="primary" variant="caption" display="block">
                  Produto {product.id}
                </Typography>
                <Typography variant="h6">{product.name}</Typography>
                <Typography>{product.description}</Typography>
              </div>
            </div>
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
          <Grid item xs={12} className={classes.annotationContainer}>
            <TextField
              variant="outlined"
              multiline
              rows={4}
              label="Tem alguma observação?"
              placeholder="Por exemplo, carne do hamburguer bem passada"
              fullWidth
              margin="normal"
              value={product.annotation}
              onChange={event => setProduct({ ...product, annotation: event.target.value })}
            />
          </Grid>
        </Grid>
        <ProductComplementAction
          amount={amount}
          complementsPrice={complementsPrice}
          handleAmountDown={handleAmountDown}
          handleAmountUp={handleAmountUp}
          handleUpdateCartProduct={handleUpdateCartProduct}
          product={product}
        />
      </Fragment>
    </CustomDialog>
  );
}
