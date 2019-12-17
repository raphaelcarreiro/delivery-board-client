import React, { useState, useEffect, useContext } from 'react';
import { Typography, Grid } from '@material-ui/core';
import { makeStyles, fade } from '@material-ui/core/styles';
import ProductComplementItem from './ProductComplementItem';
import { MessagingContext } from '../../../../messaging/Messaging';
import ProductComplementAction from './ProductComplementAction';
import PropTypes from 'prop-types';
import CustomDialog from 'src/components/dialog/CustomDialog';
import { moneyFormat } from 'src/helpers/numberFormat';

const useStyles = makeStyles(theme => ({
  header: {
    border: `1px solid ${fade(theme.palette.primary.main, 0.1)}`,
    padding: '7px 15px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff8dc',
  },
  chip: {
    display: 'inline-block',
    padding: '3px 5px',
    borderRadius: 4,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontSize: 10,
  },
  category: {
    display: 'block',
    margin: '10px 0',
  },
  categoryName: {
    fontWeight: 400,
  },
  container: {
    marginBottom: 100,
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
  handleAddProductToCart: PropTypes.func.isRequired,
  handlePrepareProduct: PropTypes.func.isRequired,
};

function ProductComplement({ onExited, selectedProduct, handleAddProductToCart, handlePrepareProduct }) {
  const [amount, setAmount] = useState(1);
  const [product, setProduct] = useState(JSON.parse(JSON.stringify(selectedProduct)));
  const messaging = useContext(MessagingContext);
  const classes = useStyles();
  const [complementsPrice, setComplementsPrice] = useState(0);

  useEffect(() => {
    const categories = product.complement_categories.map(category => {
      category.product_complement_category_id = category.id;
      category.complements = category.complements.map((complement, index) => {
        complement.product_complement_id = complement.id;
        complement.selected = category.is_pizza_size && index === 0;
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

    setProduct({
      ...product,
      ready: false,
      complement_categories: categories,
    });
  }, []);

  useEffect(() => {
    handlePrepareProduct(product, amount);
    // eslint-disable-next-line
  }, [amount]);

  useEffect(() => {
    setComplementsPrice(
      product.complement_categories.reduce((value, category) => {
        const categoryPrice = category.complements.reduce((sum, complement) => {
          return complement.selected && complement.price ? sum + complement.price : sum;
        }, 0);
        return categoryPrice + value;
      }, 0)
    );
    handlePrepareProduct(product, amount);
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

  return (
    <CustomDialog backgroundColor="#fafafa" handleModalState={onExited} title={`${product.name} - Complementos`}>
      <Grid container className={classes.container}>
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
              />
            </section>
          ))}
        </Grid>
      </Grid>
      <ProductComplementAction
        amount={amount}
        complementsPrice={complementsPrice}
        handleAmountDown={handleAmountDown}
        handleAmountUp={handleAmountUp}
        handleConfirmProduct={handleConfirmProduct}
        product={product}
        isReady={product.ready}
      />
    </CustomDialog>
  );
}

export default ProductComplement;
