import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ListItem, List, Typography } from '@material-ui/core';
import { Address } from 'src/types/address';
import AccountAddress from './AccountAddress';
import { useAccountAddresses } from './hooks/useAccountAddresses';

const useStyles = makeStyles(theme => ({
  listItemNewAddress: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    backgroundColor: '#fff',
    boxShadow: '1px 1px 9px 1px #eee',
    borderRadius: theme.shape.borderRadius,
    border: `2px dashed ${theme.palette.primary.main}`,
  },
  list: {
    display: 'grid',
    flex: 1,
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridGap: 6,
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: 'repeat(1, 1fr)',
    },
  },
}));

interface AccountAddressListProps {
  addresses: Address[];
}

const AccountAddressList: React.FC<AccountAddressListProps> = ({ addresses }) => {
  const classes = useStyles();
  const { handleDialogNewAddress } = useAccountAddresses();

  return (
    <List className={classes.list} disablePadding>
      {addresses.map(address => (
        <AccountAddress key={address.id} address={address} />
      ))}

      <ListItem button className={classes.listItemNewAddress} onClick={handleDialogNewAddress}>
        <Typography variant="h6" color="primary">
          adicionar endereço
        </Typography>
      </ListItem>
    </List>
  );
};

export default AccountAddressList;
