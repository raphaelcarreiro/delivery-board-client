import React, { Fragment, useState } from 'react';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { menuWidth } from '../../App';

const useStyles = makeStyles(theme => ({
  appBar: {
    zIndex: 1102,
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
    top: 64,
    [theme.breakpoints.down('md')]: {
      top: 56,
    },
    [theme.breakpoints.between('xs', 'xs') + ' and (orientation: landscape)']: {
      top: 48,
    },
    [theme.breakpoints.up('lg')]: {
      backgroundColor: theme.palette.primary.light,
    },
    transitionDuration: '225ms',
    left: 0,
  },
  appBarTabsMenuOpen: {
    left: menuWidth,
  },
  appBarTabsSpace: {
    marginBottom: 45,
    [theme.breakpoints.down('md')]: {
      marginBottom: 48,
    },
  },
}));

function CustomAppbar({ ActionComponent, title, TabComponent, appContext, cancel, cancelAction }) {
  const [appBarTabs] = useState(true);
  const classes = useStyles();

  return (
    <Fragment>
      <AppBar
        className={`${classes.appBar} ${appBarTabs && TabComponent && classes.appBarShadow}`}
        position="fixed"
        color="primary"
      >
        <Toolbar>
          <IconButton color="inherit">
            <MenuIcon />
          </IconButton>
          <Typography variant={'h6'} color={'inherit'} className={classes.appBarTitle}>
            {title}
          </Typography>
          <div className={classes.grow} />
          {ActionComponent}
        </Toolbar>
      </AppBar>
      {TabComponent && (
        <Fragment>
          <AppBar
            className={`${classes.appBarTabs} ${!appContext.isMobile &&
              appContext.windowWidth > 1280 &&
              classes.appBarTabsMenuOpen}`}
          >
            {TabComponent}
          </AppBar>
          <div className={TabComponent && classes.appBarTabsSpace} />
        </Fragment>
      )}
    </Fragment>
  );
}

CustomAppbar.propTypes = {
  title: PropTypes.string.isRequired,
  ActionComponent: PropTypes.element,
  TabComponent: PropTypes.element,
  appContext: PropTypes.object.isRequired,
  cancel: PropTypes.bool,
  cancelAction: PropTypes.func,
};

export default CustomAppbar;
