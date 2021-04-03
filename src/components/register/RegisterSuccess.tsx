import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button } from '@material-ui/core';
import Link from '../link/Link';
import { FiCheck } from 'react-icons/fi';
import { useSelector } from 'src/store/redux/selector';

const useStyles = makeStyles({
  container: {
    textAlign: 'center',
  },
});

const RegisterSucess: React.FC = () => {
  const classes = useStyles();
  const restaurant = useSelector(state => state.restaurant);

  useEffect(() => {
    gtag('event', 'sign_up', {
      method: restaurant?.name,
    });
  }, [restaurant]);

  return (
    <div className={classes.container}>
      <FiCheck color="#3ac359" size={66} />
      <Typography gutterBottom>Pronto! Você já pode matar sua fome.</Typography>
      <Button color="primary" component={Link} href="/menu" variant="text" size="large">
        Ver cardápio
      </Button>
    </div>
  );
};

export default RegisterSucess;
