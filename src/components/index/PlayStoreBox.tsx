import { Button, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { useApp } from 'src/providers/AppProvider';
import { Restaurant } from 'src/types/restaurant';
import DialogInput, { DialogInputContext } from '../dialog/DialogInput';

const useStyles = makeStyles({
  playStoreImg: {
    width: 150,
  },
  playStoreBanner: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    '& a': {
      diplay: 'inline-flex',
      margin: '15px 0',
    },
  },
});

type PlayStoreBoxProps = {
  restaurant: Restaurant;
};

const PlayStoreBox: React.FC<PlayStoreBoxProps> = ({ restaurant }) => {
  const classes = useStyles();
  const { handleShowPlayStoreBanner } = useApp();

  return (
    <DialogInput onExited={() => handleShowPlayStoreBanner()}>
      <DialogInputContext.Consumer>
        {({ handleCloseDialog }) => (
          <div className={classes.playStoreBanner}>
            <Typography align="center" gutterBottom variant="h5">
              Baixe o aplicativo {restaurant.name}, gratuíto para celular
            </Typography>
            <a href={restaurant.play_store_link} target="blank">
              <img className={classes.playStoreImg} src="/images/play_store.png" alt="Google Play Store" />
            </a>
            <Button color="primary" variant="text" onClick={handleCloseDialog}>
              Agora não
            </Button>
          </div>
        )}
      </DialogInputContext.Consumer>
    </DialogInput>
  );
};

export default PlayStoreBox;
