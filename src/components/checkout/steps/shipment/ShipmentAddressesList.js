import React, { useState } from 'react';
import { List, ListItem, Typography, Tooltip, IconButton, Menu, MenuItem } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import StarIcon from '@material-ui/icons/Star';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const useStyles = makeStyles(theme => ({
  selected: {
    display: 'flex',
    boxShadow: '1px 1px 9px 1px #eee',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.primary.main, 0.2),
    position: 'relative',
    alignItems: 'center',
    minHeight: 165,
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
    borderRadius: theme.shape.borderRadius,
    alignItems: 'center',
    position: 'relative',
    minHeight: 165,
  },
  listItemNewAddress: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 165,
    backgroundColor: '#fff',
    boxShadow: '1px 1px 9px 1px #eee',
    borderRadius: theme.shape.borderRadius,
    border: `2px dashed ${theme.palette.primary.main}`,
  },
  list: {
    display: 'grid',
    gridTemplateColumns: 'repeat(1, 1fr)',
    gridGap: 10,
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
    },
  },
  address: {},
  iconButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
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
  tax: {
    marginTop: 7,
    fontWeight: 400,
  },
}));

ShipmentAddressesList.propTypes = {
  addresses: PropTypes.array.isRequired,
  handleSelectAddress: PropTypes.func.isRequired,
  handleDialogEditAddress: PropTypes.func.isRequired,
  handleDialogNewAddress: PropTypes.func.isRequired,
  handleDeleteAddress: PropTypes.func.isRequired,
};

export default function ShipmentAddressesList({
  addresses,
  handleSelectAddress,
  handleDialogEditAddress,
  handleDialogNewAddress,
  handleDeleteAddress,
}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState({});
  const order = useSelector(state => state.order);
  const restaurant = useSelector(state => state.restaurant);

  function handleMoreClick(event, address) {
    setAnchorEl(event.currentTarget);
    setSelectedAddress(address);
    event.stopPropagation();
  }

  return (
    <div className={classes.container}>
      <Menu onClose={() => setAnchorEl(null)} anchorEl={anchorEl} open={Boolean(anchorEl)}>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            handleDialogEditAddress(selectedAddress);
          }}
        >
          editar
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            handleDeleteAddress(selectedAddress);
          }}
        >
          excluir
        </MenuItem>
      </Menu>
      <List className={classes.list}>
        {addresses.map(address => (
          <ListItem
            onClick={() => handleSelectAddress(address)}
            button
            className={address.id === order.shipment.id ? classes.selected : classes.listItem}
            key={address.id}
          >
            <IconButton className={classes.iconButton} onClick={event => handleMoreClick(event, address)}>
              <MoreVertIcon />
            </IconButton>
            <div>
              <Typography variant="h6" gutterBottom className={classes.address}>
                {address.address}, {address.number}
                {address.is_main === 1 && (
                  <Tooltip title="Endereço principal">
                    <StarIcon className={classes.starIcon} />
                  </Tooltip>
                )}
              </Typography>
              <Typography variant="body1">{`${address.district}, ${address.city} - ${address.region}`}</Typography>

              {address.postal_code !== '00000000' && <Typography variant="body1">{address.postal_code}</Typography>}
              {restaurant.configs.tax_mode === 'district' && address.area_region && address.area_region.tax > 0 && (
                <Typography color="textSecondary" className={classes.tax} variant="body2">
                  {address.area_region.formattedTax} de taxa de entrega
                </Typography>
              )}
              {restaurant.configs.tax_mode === 'distance' && address.distance_tax > 0 && (
                <Typography color="textSecondary" className={classes.tax} variant="body2">
                  taxa {address.formattedDistanceTax}
                </Typography>
              )}
            </div>
            {address.id === order.shipment.id && <CheckCircleIcon color="primary" className={classes.checkIcon} />}
          </ListItem>
        ))}
        <ListItem button className={classes.listItemNewAddress} onClick={handleDialogNewAddress}>
          <Typography variant="h6" color="primary">
            adicionar endereço
          </Typography>
        </ListItem>
      </List>
    </div>
  );
}
