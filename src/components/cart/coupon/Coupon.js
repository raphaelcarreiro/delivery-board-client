import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { setCoupon } from 'src/store/redux/modules/cart/actions';
import { api } from 'src/services/api';
import { useMessaging } from 'src/hooks/messaging';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    '& button': {
      marginRight: 10,
    },
  },
});

Coupon.propTypes = {
  setClosedCouponView: PropTypes.func.isRequired,
};

export default function Coupon({ setClosedCouponView }) {
  const classes = useStyles();
  const cart = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const [cartCoupon, setCartCoupon] = useState(cart.coupon ? cart.coupon.name : '');
  const messaging = useMessaging();
  const [loading, setLoading] = useState(false);

  function handleSetCoupon(event) {
    event.preventDefault();
    setLoading(true);
    api
      .get(`/coupons/${cartCoupon}`)
      .then(response => {
        dispatch(setCoupon(response.data));
        setClosedCouponView();
      })
      .catch(err => {
        if (err.response) messaging.handleOpen(err.response.data.error);
        else messaging.handleOpen('Não foi possível aplicar o cupom de desconto');
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      <form onSubmit={handleSetCoupon}>
        <div className={classes.container}>
          <TextField
            variant="outlined"
            label="Cupom de desconto"
            placeholder="Cupom de desconto"
            margin="normal"
            value={cartCoupon}
            onChange={e => setCartCoupon(e.target.value)}
            fullWidth
            autoFocus
            required
          />
        </div>
        <div className={classes.actions}>
          <Button color="primary" size="small" variant="text" onClick={setClosedCouponView}>
            Cancelar
          </Button>
          <Button type="submit" color="primary" size="small" variant="contained" disabled={loading}>
            {loading ? 'Aguarde...' : 'Confirmar'}
          </Button>
        </div>
      </form>
    </>
  );
}
