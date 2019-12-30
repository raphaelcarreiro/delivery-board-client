import React, { useContext } from 'react';
import { Grid, Typography } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { AppContext } from 'src/App';

const useStyles = makeStyles({
  header: {
    marginBottom: 20,
  },
});

function PageHeader({ title, description }) {
  const classes = useStyles();
  const app = useContext(AppContext);

  return (
    <>
      {!app.isMobile && app.windowWidth >= 960 && (
        <Grid className={classes.header} item xs={12}>
          <Typography variant="h6">{title}</Typography>
          <Typography color="textSecondary">{description}</Typography>
        </Grid>
      )}
    </>
  );
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
};

export default PageHeader;
