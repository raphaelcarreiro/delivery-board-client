import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ListItem, Typography, IconButton, Tooltip } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import StarIcon from '@material-ui/icons/Star';
import { Address } from 'src/types/address';
import { useAccountAddresses } from './hooks/useAccountAddresses';

const useStyles = makeStyles(theme => ({
  listItem: {
    display: 'block',
    backgroundColor: '#fff',
    boxShadow: '1px 1px 9px 1px #eee',
    borderRadius: theme.shape.borderRadius,
  },
  iconButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  starIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  address: {
    [theme.breakpoints.down('xs')]: {
      maxWidth: '92%',
    },
  },
}));

interface AccountAddressProps {
  address: Address;
}

const AccountAddress: React.FC<AccountAddressProps> = ({ address }) => {
  const classes = useStyles();
  const { handleDialogEditAddress, handleMoreClick } = useAccountAddresses();

  return (
    <ListItem button onClick={() => handleDialogEditAddress(address.id)} className={classes.listItem} key={address.id}>
      <Typography variant="h6" className={classes.address}>
        {address.address}, {address.number}
      </Typography>
      <Typography color="textSecondary">{address.district}</Typography>
      <Typography color="textSecondary">
        {address.city}, {address.region}
      </Typography>

      {address.postal_code !== '00000000' && <Typography color="textSecondary">{address.postal_code}</Typography>}

      <IconButton className={classes.iconButton} onClick={event => handleMoreClick(event, address)}>
        <MoreVertIcon />
      </IconButton>

      {address.is_main && (
        <div className={classes.starIcon}>
          <Tooltip title="Endereço principal">
            <StarIcon color="primary" />
          </Tooltip>
        </div>
      )}
    </ListItem>
  );
};

export default AccountAddress;
