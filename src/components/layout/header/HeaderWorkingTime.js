import React from 'react';
import DialogInput, { DialogInputConsumer } from 'src/components/dialog/DialogInput';
import { Typography, Button } from '@material-ui/core';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    height: 250,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'column',
    '&>div': {
      textAlign: 'center',
    },
  },
  action: {
    marginTop: 30,
  },
});

HeaderWorkingTime.propTypes = {
  onExited: PropTypes.func.isRequired,
};

export default function HeaderWorkingTime({ onExited }) {
  const restaurant = useSelector(state => state.restaurant);
  const classes = useStyles();

  return (
    <DialogInput onExited={onExited} maxWidth="xs">
      <div className={classes.container}>
        <DialogInputConsumer>
          {({ handleCloseDialog }) => (
            <>
              <div>
                <Typography variant="h5" gutterBottom>
                  Atendimento
                </Typography>
                <Typography variant="body1">{restaurant.working_hours}</Typography>
              </div>
              <div className={classes.action}>
                <Button variant="contained" color="primary" onClick={handleCloseDialog}>
                  Fechar
                </Button>
              </div>
            </>
          )}
        </DialogInputConsumer>
      </div>
    </DialogInput>
  );
}
