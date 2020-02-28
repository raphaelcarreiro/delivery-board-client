import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles({
  additional: {
    color: '#4CAF50',
    marginRight: 6,
    display: 'inline-block',
  },
});

CartProductComplementAdditional.propTypes = {
  additional: PropTypes.array.isRequired,
};

export default function CartProductComplementAdditional({ additional }) {
  const classes = useStyles();

  return (
    <>
      {additional.map(
        item =>
          item.selected && (
            <Typography variant="caption" className={classes.additional} key={item.id}>
              {`+ ${item.name}`}
            </Typography>
          )
      )}
    </>
  );
}
