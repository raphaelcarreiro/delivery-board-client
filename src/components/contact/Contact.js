import React from 'react';
import { Typography, Card, CardHeader, CardContent, IconButton } from '@material-ui/core';
import CustomAppbar from '../appbar/CustomAppbar';
import PageHeader from '../pageHeader/PageHeader';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/Email';
import { FaWhatsapp } from 'react-icons/fa';

const useStyles = makeStyles({
  phone: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  card: {
    marginTop: 15,
    maxWidth: 400,
  },
  email: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default function Contact() {
  const restaurant = useSelector(state => state.restaurant || {});
  const classes = useStyles();

  return (
    <>
      <CustomAppbar title="Contato" />
      <PageHeader title="Contato" />
      <Typography gutterBottom>Será um prazer poder te atender.</Typography>
      {restaurant.phones && (
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="caption">Telefones</Typography>
            <ul>
              {restaurant.phones.map(phone => (
                <li key={phone.id} className={classes.phone}>
                  <Typography>{phone.phone}</Typography>
                  <div>
                    <IconButton component="a" href={`tel:${phone.phone.replace(/\D/g, '')}`}>
                      <PhoneIcon />
                    </IconButton>
                    <IconButton component="a" href={`https://wa.me/55${phone.phone.replace(/\D/g, '')}`}>
                      <FaWhatsapp />
                    </IconButton>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      {restaurant.email && (
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="caption">E-mail</Typography>
            <div className={classes.email}>
              <Typography>{restaurant.email}</Typography>
              <IconButton component="a" href={`mailto:${restaurant.email}`}>
                <EmailIcon />
              </IconButton>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
