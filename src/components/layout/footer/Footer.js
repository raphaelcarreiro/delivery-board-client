import React from 'react';
import { Typography, List, ListItem, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import PhoneIcon from '@material-ui/icons/Phone';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';

const useStyles = makeStyles(theme => ({
  footer: {
    borderTop: '1px solid #eee',
    minHeight: 170,
    display: 'flex',
    alignItems: 'center',
    padding: '0 15px',
    backgroundColor: theme.palette.secondary.dark,
    color: theme.palette.primary.contrastText,
  },
  container: {
    maxWidth: 1366,
    margin: '0 auto',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    [theme.breakpoints.down('lg')]: {
      maxWidth: 1200,
    },
  },
  restaurantData: {
    display: 'flex',
    flexDirection: 'column',
  },
  phone: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
  },
  textIcon: {
    display: 'flex',
    alignItems: 'center',
    '& svg': {
      marginRight: 20,
    },
  },
  listItem: {
    padding: 0,
  },
  links: {
    marginTop: 15,
    display: 'flex',
    '& a': {
      marginRight: 20,
    },
  },
  socialIcons: {
    fontSize: 20,
  },
}));

function Footer() {
  const classes = useStyles();
  const restaurant = useSelector(state => state.restaurant);
  const mainAddress = restaurant && restaurant.addresses.find(address => address.is_main);

  return (
    <footer className={classes.footer}>
      <div className={classes.container}>
        <div className={classes.restaurantData}>
          {restaurant && (
            <Typography variant="h5" color="inherit" gutterBottom>
              {restaurant.name}
            </Typography>
          )}
          {restaurant && (
            <Typography variant="body2" color="inherit">
              CNPJ: {restaurant.cnpj}
            </Typography>
          )}
          {mainAddress && (
            <>
              <Typography variant="body2" color="inherit">
                {mainAddress.address}, {mainAddress.number}, {mainAddress.district} {mainAddress.city}-
                {mainAddress.region}, CEP {mainAddress.postal_code}
              </Typography>
            </>
          )}
          {restaurant && (
            <div className={classes.links}>
              {restaurant.facebook_link && (
                <Link color="inherit" href={restaurant.facebook_link}>
                  <FaFacebookF className={classes.socialIcons} />
                </Link>
              )}
              {restaurant.instagram_link && (
                <Link color="inherit" href={restaurant.instagram_link}>
                  <FaInstagram className={classes.socialIcons} />
                </Link>
              )}
              {restaurant.twitter_link && (
                <Link color="inherit" href={restaurant.twitter_link}>
                  <FaTwitter className={classes.socialIcons} />
                </Link>
              )}
            </div>
          )}
        </div>
        <div className={classes.phone}>
          <Typography variant="h5" color="inherit">
            peça pelo telefone
          </Typography>
          <List>
            {restaurant &&
              restaurant.phones.map(phone => (
                <ListItem key={phone.id} className={classes.listItem}>
                  <Typography className={classes.textIcon} color="inherit">
                    <PhoneIcon color="inherit" /> {phone.phone}
                  </Typography>
                </ListItem>
              ))}
          </List>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
