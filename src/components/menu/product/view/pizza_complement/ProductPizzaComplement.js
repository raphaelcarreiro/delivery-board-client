import React, { useState, useEffect, useContext } from 'react';
import { Typography, Grid } from '@material-ui/core';
import { makeStyles, fade } from '@material-ui/core/styles';
import ProductPizzaComplementItem from './ProductPizzaComplementItem';
import { MessagingContext } from '../../../../messaging/Messaging';
import ProductPizzaComplementAction from './ProductPizzaComplementAction';
import ProductPizzaComplementAdditional from './ProductPizzaComplementAdditional';
import ProductPizzaComplementIngredient from './ProductPizzaComplementIngredient';
import PropTypes from 'prop-types';
import { moneyFormat } from '../../../../../helpers/numberFormat';
import CustomDialog from 'src/components/dialog/CustomDialog';
import ProductPizzaComplementHeader from './ProductPizzaComplementHeader';

const useStyles = makeStyles(theme => ({
  header: {
    border: `1px solid ${fade(theme.palette.primary.main, 0.1)}`,
    padding: '7px 15px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff8dc',
    borderRadius: '4px 4px 0 0',
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
    marginBottom: 150,
  },
}));

ProductPizzaComplement.propTypes = {
  onExited: PropTypes.func.isRequired,
  handleAddProductToCart: PropTypes.func.isRequired,
  handlePrepareProduct: PropTypes.func.isRequired,
  selectedProduct: PropTypes.object.isRequired,
};

export default function ProductPizzaComplement({
  onExited,
  selectedProduct,
  handleAddProductToCart,
  handlePrepareProduct,
}) {
  const classes = useStyles();
  const [amount, setAmount] = useState(1);
  const [product, setProduct] = useState(JSON.parse(JSON.stringify(selectedProduct)));
  const [complementsPrice, setComplementsPrice] = useState(0);
  const [dialogIngredients, setDialogIngredients] = useState(false);
  const [dialogAdditional, setDialogAdditional] = useState(false);
  const [complementIdSelected, setComplementIdSelected] = useState(null);
  const [complementCategoryIdSelected, setComplementCategoryIdSelected] = useState(null);
  const [complementSizeSelected, setComplementSizeSelected] = useState({});
  const messaging = useContext(MessagingContext);

  useEffect(() => {
    const categories = product.complement_categories.map(category => {
      category.product_complement_category_id = category.id;
      category.complements = category.complements.map((complement, index) => {
        complement.product_complement_id = complement.id;
        // complement.selected = category.is_pizza_size && index === 0;
        complement.formattedPrice = complement.price && moneyFormat(complement.price);

        complement.prices = complement.prices.map((price, index) => {
          price.product_complement_price_id = price.id;
          price.formattedPrice = price.price && moneyFormat(price.price);
          // price.selected = index === 0;
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
            // price.selected = index === 0;
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
    // Calcula o valor total dos complements selecionados
    let sumPrices = 0;
    let counterTaste = 0;
    let tastePrice = 0;
    let additionalPrice = 0;

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
    handlePrepareProduct(product, amount);
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

  function handleConfirmProduct() {
    if (!product.ready) {
      messaging.handleOpen('Você precisa selecionar os itens obrigatório');
      return;
    }
    handleAddProductToCart();
  }

  function handleClickPizzaComplements(productId, complementCategoryId, complementId) {
    const complementCategory = product.complement_categories.find(category => category.id === complementCategoryId);

    const complementCategorySize = product.complement_categories.find(category => category.is_pizza_size);
    let sizeSelected = complementCategorySize.complements.find(complement => complement.selected);

    if (!complementCategory.is_pizza_size && !sizeSelected) {
      messaging.handleOpen('É necessário escolher o tamanho da pizza primeiro');
      return;
    }

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

      return category;
    });

    sizeSelected = complementCategorySize.complements.find(complement => complement.selected);

    // marca os preços de acordo com o tamanho selecionado
    if (complementCategory.is_pizza_size && sizeSelected)
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
    setComplementSizeSelected(sizeSelected);

    if (ready) handlePrepareProduct(newProduct);
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
      <Grid container className={classes.container} justify="center">
        <Grid item xs={12}>
          {product.complement_categories.map(category => (
            <section className={classes.category} key={category.id}>
              <ProductPizzaComplementHeader category={category} complementSizeSelected={complementSizeSelected} />
              {(category.is_pizza_size || complementSizeSelected.id) && (
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
              )}
            </section>
          ))}
        </Grid>
      </Grid>
      <ProductPizzaComplementAction
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
