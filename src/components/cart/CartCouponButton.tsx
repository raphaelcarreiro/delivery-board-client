import React, { Dispatch, SetStateAction } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { Chip, Button } from '@material-ui/core';
import { removeCoupon } from 'src/store/redux/modules/cart/actions';
import { useSelector } from 'src/store/redux/selector';

const useStyles = makeStyles({
  coupon: {
    textAlign: 'right',
    marginBottom: 15,
  },
});

interface CartCouponButtonProps {
  setCouponView: Dispatch<SetStateAction<boolean>>;
}

export default function CartCouponButton({ setCouponView }: CartCouponButtonProps) {
  const classes = useStyles();
  const cart = useSelector(state => state.cart);
  const dispatch = useDispatch();

  function handleRemoveCoupon() {
    dispatch(removeCoupon());
  }

  return (
    <div className={classes.coupon}>
      {cart.coupon ? (
        <Chip label={`Cupom ${cart.coupon.name}`} onDelete={handleRemoveCoupon} variant="default" color="secondary" />
      ) : (
        <Button variant="text" color="primary" onClick={() => setCouponView(true)}>
          Aplicar cupom
        </Button>
      )}
    </div>
  );
}
