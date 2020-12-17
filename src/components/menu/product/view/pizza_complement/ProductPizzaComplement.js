import React, { useState, useEffect, useContext } from 'react';
import { Grid, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ProductPizzaComplementItem from './ProductPizzaComplementItem';
import ProductPizzaComplementAction from './ProductPizzaComplementAction';
import ProductPizzaComplementAdditional from './ProductPizzaComplementAdditional';
import ProductPizzaComplementIngredient from './ProductPizzaComplementIngredient';
import PropTypes from 'prop-types';
import { moneyFormat } from '../../../../../helpers/numberFormat';
import CustomDialog from 'src/components/dialog/CustomDialog';
import ProductPizzaComplementHeader from './ProductPizzaComplementHeader';
import { useSelector } from 'react-redux';
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
  category: {
    display: 'block',
    marginBottom: 10,
  },
  container: {
    marginBottom: 0,
  },
}));

ProductPizzaComplement.propTypes = {
  onExited: PropTypes.func.isRequired,
  handleAddProductToCart: PropTypes.func.isRequired,
  handlePrepareProduct: PropTypes.func.isRequired,
  productId: PropTypes.number.isRequired,
  productName: PropTypes.string.isRequired,
};

export default function ProductPizzaComplement({
  onExited,
  productId,
  productName,
  handleAddProductToCart,
  handlePrepareProduct,
}) {
  const classes = useStyles();
  const [amount, setAmount] = useState(1);
  const [product, setProduct] = useState(null);
  const [filteredProduct, setFilteredProduct] = useState(null);
  const [complementsPrice, setComplementsPrice] = useState(0);
  const [dialogIngredients, setDialogIngredients] = useState(false);
  const [dialogAdditional, setDialogAdditional] = useState(false);
  const [complementIdSelected, setComplementIdSelected] = useState(null);
  const [complementCategoryIdSelected, setComplementCategoryIdSelected] = useState(null);
  const [complementSizeSelected, setComplementSizeSelected] = useState({});
  const messaging = useMessaging();
  const restaurant = useSelector(state => state.restaurant);
  const [searchedCategoryId, setSearchedCategoryId] = useState(null);
  const [searchedValue, setSearchedValue] = useState('');
  const [imagePreview, setImagePreview] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let sizeSelected = {};

    api
      .get(`/products/${productId}`)
      .then(response => {
        const categories = response.data.complement_categories.map(category => {
          category.product_complement_category_id = category.id;
          category.complements = category.complements.map((complement, index) => {
            complement.product_complement_id = complement.id;
            complement.formattedPrice = complement.price && moneyFormat(complement.price);
            if (category.is_pizza_size && category.complements.length === 1) {
              complement.selected = true;
              sizeSelected = complement;
              setComplementSizeSelected(complement);
            } else {
              complement.selected = !!complement.selected;
            }

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
                price.selected = price.product_complement_size_id === sizeSelected.id;
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
          ...response.data,
          ready: false,
          complement_categories: categories,
        });

        setFilteredProduct({
          ...response.data,
          ready: false,
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

    // Calcula o valor total dos complements selecionados
    let sumPrices = 0;
    let counterTaste = 0;
    let tastePrice = 0;
    let additionalPrice = 0;
    const tastePrices = [];

    product.complement_categories.forEach(category => {
      category.complements.forEach(complement => {
        if (complement.selected) {
          counterTaste = category.is_pizza_taste && complement.selected ? counterTaste + 1 : counterTaste;
          complement.prices.forEach(price => {
            if (category.is_pizza_taste) {
              tastePrice = price.selected && price.price ? tastePrice + price.price : tastePrice;
              if (price.selected) tastePrices.push(price.price);
            } else sumPrices = price.selected && price.price ? sumPrices + price.price : sumPrices;
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

    if (counterTaste > 0) {
      if (restaurant.configs.pizza_calculate === 'average_value') sumPrices = sumPrices + tastePrice / counterTaste;
      else if (restaurant.configs.pizza_calculate === 'higher_value')
        sumPrices = sumPrices + Math.max.apply(Math, tastePrices);
    }

    setComplementsPrice(sumPrices + additionalPrice);
    handlePrepareProduct(product, amount);
  }, [amount, handlePrepareProduct, product, restaurant]);

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
                else if (sizeSelected.taste_amount === selectedAmount)
                  messaging.handleOpen(
                    `Apenas ${sizeSelected.taste_amount} ${
                      sizeSelected.taste_amount > 1 ? 'sabores' : 'sabor'
                    } você pode selecionar`
                  );
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
    setFilteredProduct(newProduct);
    handleSearch(searchedCategoryId, searchedValue);
    setComplementSizeSelected(sizeSelected);

    if (ready) handlePrepareProduct(newProduct);
  }

  function handleSearch(categoryId, searchValue) {
    setSearchedValue(searchValue);

    if (searchValue === '') {
      setFilteredProduct(product);
      setSearchedCategoryId(null);
      return;
    }

    setSearchedCategoryId(categoryId);

    const productCopy = JSON.parse(JSON.stringify(product));

    const newCategory = productCopy.complement_categories.find(c => c.id === categoryId);

    newCategory.complements = newCategory.complements.filter(complement => {
      const complementName = complement.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      return complementName.indexOf(searchValue.toLowerCase()) !== -1;
    });

    const newProduct = {
      ...product,
      complement_categories: product.complement_categories.map(category => {
        if (category.id === categoryId) {
          return newCategory;
        }
        return category;
      }),
    };

    setFilteredProduct(newProduct);
  }

  function handleImagePreview() {
    setImagePreview(!imagePreview);
  }

  return (
    <CustomDialog
      backgroundColor="#fafafa"
      handleModalState={onExited}
      title={`adicionar ao carrinho`}
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
      {imagePreview && (
        <ImagePreview onExited={handleImagePreview} src={product.image.imageUrl} description={product.name} />
      )}
      {loading ? (
        <InsideLoading />
      ) : (
        <>
          <Grid container className={classes.container} justify="center">
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
              {filteredProduct.complement_categories.map(category => (
                <section className={classes.category} key={category.id}>
                  <ProductPizzaComplementHeader
                    category={category}
                    complementSizeSelected={complementSizeSelected}
                    handleSearch={handleSearch}
                  />
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
          <ProductPizzaComplementAction
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
