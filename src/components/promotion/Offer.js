import React from 'react';
import PropTypes from 'prop-types';
import Product from '../menu/product/Product';

Offer.propTypes = {
  products: PropTypes.array.isRequired,
};

export default function Offer({ products }) {
  return (
    <>
      <Product products={products} categoryName="Promoções" categoryUrl="/offers" />;
    </>
  );
}
