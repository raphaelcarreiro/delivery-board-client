import { alpha, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'src/store/redux/selector';

const styles = makeStyles(theme => ({
  container: (props: { isPaid: boolean }) => ({
    display: 'flex',
    padding: 20,
    backgroundColor: alpha(props.isPaid ? theme.palette.success.main : theme.palette.warning.main, 0.2),
    flexDirection: 'column',
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
  }),
}));

const BoardTotal: React.FC = () => {
  const movement = useSelector(state => state.boardMovement);

  const classes = styles({ isPaid: false });

  const products = movement?.products.reduce((previous, product) => previous + product.amount, 0);

  const orders = new Set(movement?.products.map(product => product.id)).size;

  return (
    <div className={classes.container}>
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
  );
};

export default BoardTotal;
