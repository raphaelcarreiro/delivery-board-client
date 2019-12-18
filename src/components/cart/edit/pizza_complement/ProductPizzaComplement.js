import React, { useState, useEffect, useContext } from 'react';
import { Typography, Grid, TextField } from '@material-ui/core';
import { makeStyles, fade } from '@material-ui/core/styles';
import ProductPizzaComplementItem from './ProductPizzaComplementItem';
import { MessagingContext } from 'src/components/messaging/Messaging';
import CustomDialog from 'src/components/dialog/CustomDialog';
import ProductPizzaComplementAction from './ProductPizzaComplementAction';
import ProductPizzaComplementAdditional from './ProductPizzaComplementAdditional';
import ProductPizzaComplementIngredient from './ProductPizzaComplementIngredient';
import PropTypes from 'prop-types';

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
    borderRadius: 4,
    backgroundColor: theme.palette.primary.dark,
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
    marginBottom: 150,
  },
}));

ProductPizzaComplement.propTypes = {
  selectedProduct: PropTypes.object.isRequired,
  onExited: PropTypes.func.isRequired,
  handleUpdateCartProduct: PropTypes.func.isRequired,
};

export default function ProductPizzaComplement({ selectedProduct, onExited, handleUpdateCartProduct }) {
  const [amount, setAmount] = useState(selectedProduct.amount);
  const [product, setProduct] = useState(JSON.parse(JSON.stringify(selectedProduct)));
  const messaging = useContext(MessagingContext);
  const classes = useStyles();
  const [complementsPrice, setComplementsPrice] = useState(0);
  const categoryComplementSize = product.complement_categories.find(category => category.is_pizza_size);
  const complementSizeSelected = categoryComplementSize.complements.find(complement => complement.selected);
  const [dialogIngredients, setDialogIngredients] = useState(false);
  const [dialogAdditional, setDialogAdditional] = useState(false);
  const [complementIdSelected, setComplementIdSelected] = useState(null);
  const [complementCategoryIdSelected, setComplementCategoryIdSelected] = useState(null);

  useEffect(() => {
    /*
    Calcula o valor total dos complements selecionados
   */

    let sumPrices = 0;
    let counterTaste = 0;
    let additionalPrice = 0;
    let tastePrice = 0;

    product.complement_categories.forEach(category => {
      category.complements.forEach(complement => {
        if (complement.selected) {
          counterTaste = category.is_pizza_taste && complement.selected ? counterTaste + 1 : counterTaste;
          complement.prices.forEach(price => {
            if (category.is_pizza_taste)
              tastePrice = price.selected && price.price ? tastePrice + price.price : tastePrice;
            else sumPrices = price.selected && price.price ? sumPrices + price.price : sumPrices;
          });
          complement.additional.forEach(additional => {
            if (additional.selected)
              additional.prices.forEach(price => {
                additionalPrice = price.selected && price.price ? additionalPrice + price.price : additionalPrice;
              });
          });
        }
      });
    });

    sumPrices = counterTaste > 0 ? sumPrices + tastePrice / counterTaste : sumPrices;

    setComplementsPrice(sumPrices + additionalPrice);
  }, [product]);

  function handleAmountUp() {
    if (!product.ready) {
      messaging.handleOpen('Você precisa selecionar os itens obrigatório');
      return;
    }
    setAmount(amount + 1);
  }

  function handleAmountDown() {
    if (!product.ready) {
      messaging.handleOpen('Você precisa selecionar os itens obrigatório');
      return;
    }
    if (amount > 1) {
      setAmount(amount - 1);
    }
  }

  function handleClickPizzaComplements(productId, complementCategoryId, complementId) {
    let sizeSelected;
    const complementCategory = product.complement_categories.find(category => category.id === complementCategoryId);

    const categories = product.complement_categories.map(category => {
      if (category.id === complementCategoryId) {
        const selectedAmount = category.complements.reduce((sum, complement) => {
          return complement.selected ? sum + 1 : sum;
        }, 0);

        // marca o complemento selecionado
        category.complements = category.complements.map(complement => {
          if (category.is_pizza_size) {
            complement.selected = complement.id === complementId;
          } else if (category.is_pizza_taste) {
            if (sizeSelected.taste_amount === 1) complement.selected = complement.id === complementId;
            else {
              if (complement.id === complementId) {
                if (complement.selected) complement.selected = !complement.selected;
                else if (sizeSelected.taste_amount > selectedAmount) complement.selected = !complement.selected;
              }
            }
          } else if (category.max_quantity === 1) {
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

      // marca os preços de acordo com o tamanho selecionado
      if (category.is_pizza_size) {
        sizeSelected = category.complements.find(complement => complement.selected);
        if (sizeSelected)
          product.complement_categories.map(category => {
            category.complements.map(complement => {
              // desmarca todos os sabores caso o tamanho tenha sido alterado
              if (complementCategory.is_pizza_size)
                complement.selected = category.is_pizza_taste ? false : complement.selected;
              complement.prices = complement.prices.map(price => {
                price.selected = price.product_complement_size_id === sizeSelected.id;
                return price;
              });
              complement.additional = complement.additional.map(additional => {
                additional.prices = additional.prices.map(price => {
                  price.selected = price.product_complement_size_id === sizeSelected.id;
                  return price;
                });
                return additional;
              });
              return complement;
            });
            return category;
          });
      }

      return category;
    });

    // verifica se o produto pode ser adicionado ao pedido
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
  }

  return (
    <CustomDialog backgroundColor="#fafafa" handleModalState={onExited} title={`${product.name} - Complementos`}>
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
      <Grid container className={classes.container} direction="column">
        <Grid item xs={12}>
          {product.complement_categories.map(category => (
            <section className={classes.category} key={category.id}>
              {category.is_pizza_taste ? (
                <div className={classes.header}>
                  <div>
                    <Typography className={classes.categoryName} variant="h6">
                      {category.name}
                    </Typography>
                    {complementSizeSelected.taste_amount === 1 ? (
                      <Typography color="textSecondary" variant="body2">
                        Escolha 1 opção.
                      </Typography>
                    ) : (
                      <Typography color="textSecondary" variant="body2">
                        Escolha até {complementSizeSelected.taste_amount} opções.
                      </Typography>
                    )}
                  </div>
                  <div>{category.is_required && <span className={classes.chip}>Obrigatório</span>}</div>
                </div>
              ) : (
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
              )}
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
        <Grid item xs={12} className={classes.annotationContainer}>
          <TextField
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
      <ProductPizzaComplementAction
        amount={amount}
        complementsPrice={complementsPrice}
        handleAmountDown={handleAmountDown}
        handleAmountUp={handleAmountUp}
        handleUpdateCartProduct={handleUpdateCartProduct}
        product={product}
        isReady={product.ready}
      />
    </CustomDialog>
  );
}
