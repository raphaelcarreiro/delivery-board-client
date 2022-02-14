import { IconButton, makeStyles, Typography } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import React from 'react';
import { useApp } from 'src/providers/AppProvider';
import { useSelector } from 'src/store/redux/selector';
import { InstallAppNotificationContainer } from './styles';

const useStyles = makeStyles({
  playStoreImg: {
    width: 120,
  },
  message: {
    textShadow: '0 1px 2px #000',
    fontSize: 13,
  },
});

const InstallAppNotification: React.FC = () => {
  const classes = useStyles();
  const restaurant = useSelector(state => state.restaurant);
  const { handleShowPlayStoreBanner, isMobile, shownPlayStoreBanner } = useApp();

  return (
    <>
      {restaurant?.play_store_link && isMobile && shownPlayStoreBanner && (
        <InstallAppNotificationContainer>
          <IconButton onClick={handleShowPlayStoreBanner} color="inherit" size="small">
            <CloseIcon />
          </IconButton>
          <Typography className={classes.message} variant="caption">
            {restaurant?.name}, gratuíto para celular
          </Typography>
          <a href={restaurant?.play_store_link} target="blank">
            <img className={classes.playStoreImg} src="/images/play_store.png" alt="Google Play Store" />
          </a>
        </InstallAppNotificationContainer>
      )}
    </>
  );
};

export default InstallAppNotification;
