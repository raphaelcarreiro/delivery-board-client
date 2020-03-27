import React from 'react';
import { Typography, List, ListItem, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import PhoneIcon from '@material-ui/icons/Phone';

const useStyles = makeStyles(theme => ({
  footer: {
    borderTop: '1px solid #eee',
    minHeight: 170,
    display: 'flex',
    alignItems: 'center',
    padding: '0 15px',
  },
  container: {
    maxWidth: 1366,
    margin: '0 auto',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
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
    marginTop: 10,
    display: 'flex',
    '& a': {
      marginRight: 15,
    },
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
          <Typography variant="h6" color="primary">
            Informações
          </Typography>
          {restaurant && (
            <Typography variant="body2">
              {restaurant.corporate_name ? restaurant.corporate_name : restaurant.name}
            </Typography>
          )}
          {restaurant && (
            <Typography color="textSecondary" variant="body2">
              CNPJ: {restaurant.cnpj}
            </Typography>
          )}
          {mainAddress && (
            <>
              <Typography color="textSecondary" variant="body2">
                {mainAddress.address}, {mainAddress.number}, {mainAddress.district} {mainAddress.city}-
                {mainAddress.region}, CEP {mainAddress.postal_code}
              </Typography>
            </>
          )}
          {restaurant && (
            <div className={classes.links}>
              {restaurant.facebook_link && <Link href={restaurant.facebook_link}>Facebook</Link>}
              {restaurant.instagram_link && <Link href={restaurant.instagram_link}>Instagram</Link>}
              {restaurant.twitter_link && <Link href={restaurant.twitter_link}>Twitter</Link>}
            </div>
          )}
        </div>
        <div className={classes.phone}>
          <Typography variant="h6" color="primary">
            Peça pelo telefone
          </Typography>
          <List>
            {restaurant &&
              restaurant.phones.map(phone => (
                <ListItem key={phone.id} className={classes.listItem}>
                  <Typography className={classes.textIcon}>
                    <PhoneIcon color="primary" /> {phone.phone}
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
