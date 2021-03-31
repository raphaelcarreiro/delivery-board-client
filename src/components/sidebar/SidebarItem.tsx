import { ListItem, ListItemIcon, ListItemText, makeStyles } from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { useApp } from 'src/hooks/app';

const useStyles = makeStyles(theme => ({
  sidebarItem: {
    color: theme.palette.secondary.contrastText,
  },
}));

interface SidebarItemProps {
  icon: ReactElement;
  href: string;
  as?: string;
  label: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, href, as, label }) => {
  const classes = useStyles();
  const router = useRouter();
  const { handleOpenMenu } = useApp();

  function handleClick() {
    if (href) router.push(href, as);
    handleOpenMenu();
  }

  return (
    <>
      <ListItem component="a" button onClick={handleClick}>
        <ListItemIcon className={classes.sidebarItem}>{icon}</ListItemIcon>
        <ListItemText classes={{ primary: classes.sidebarItem }} primary={label} />
      </ListItem>
    </>
  );
};

export default SidebarItem;
