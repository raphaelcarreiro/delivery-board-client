import React, { useState } from 'react';
import ImagePreview from '../../image-preview/ImagePreview';
import MenuProductList from './ProductList';
import PropTypes from 'prop-types';
import ProductView from './view/ProductView';
import { useDispatch } from 'react-redux';
import { prepareProduct, addToCart } from '../../../store/redux/modules/cart/actions';

Product.propTypes = {
  products: PropTypes.array.isRequired,
  categoryName: PropTypes.string,
};

export default function Product({ products, categoryName }) {
  const [imagePreview, setImagePreview] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dialogProductView, setDialogProductView] = useState(false);
  const dispatch = useDispatch();

  function handleProductClick(product) {
    setSelectedProduct(product);
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
      <MenuProductList
        products={products}
        handleProductClick={handleProductClick}
        handleOpenImagePreview={handleOpenImagePreview}
      />
    </>
  );
}
