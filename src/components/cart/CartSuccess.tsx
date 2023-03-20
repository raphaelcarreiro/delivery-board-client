import React, { FC } from 'react';
import { Button, makeStyles, Typography } from '@material-ui/core';
import { Done } from '@material-ui/icons';
import { useRouter } from 'next/router';
import { useSelector } from 'src/store/redux/selector';
import { useApp } from 'src/providers/AppProvider';

const styles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    textAlign: 'center',
    '& svg': {
      color: theme.palette.success.main,
      fontSize: 52,
    },
  },
}));

const CartSuccess: FC = () => {
  const classes = styles();
  const router = useRouter();
  const movement = useSelector(state => state.boardMovement);
  const app = useApp();

  function handleClick() {
    app.handleCartVisibility(false);
    router.push({
      pathname: '/board',
      query: movement ? { session: movement.id } : undefined,
    });
  }

  return (
    <div className={classes.container}>
      <Done />
      <div>
        <Typography variant="h6">Obrigado! Seu pedido foi enviado</Typography>
      </div>
      <Button variant="text" color="primary" onClick={handleClick}>
        Visualizar pedido
      </Button>
    </div>
  );
};

export default CartSuccess;
