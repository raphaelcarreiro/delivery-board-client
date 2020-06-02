import React from 'react';
import DialogInput, { DialogInputConsumer } from 'src/components/dialog/DialogInput';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    height: 200,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingTop: 30,
  },
  message: {
    marginBottom: 30,
    [theme.breakpoints.down('sm')]: {
      fontSize: 20,
    },
  },
}));

CartClosedRestaurant.propTypes = {
  onExited: PropTypes.func.isRequired,
};

export default function CartClosedRestaurant({ onExited }) {
  const classes = useStyles();
  const restaurant = useSelector(state => state.restaurant) || {};

  return (
    <DialogInput onExited={onExited} maxWidth="sm">
      <DialogInputConsumer>
        {({ handleCloseDialog }) => (
          <div className={classes.container}>
            <Typography variant="h5" className={classes.message}>
              {restaurant.name} está fechado no momento.
            </Typography>
            <Button variant="contained" color="primary" onClick={handleCloseDialog}>
              FECHAR
            </Button>
          </div>
        )}
      </DialogInputConsumer>
    </DialogInput>
  );
}
