import React from 'react';
import DialogInput, { DialogInputConsumer } from 'src/components/dialog/DialogInput';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    height: 200,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginBottom: 20,
  },
});

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
            <Typography variant="h6" className={classes.message}>
              {restaurant.name} está fechado no momento.
            </Typography>
            <Button variant="contained" color="primary" onClick={handleCloseDialog}>
              OK
            </Button>
          </div>
        )}
      </DialogInputConsumer>
    </DialogInput>
  );
}
