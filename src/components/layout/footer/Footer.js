import React from 'react';
import { Typography, List, ListItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import PhoneIcon from '@material-ui/icons/Phone';
import WatchIcon from '@material-ui/icons/WatchLater';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles(theme => ({
  footer: {
    borderTop: '1px solid #eee',
    minHeight: 100,
    backgroundColor: '#fff',
    padding: '15px',
  },
  container: {
    maxWidth: 1366,
    margin: '0 auto',
    display: 'flex',
    flexWrap: 'wrap',
  },
  col: {
    display: 'flex',
    flex: 0.33,
    flexDirection: 'column',
  },
  list: {
    '& li': {
      paddingRight: 0,
      paddingLeft: 0,
    },
  },
  restaurantData: {
    width: '100%',
    borderTop: '1px solid #eee',
    paddingTop: 15,
  },
  title: {
    fontWeight: 600,
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    '& svg': {
      marginRight: 10,
    },
    fontSize: 16,
  },
  defaultLink: {
    color: theme.palette.text.primary,
    fontSize: 16,
  },
}));

function Footer() {
  const classes = useStyles();
  const restaurant = useSelector(state => state.restaurant);
  const mainAddress = restaurant && restaurant.addresses.find(address => address.is_main);

  return (
    <footer className={classes.footer}>
      <div className={classes.container}>
        <div className={classes.col}>
          <Typography variant="h6" color="primary" className={classes.title}>
            {restaurant && restaurant.name}
          </Typography>
          <List className={classes.list}>
            <ListItem>
              <Typography>Fale conosco</Typography>
            </ListItem>
            <ListItem>
              <Typography>Sobre</Typography>
            </ListItem>
            <ListItem>
              <Typography>Formas de pagamento</Typography>
            </ListItem>
          </List>
        </div>
        <div className={classes.col}>
          <Typography variant="h6" color="primary" className={classes.title}>
            Atendimento
          </Typography>
          <List className={classes.list}>
            <ListItem>
              <Typography className={classes.link}>
                <WatchIcon color="primary" />
                {restaurant && restaurant.working_hours}
              </Typography>
            </ListItem>
            {restaurant &&
              restaurant.phones.map(phone => (
                <ListItem key={phone.id}>
                  <Typography className={classes.link}>
                    <PhoneIcon color="primary" /> {phone.phone}
                  </Typography>
                </ListItem>
              ))}
          </List>
        </div>
        <div className={classes.col}>
          <Typography variant="h6" color="primary" className={classes.title}>
            Social
          </Typography>
          <List className={classes.list}>
            <ListItem>
              <a target="blank" className={classes.defaultLink} href="http://www.facebook.com">
                Facebook
              </a>
            </ListItem>
            <ListItem>
              <a target="blank" className={classes.defaultLink} href="http://www.instagram.com">
                Instagram
              </a>
            </ListItem>
            <ListItem>
              <a target="blank" className={classes.defaultLink} href="http://www.twitter.com">
                Twitter
              </a>
            </ListItem>
          </List>
        </div>
        <div className={classes.restaurantData}>
          {restaurant && (
            <Typography>{restaurant.corporate_name ? restaurant.corporate_name : restaurant.name}</Typography>
          )}
          {restaurant && <Typography color="textSecondary">{restaurant.cnpj}</Typography>}
          {mainAddress && (
            <>
              <Typography color="textSecondary">
                {mainAddress.address}, {mainAddress.number}, {mainAddress.district}
              </Typography>
              <Typography color="textSecondary">
                {mainAddress.city}-{mainAddress.region}, CEP {mainAddress.postal_code}
              </Typography>
            </>
          )}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
