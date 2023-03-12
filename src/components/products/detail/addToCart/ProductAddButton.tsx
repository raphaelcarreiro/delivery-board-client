import React from 'react';
import { Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Product } from 'src/types/product';
import { useProducts } from 'src/components/products/hooks/useProducts';
import { CartProduct } from 'src/types/cart';
import { useModal } from 'src/components/modal/hooks/useModal';

const useStyles = makeStyles(theme => ({
  finalPrice: {
    color: ({ isSelected }: { isSelected: boolean }) => (isSelected ? theme.palette.primary.contrastText : '#888'),
    textAlign: 'right',
    minWidth: 80,
    fontWeight: 500,
  },
}));

type ProductAddButtonProps = {
  product: Product | null;
  total: string;
  amount: number;
};

const ProductAddButton: React.FC<ProductAddButtonProps> = ({ product, total, amount }) => {
  const classes = useStyles({ isSelected: !!product?.ready });
  const { handleModalClose } = useModal();
  const { handleAddProductToCart } = useProducts();

  function handleConfirm() {
    if (!product?.ready) {
      return;
    }

    handleAddProductToCart(product as CartProduct, amount);
    handleModalClose();
  }

  return (
    <Button disabled={!product?.ready} variant="contained" size="large" color="primary" onClick={handleConfirm}>
      <span>Adicionar</span>
      <Typography className={classes.finalPrice} color="textPrimary">
        {total}
      </Typography>
    </Button>
  );
};

export default ProductAddButton;
