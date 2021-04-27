import React from 'react';
import { makeStyles } from '@material-ui/core';
import CustomDialog from '../dialog/CustomDialog';
import RestaurantAddressSelectorList from './RestaurantAddressSelectorList';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '80vh',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  content: {},
}));

interface RestaurantAddressSelectorProps {
  onExited(): void;
}

const RestaurantAddressSelector: React.FC<RestaurantAddressSelectorProps> = ({ onExited }) => {
  const classes = useStyles();

  return (
    <CustomDialog maxWidth="sm" title="selecione o endereço da loja" handleModalState={onExited}>
      <div className={classes.container}>
        <div className={classes.content}>
          <RestaurantAddressSelectorList />
        </div>
      </div>
    </CustomDialog>
  );
};

export default RestaurantAddressSelector;
