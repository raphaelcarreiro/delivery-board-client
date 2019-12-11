import React from 'react';
import Link from 'next/link';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  listItemActive: {
    backgroundColor: theme.palette.secondary.light,
  },
});

class CustomNavLink extends React.Component {
  render() {
    const { classes } = this.props;

    return <NavLink {...this.props} exact activeClassName={classes.listItemActive} />;
  }
}

export default withStyles(styles)(CustomNavLink);
