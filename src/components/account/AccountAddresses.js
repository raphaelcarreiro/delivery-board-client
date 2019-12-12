import React, { Fragment, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ListItem, List, Typography, Menu, MenuItem, IconButton, Tooltip } from '@material-ui/core';
import NoData from '../nodata/NoData';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import StarIcon from '@material-ui/icons/Star';

const useStyles = makeStyles(theme => ({
  listItem: {
    display: 'block',
    backgroundColor: '#fff',
    boxShadow: '1px 1px 9px 1px #eee',
    borderRadius: 4,
  },
  list: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridGap: 6,
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: 'repeat(1, 1fr)',
    },
  },
  address: {
    display: 'flex',
    alignItems: 'center',
  },
  iconButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  starIcon: {
    marginLeft: 6,
    color: '#ffc107',
  },
}));

function AccountAddresses({
  addresses,
  openDialogCustomerNewAddress,
  openDialogCustomerEditAddress,
  handleUpdateIsMainAddress,
  handleDeleteAddress,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState({});
  const classes = useStyles();

  function handleMoreClick(event, address) {
    setAnchorEl(event.currentTarget);
    setSelectedAddress(address);
    event.stopPropagation();
  }

  return (
    <Fragment>
      <Menu onClose={() => setAnchorEl(null)} anchorEl={anchorEl} open={Boolean(anchorEl)}>
        {selectedAddress.is_main === 0 && (
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              handleUpdateIsMainAddress(selectedAddress.id);
            }}
          >
            Marcar como principal
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            handleDeleteAddress(selectedAddress.id);
          }}
        >
          Excluir
        </MenuItem>
      </Menu>
      {addresses.length > 0 ? (
        <List className={classes.list} disablePadding>
          {addresses.map(address => (
            <ListItem
              button
              onClick={() => openDialogCustomerEditAddress(address.id)}
              className={classes.listItem}
              key={address.id}
            >
              <Typography variant="h6" className={classes.address}>
                {address.address}, {address.number}
                {address.is_main === 1 && (
                  <Tooltip title="Endereço principal">
                    <StarIcon className={classes.starIcon} />
                  </Tooltip>
                )}
              </Typography>
              <Typography color="textSecondary">{address.district}</Typography>
              <Typography color="textSecondary">
                {address.city}, {address.region}
              </Typography>
              <Typography color="textSecondary">{address.postal_code}</Typography>
              <IconButton className={classes.iconButton} onClick={event => handleMoreClick(event, address)}>
                <MoreVertIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      ) : (
        <NoData
          buttonText="Cadastrar endereço"
          message="Não há endereços cadastrados"
          action={openDialogCustomerNewAddress}
        />
      )}
    </Fragment>
  );
}

export default AccountAddresses;
