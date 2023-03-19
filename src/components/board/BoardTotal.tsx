import { Button, makeStyles, Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import React from 'react';
import { useSelector } from 'src/store/redux/selector';

const styles = makeStyles({
  content: {
    display: 'flex',
    // padding: 10,
    flexDirection: 'column',
    // border: '1px solid #eee',
    '& > .row': {
      display: 'grid',
      gridTemplateColumns: '1fr 3fr',
      gap: 10,
      alignItems: 'baseline',
      '& > .value': {
        textAlign: 'right',
        fontSize: 20,
      },
      '& > .bold': {
        fontWeight: 'bold',
      },
    },
  },
  container: {
    marginBottom: 100,
    display: 'flex',
    flexDirection: 'column',
    gap: 50,
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
});

const BoardTotal: React.FC = () => {
  const router = useRouter();
  const movement = useSelector(state => state.boardMovement);
  const classes = styles();
  const products = movement?.products.reduce((previous, product) => previous + product.amount, 0);
  const orders = new Set(movement?.products.map(product => product.id)).size;

  function handleClick() {
    router.push({
      pathname: '/menu',
      query: router.query,
    });
  }

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <div className="row">
          <Typography>Pedidos</Typography>
          <Typography className="value">{orders}</Typography>
        </div>
        <div className="row">
          <Typography>Produtos</Typography>
          <Typography className="value">{products}</Typography>
        </div>
        <div className="row">
          <Typography>Total</Typography>
          <Typography className="value bold">{movement?.formattedTotal}</Typography>
        </div>
        <div className="row">
          <Typography>Pago</Typography>
          <Typography className="value">{movement?.formattedTotalPaid}</Typography>
        </div>
      </div>

      <div className={classes.actions}>
        <Button variant="contained" color="primary" size="large" fullWidth onClick={handleClick}>
          ACESSAR CARDÁPIO
        </Button>

        <Button variant="text" color="primary" size="large" fullWidth>
          SOLICITAR CONTA
        </Button>
      </div>
    </div>
  );
};

export default BoardTotal;
