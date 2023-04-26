import React from 'react';
import DialogInput, { DialogInputConsumer } from 'src/components/dialog/DialogInput';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button } from '@material-ui/core';
import { useSelector } from 'src/store/redux/selector';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    minHeight: 250,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    textAlign: 'center',
    flex: 1,
  },
  message: {
    [theme.breakpoints.down('sm')]: {
      fontSize: 20,
    },
  },
}));

interface CartClosedRestaurantProps {
  onExited(): void;
}

export default function CartClosedRestaurant({ onExited }: CartClosedRestaurantProps) {
  const classes = useStyles();
  const restaurant = useSelector(state => state.restaurant);

  return (
    <DialogInput onExited={onExited} maxWidth="sm">
      <DialogInputConsumer>
        {({ handleCloseDialog }) => (
          <div className={classes.container}>
            <Typography variant="h6" className={classes.message}>
              A cozinha de {restaurant?.name} está fechada
            </Typography>
            <Button variant="contained" color="primary" onClick={handleCloseDialog}>
              Entendi :(
            </Button>
          </div>
        )}
      </DialogInputConsumer>
    </DialogInput>
  );
}
