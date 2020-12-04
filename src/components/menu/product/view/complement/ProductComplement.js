import React, { useState, useEffect, useContext } from 'react';
import { Typography, Grid, TextField } from '@material-ui/core';
import { makeStyles, fade } from '@material-ui/core/styles';
import ProductComplementItem from './ProductComplementItem';
import ProductComplementAction from './ProductComplementAction';
import PropTypes from 'prop-types';
import CustomDialog from 'src/components/dialog/CustomDialog';
import { moneyFormat } from 'src/helpers/numberFormat';
import ImagePreview from 'src/components/image-preview/ImagePreview';
import { api } from 'src/services/api';
import InsideLoading from 'src/components/loading/InsideLoading';
import { useMessaging } from 'src/hooks/messaging';

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
    [theme.breakpoints.down('sm')]: {
      marginRight: 0,
    },
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
  productId: PropTypes.number.isRequired,
  productName: PropTypes.string.isRequired,
  handleAddProductToCart: PropTypes.func.isRequired,
  handlePrepareProduct: PropTypes.func.isRequired,
};

function ProductComplement({ onExited, productId, productName, handleAddProductToCart, handlePrepareProduct }) {
  const [amount, setAmount] = useState(1);
  const [imagePreview, setImagePreview] = useState(false);
  const [product, setProduct] = useState(null);
  const messaging = useMessaging();
  const classes = useStyles();
  const [complementsPrice, setComplementsPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/products/${productId}`)
      .then(response => {
        const categories = response.data.complement_categories.map(category => {
          category.product_complement_category_id = category.id;
          category.complements = category.complements.map((complement, index) => {
            complement.product_complement_id = complement.id;
            complement.selected = !!complement.selected;
            complement.formattedPrice = complement.price && moneyFormat(complement.price);

            complement.prices = complement.prices.map((price, index) => {
              price.product_complement_price_id = price.id;
              price.formattedPrice = price.price && moneyFormat(price.price);
              price.selected = index === 0;
              return price;
            });

            complement.ingredients = complement.ingredients.map(ingredient => {
              ingredient.product_complement_ingredient_id = ingredient.id;
              return ingredient;
            });

            complement.additional = complement.additional.map(additional => {
              additional.product_complement_additional_id = additional.id;
              additional.prices = additional.prices.map((price, index) => {
                price.product_complement_additional_price_id = price.id;
                price.selected = index === 0;
                price.formattedPrice = price.price && moneyFormat(price.price);
                return price;
              });
              return additional;
            });
            return complement;
          });
          return category;
        });

        const ready = response.data.complement_categories.every(category => {
          if (category.is_required) {
            const selectedAmount = category.complements.reduce((sum, complement) => {
              return complement.selected ? sum + 1 : sum;
            }, 0);

            return category.min_quantity <= selectedAmount;
          }
          return true;
        });

        setProduct({
          ...response.data,
          ready,
          complement_categories: categories,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [productId]);

  useEffect(() => {
    if (!product) return;

    handlePrepareProduct(product, amount);
  }, [amount, product, handlePrepareProduct]);

  useEffect(() => {
    if (!product) return;

    setComplementsPrice(
      product.complement_categories.reduce((value, category) => {
        const categoryPrice = category.complements.reduce((sum, complement) => {
          return complement.selected && complement.price ? sum + complement.price : sum;
        }, 0);
        return categoryPrice + value;
      }, 0)
    );
    handlePrepareProduct(product, amount);
  }, [amount, handlePrepareProduct, product]);

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

  function handleConfirmProduct() {
    if (!product.ready) {
      messaging.handleOpen('Você precisa selecionar os itens obrigatórios');
      return;
    }
    // 2 é a etapa
    handleAddProductToCart();
  }

  function handleClickComplements(productId, complementCategoryId, complementId) {
    const categories = product.complement_categories.map(category => {
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

    const ready = product.complement_categories.every(category => {
      if (category.is_required) {
        const selectedAmount = category.complements.reduce((sum, complement) => {
          return complement.selected ? sum + 1 : sum;
        }, 0);

        return category.min_quantity <= selectedAmount;
      }
      return true;
    });

    const newProduct = {
      ...product,
      ready,
      complement_categories: categories,
    };

    setProduct(newProduct);

    if (ready) handlePrepareProduct(newProduct);
  }

  function handleImagePreview() {
    setImagePreview(!imagePreview);
  }

  return (
    <CustomDialog
      backgroundColor="#fafafa"
      handleModalState={onExited}
      title={`${productName} complementos`}
      displayBottomActions
      maxWidth="sm"
    >
      {imagePreview && product.image && (
        <ImagePreview src={product.image.imageUrl} description={product.name} onExited={handleImagePreview} />
      )}
      {loading ? (
        <InsideLoading />
      ) : (
        <>
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
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography>{product.description}</Typography>
                </div>
              </div>
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
                    productId={product.id}
                    complementCategoryId={category.id}
                    handleClickComplements={handleClickComplements}
                    complements={category.complements}
                    maxQuantity={category.max_quantity}
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
            handleConfirmProduct={handleConfirmProduct}
            product={product}
            isReady={product.ready || false}
          />
        </>
      )}
    </CustomDialog>
  );
}

export default ProductComplement;
