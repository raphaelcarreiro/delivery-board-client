import { IconButton, makeStyles, Typography } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import React from 'react';
import { useApp } from 'src/hooks/app';
import { useSelector } from 'src/store/redux/selector';
import { InstallAppNotificationContainer } from './styles';

const useStyles = makeStyles({
  playStoreImg: {
    width: 120,
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
          <Typography variant="caption">Baixe o aplicativo {restaurant?.name}, gratuíto para celular</Typography>
          <a href={restaurant?.play_store_link} target="blank">
            <img className={classes.playStoreImg} src="/images/play_store.png" alt="Google Play Store" />
          </a>
          <IconButton onClick={handleShowPlayStoreBanner} color="inherit" size="small">
            <CloseIcon />
          </IconButton>
        </InstallAppNotificationContainer>
      )}
    </>
  );
};

export default InstallAppNotification;
