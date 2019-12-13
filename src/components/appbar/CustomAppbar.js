import React, { Fragment, useState, useContext } from 'react';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { menuWidth, AppContext } from '../../App';

const useStyles = makeStyles(theme => ({
  appBar: {
    zIndex: 10,
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

function CustomAppbar({ actionComponent, title, TabComponent, cancel, cancelAction }) {
  const [appBarTabs] = useState(true);
  const classes = useStyles();
  const { handleOpenMenu, isMobile, windowWidth } = useContext(AppContext);

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
              <IconButton color="inherit" onClick={handleOpenMenu}>
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" className={classes.appBarTitle}>
                {title}
              </Typography>
              <div className={classes.grow} />
              {actionComponent}
            </Toolbar>
          </AppBar>
          {TabComponent && (
            <Fragment>
              <AppBar className={classes.appBarTabs}>{TabComponent}</AppBar>
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
  cancel: PropTypes.bool,
  cancelAction: PropTypes.func,
};

export default CustomAppbar;
