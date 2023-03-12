import React, { Fragment, useState } from 'react';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { APPBAR_HEIGHT, MENU_WIDTH } from '../../constants/constants';
import { useApp } from 'src/providers/AppProvider';
import { alpha, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  appBar: {
    zIndex: '1101!important',
    '@media print': {
      display: 'none',
    },
  },
  grow: {
    flexGrow: 1,
  },
  appBarShadow: {
    [theme.breakpoints.down('md')]: {
      boxShadow: 'none',
    },
  },
  appBarTitle: {
    [theme.breakpoints.down('md')]: {
      minWidth: 135,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
  appBarTabs: {
    [theme.breakpoints.down('md')]: {
      top: APPBAR_HEIGHT,
    },
    [theme.breakpoints.between('xs', 'xs') + ' and (orientation: landscape)']: {
      top: 101,
    },
    [theme.breakpoints.up('lg')]: {
      backgroundColor: theme.palette.primary.light,
    },
    transitionDuration: '225ms',
    left: 0,
  },
  appBarTabsMenuOpen: {
    left: MENU_WIDTH,
  },
  appBarTabsSpace: {
    marginBottom: 45,
    [theme.breakpoints.down('md')]: {
      marginBottom: 48,
    },
  },
  restaurantAddressContainer: {
    padding: '7px 0',
    margin: '0 15px',
    borderBottom: `1px solid ${alpha(theme.palette.primary.contrastText, 0.1)}`,
    display: 'flex',
    alignItems: 'center',
    '& .content': {
      marginLeft: 5,
      display: 'flex',
      flexDirection: 'column',
    },
    '& .restaurant-address': {
      maxWidth: 'calc(100vw - 50px)',
    },
  },
}));

function CustomAppbar({ actionComponent, title, TabComponent, cancelAction }) {
  const [appBarTabs] = useState(true);
  const classes = useStyles();
  const { isMobile, windowWidth } = useApp();

  return (
    <Fragment>
      {(isMobile || windowWidth <= 960) && (
        <>
          <AppBar
            className={`${classes.appBar} ${appBarTabs && TabComponent && classes.appBarShadow}`}
            position="fixed"
            color="primary"
          >
            <Toolbar>
              {cancelAction && (
                <IconButton onClick={cancelAction} color="inherit">
                  <ArrowBackIcon />
                </IconButton>
              )}

              {title && (
                <Typography variant="h6" color="inherit" className={classes.appBarTitle}>
                  {title}
                </Typography>
              )}
              <div className={classes.grow} />
              {actionComponent}
            </Toolbar>
          </AppBar>

          {TabComponent && (
            <Fragment>
              <AppBar className={`${classes.appBarTabs}`}>{TabComponent}</AppBar>
              <div className={TabComponent && classes.appBarTabsSpace} />
            </Fragment>
          )}
        </>
      )}
    </Fragment>
  );
}

CustomAppbar.propTypes = {
  title: PropTypes.string.isRequired,
  actionComponent: PropTypes.element,
  TabComponent: PropTypes.element,
  cancelAction: PropTypes.func,
};

export default CustomAppbar;
