import React, { useState, useContext } from 'react';
import ImagePreview from '../../image-preview/ImagePreview';
import MenuProductList from './ProductList';
import PropTypes from 'prop-types';
import ProductView from './view/simple/ProductView';
import { useDispatch } from 'react-redux';
import { prepareProduct, addToCart } from '../../../store/redux/modules/cart/actions';
import { MessagingContext } from '../../messaging/Messaging';
import ProductPizzaComplement from './view/pizza_complement/ProductPizzaComplement';
import ProductComplement from './view/complement/ProductComplement';

Product.propTypes = {
  products: PropTypes.array.isRequired,
  categoryName: PropTypes.string,
};

export default function Product({ products, categoryName }) {
  const [imagePreview, setImagePreview] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dialogProductView, setDialogProductView] = useState(false);
  const [dialogProductComplement, setDialogProductComplement] = useState(false);
  const dispatch = useDispatch();
  const messaging = useContext(MessagingContext);

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
    event.stopPropagation();

    setSelectedProduct(product);
    setImagePreview(true);
  }

  function handlePrepareProduct(product, amount) {
    dispatch(prepareProduct(product, amount));
  }

  function handleAddProductToCart() {
    dispatch(addToCart());
    messaging.handleOpen('Produto adicionado a cesta');
  }

  return (
    <>
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
      <MenuProductList
        products={products}
        handleProductClick={handleProductClick}
        handleOpenImagePreview={handleOpenImagePreview}
      />
    </>
  );
}
