import React, { Dispatch, MouseEvent, SetStateAction } from 'react';
import { ListItem, Typography, Tooltip, IconButton } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import StarIcon from '@material-ui/icons/Star';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { makeStyles } from '@material-ui/core/styles';
import { Address } from 'src/types/address';
import { useSelector } from 'src/store/redux/selector';
import { useShipment } from './hook/useCheckoutShipment';

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
  tax: {
    marginTop: 7,
    fontWeight: 400,
  },
}));

interface ShipmentAddressItemProps {
  address: Address;
  setAnchorEl: Dispatch<SetStateAction<HTMLButtonElement | null>>;
}

const ShipmentAddressItem: React.FC<ShipmentAddressItemProps> = ({ address, setAnchorEl }) => {
  const classes = useStyles();
  const order = useSelector(state => state.order);
  const restaurant = useSelector(state => state.restaurant);
  const { handleSelectAddress, setSelectedAddress } = useShipment();

  function handleMoreClick(event: MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
    setSelectedAddress(address);
    event.stopPropagation();
  }

  return (
    <ListItem
      onClick={() => handleSelectAddress(address)}
      button
      className={address.id === order.shipment.id ? classes.selected : classes.listItem}
      key={address.id}
    >
      <IconButton className={classes.iconButton} onClick={event => handleMoreClick(event)}>
        <MoreVertIcon />
      </IconButton>
      <div>
        <Typography variant="h6" gutterBottom>
          {address.address}, {address.number}
          {address.is_main && (
            <Tooltip title="Endereço principal">
              <StarIcon className={classes.starIcon} />
            </Tooltip>
          )}
        </Typography>
        <Typography variant="body1">{`${address.district}, ${address.city} - ${address.region}`}</Typography>

        {address.postal_code !== '00000000' && <Typography variant="body1">{address.postal_code}</Typography>}

        {restaurant?.configs.tax_mode === 'distance' && address.distance_tax && address.distance_tax > 0 && (
          <Typography color="textSecondary" className={classes.tax} variant="body2">
            taxa {address.formattedDistanceTax}
          </Typography>
        )}
      </div>
      {address.id === order.shipment.id && <CheckCircleIcon color="primary" className={classes.checkIcon} />}
    </ListItem>
  );
};

export default ShipmentAddressItem;
