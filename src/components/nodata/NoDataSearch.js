import React from 'react';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const styles = {
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
};

function NoDataSearch({ classes, message, secondaryMessage }) {
  return (
    <div className={classes.container}>
      <Typography variant={'h4'}>{message}</Typography>
      <Typography>{secondaryMessage}</Typography>
    </div>
  );
}

NoDataSearch.propTypes = {
  message: PropTypes.string.isRequired,
  action: PropTypes.func,
  buttonText: PropTypes.string,
};

export default withStyles(styles)(NoDataSearch);
