import React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FaFacebookF, FaHeart, FaInstagram, FaTwitter } from 'react-icons/fa';
import { useSelector } from 'src/store/redux/selector';
import Link from 'next/link';
import { PAGE_MAX_WIDTH } from 'src/constants/constants';

const useStyles = makeStyles(theme => ({
  footer: {
    borderTop: '1px solid #eee',
    minHeight: 170,
    display: 'flex',
    flexDirection: 'column',
    padding: '30px 15px',
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    '& a': {
      color: theme.palette.secondary.contrastText,
      fontSize: 18,
    },
  },
  restaurantName: {
    fontWeight: 40,
  },
  container: {
    maxWidth: PAGE_MAX_WIDTH,
    width: '100%',
    margin: '0 auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
    },
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
  socialLinks: {
    paddingTop: 30,
    marginTop: 30,
    borderTop: `1px solid ${theme.palette.secondary.light}`,
    display: 'flex',
    '& a': {
      marginRight: 20,
    },
  },
  socialIcons: {
    fontSize: 20,
  },
  playStoreImg: {
    width: 150,
  },
  stores: {
    margin: '30px 0 0',
  },
  links: {
    display: 'grid',
    rowGap: '10px',
    gridTemplateColumns: '1fr 1fr',
    marginTop: 30,
  },
  developer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& svg': {
      marginLeft: 7,
    },
  },
}));

const Footer: React.FC = () => {
  const classes = useStyles();
  const restaurant = useSelector(state => state.restaurant);

  return (
    <footer className={classes.footer}>
      <div className={classes.container}>
        <div className={classes.grid}>
          <div>
            <Typography className={classes.restaurantName} variant="h5" color="inherit">
              {restaurant?.name}
            </Typography>
            <Typography className={classes.restaurantName} variant="body2" color="inherit" gutterBottom>
              {restaurant?.working_hours}
            </Typography>
          </div>

          <div>
            <ul className={classes.links}>
              <li>
                <Link href="/">início</Link>
              </li>
              <li>
                <Link href="/menu">cardápio</Link>
              </li>
              <li>
                <Link href="/offers">ofertas</Link>
              </li>
              <li>
                <Link href="/contact">mesa</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className={classes.socialLinks}>
          {restaurant?.facebook_link && (
            <a target="blank" href={restaurant?.facebook_link}>
              <FaFacebookF className={classes.socialIcons} />
            </a>
          )}
          {restaurant?.instagram_link && (
            <a target="blank" href={restaurant?.instagram_link}>
              <FaInstagram className={classes.socialIcons} />
            </a>
          )}
          {restaurant?.twitter_link && (
            <a target="blank" href={restaurant?.twitter_link}>
              <FaTwitter className={classes.socialIcons} />
            </a>
          )}
        </div>

        <div className={classes.developer}>
          <a target="blank" href="https://www.sgrande.delivery">
            SGrande Delivery
          </a>
          <FaHeart color="#f0592a" size={16} />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
