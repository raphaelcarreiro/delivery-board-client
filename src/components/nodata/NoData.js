import React from 'react';
import { Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles({
  button: {
    marginTop: 20,
    display: 'flex',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
});

function NoData({ message, action, buttonText, secondaryMessage }) {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Typography variant="h5" color="textSecondary">
        {message}
      </Typography>
      {secondaryMessage && (
        <Typography variant="body2" color="textSecondary">
          {secondaryMessage}
        </Typography>
      )}
      {buttonText && (
        <div className={classes.button}>
          <Button variant="outlined" size="large" onClick={action} color="primary">
            {buttonText}
          </Button>
        </div>
      )}
    </div>
  );
}

NoData.propTypes = {
  message: PropTypes.string.isRequired,
  secondaryMessage: PropTypes.string,
  action: PropTypes.func,
  buttonText: PropTypes.string,
};

export default NoData;
