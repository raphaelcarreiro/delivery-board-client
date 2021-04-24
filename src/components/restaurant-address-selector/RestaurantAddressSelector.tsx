import { Dialog, makeStyles, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { RestaurantAddressProvider } from './hooks/useRestaurantAddressSelector';
import RestaurantAddressSelectorList from './RestaurantAddressSelectorList';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '80vh',
    width: 400,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  header: {
    display: 'flex',
    padding: 15,
    backgroundColor: '#eee',
    '& > p': {
      fontWeight: 500,
    },
  },
  content: {
    padding: '0px 10px 30px',
  },
}));

interface RestaurantAddressSelectorProps {
  onExited(): void;
}

const RestaurantAddressSelector: React.FC<RestaurantAddressSelectorProps> = ({ onExited }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);

  return (
    <RestaurantAddressProvider value={{ open, setOpen }}>
      <Dialog maxWidth="sm" open={open} onExited={onExited}>
        <div className={classes.container}>
          <div className={classes.header}>
            <Typography>selecione o endereço da loja</Typography>
          </div>
          <div className={classes.content}>
            <RestaurantAddressSelectorList />
          </div>
        </div>
      </Dialog>
    </RestaurantAddressProvider>
  );
};

export default RestaurantAddressSelector;
