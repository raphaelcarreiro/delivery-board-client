import React from 'react';
import { Product } from 'src/types/product';
import Products from '../products/Products';

type OffersProps = {
  products: Product[];
};

const Offers: React.FC<OffersProps> = ({ products }) => {
  return (
    <>
      <Products products={products} categoryName="ofertas" categoryType="OFFER" />
    </>
  );
};

export default Offers;
