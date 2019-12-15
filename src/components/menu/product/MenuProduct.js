import React, { useState } from 'react';
import ImagePreview from '../../image-preview/ImagePreview';
import MenuProductList from './MenuProductList';
import PropTypes from 'prop-types';
import MenuProductView from './MenuProductView';

MenuProduct.propTypes = {
  products: PropTypes.array.isRequired,
  categoryName: PropTypes.string,
};

export default function MenuProduct({ products, categoryName }) {
  const [imagePreview, setImagePreview] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dialogProductView, setDialogProductView] = useState(false);

  function handleProductClick(product) {
    setSelectedProduct(product);
    setDialogProductView(true);
  }

  function handleOpenImagePreview(event, product) {
    event.stopPropagation();

    setSelectedProduct(product);
    setImagePreview(true);
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
      {dialogProductView && <MenuProductView onExited={() => setDialogProductView(false)} product={selectedProduct} />}
      <MenuProductList
        products={products}
        handleProductClick={handleProductClick}
        handleOpenImagePreview={handleOpenImagePreview}
      />
    </>
  );
}
