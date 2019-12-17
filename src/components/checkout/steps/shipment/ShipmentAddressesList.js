import React, { useState } from 'react';
import { List, ListItem, Typography, Tooltip, Button, IconButton, Menu, MenuItem } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  selected: {
    display: 'flex',
    boxShadow: '1px 1px 9px 1px #eee',
    borderRadius: 4,
    backgroundColor: fade(theme.palette.primary.main, 0.2),
    position: 'relative',
    alignItems: 'center',
    '&:focus': {
      backgroundColor: fade(theme.palette.primary.main, 0.2),
    },
    '&:hover': {
      backgroundColor: fade(theme.palette.primary.main, 0.25),
    },
  },
  listItem: {
    display: 'flex',
    backgroundColor: '#fff',
    boxShadow: '1px 1px 9px 1px #eee',
    borderRadius: 4,
    alignItems: 'center',
    position: 'relative',
  },
  list: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridGap: 6,
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
    },
  },
  address: {
    display: 'flex',
    alignItems: 'center',
    '@media (min-width:1280px) and (max-width:1360px)': {
      '&': {
        maxWidth: 300,
        display: 'block',
      },
    },
    [theme.breakpoints.down('xs')]: {
      maxWidth: 169,
      display: 'block',
    },
  },
  iconButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    display: 'none',
    [theme.breakpoints.down('md')]: {
      display: 'block',
    },
  },
  starIcon: {
    marginLeft: 6,
    color: '#ffc107',
  },
  checkIcon: {
    position: 'absolute',
    right: 10,
    backgroundColor: '#fff',
    borderRadius: '50%',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  button: {
    alignSelf: 'flex-end',
  },
  actions: {
    position: 'absolute',
    top: 10,
    right: 10,
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
  avatar: {
    borderRadius: '50%',
    border: `1px solid ${theme.palette.primary.light}`,
    width: 50,
    height: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 7,
  },
}));

ShipmentAddressesList.PropTypes = {
  addresses: PropTypes.array.isRequired,
  selectAddress: PropTypes.func.isRequired,
  shipmentAddressId: PropTypes.number.isRequired,
  handleOpenDialogCustomerEditAddress: PropTypes.func.isRequired,
};

export default function ShipmentAddressesList({
  addresses,
  selectAddress,
  shipmentAddressId,
  handleOpenDialogCustomerEditAddress,
}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIdAddress, setSelectedIdAddress] = useState(null);

  function handleClick(event, id) {
    event.stopPropagation();
    setSelectedIdAddress(id);
    setAnchorEl(event.currentTarget);
  }

  return (
    <div className={classes.container}>
      <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
        <MenuItem
          onClick={() => {
            handleOpenDialogCustomerEditAddress(selectedIdAddress);
            setAnchorEl(null);
          }}
        >
          Alterar
        </MenuItem>
      </Menu>
      <List className={classes.list}>
        {addresses.map(address => (
          <ListItem
            onClick={() => selectAddress(address.id)}
            button
            className={address.id === shipmentAddressId ? classes.selected : classes.listItem}
            key={address.id}
          >
            <IconButton className={classes.iconButton} onClick={event => handleClick(event, address.id)}>
              <MoreVertIcon />
            </IconButton>
            <div className={classes.actions}>
              <Button
                variant="text"
                color="primary"
                size="small"
                onClick={event => {
                  event.stopPropagation();
                  handleOpenDialogCustomerEditAddress(address.id);
                }}
              >
                Alterar
              </Button>
            </div>
            <div>
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
            </div>
            {address.id === shipmentAddressId && <CheckCircleIcon color="primary" className={classes.checkIcon} />}
          </ListItem>
        ))}
      </List>
      <Button variant="text" color="primary" className={classes.button} onClick={openDialogNewCustomerAddress}>
        Adicionar endereço
      </Button>
    </div>
  );
}
