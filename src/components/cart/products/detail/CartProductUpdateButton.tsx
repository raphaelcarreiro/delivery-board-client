import React, { useContext } from 'react';
import { Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { CustomDialogContext } from 'src/components/dialog/CustomDialog';
import { Product } from 'src/types/product';
import { useCart } from '../../hooks/useCart';

const useStyles = makeStyles(theme => ({
  finalPrice: {
    color: ({ isSelected }: { isSelected: boolean }) => (isSelected ? theme.palette.primary.contrastText : '#888'),
    textAlign: 'right',
    minWidth: 80,
    fontWeight: 500,
  },
}));

type CartProductUpdateButtonProps = {
  product: Product;
  total: string;
  amount: number;
};

const CartProductUpdateButton: React.FC<CartProductUpdateButtonProps> = ({ product, total, amount }) => {
  const classes = useStyles({ isSelected: !!product.ready });
  const { handleCloseDialog } = useContext(CustomDialogContext);
  const { handleUpdateCartProduct } = useCart();

  function handleConfirm() {
    if (!product.ready) return;
    handleUpdateCartProduct(product, amount);
    handleCloseDialog();
  }

  return (
    <Button disabled={!product.ready} variant="contained" size="large" color="primary" onClick={handleConfirm}>
      <span>Atualizar</span>
      <Typography className={classes.finalPrice} color="textPrimary">
        {total}
      </Typography>
    </Button>
  );
};

export default CartProductUpdateButton;
