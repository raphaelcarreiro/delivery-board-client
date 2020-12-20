import React, { useContext } from 'react';
import { Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { CustomDialogContext } from 'src/components/dialog/CustomDialog';
import { Product } from 'src/types/product';
import { useRouter } from 'next/router';
import { useProducts } from 'src/components/products/hooks/useProducts';

const useStyles = makeStyles(theme => ({
  finalPrice: {
    color: ({ isSelected }: { isSelected: boolean }) => (isSelected ? theme.palette.primary.contrastText : '#888'),
    textAlign: 'right',
    minWidth: 80,
    fontWeight: 500,
  },
}));

type ProductAddButtonProps = {
  product: Product;
  total: string;
};

const ProductAddButton: React.FC<ProductAddButtonProps> = ({ product, total }) => {
  const classes = useStyles({ isSelected: !!product.ready });
  const { handleCloseDialog } = useContext(CustomDialogContext);
  const { handleAddProductToCart, redirectToMenuAfterAddToCart } = useProducts();
  const router = useRouter();

  function handleConfirm() {
    if (!product.ready) return;
    handleAddProductToCart();
    handleCloseDialog();
    if (redirectToMenuAfterAddToCart) router.push('/menu');
  }

  return (
    <Button disabled={!product.ready} variant="contained" size="large" color="primary" onClick={handleConfirm}>
      <span>Adicionar</span>
      <Typography className={classes.finalPrice} color="textPrimary">
        {total}
      </Typography>
    </Button>
  );
};

export default ProductAddButton;
