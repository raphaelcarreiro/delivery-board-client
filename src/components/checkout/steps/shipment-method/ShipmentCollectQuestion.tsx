import { Button, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { useDialogInput } from 'src/components/dialog/DialogInput';

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: 250,
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      height: 200,
    },
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-evenly',
  },
}));

interface ShipmentCollectQuestionProps {
  handleScheduleYes(): void;
  handleScheduleNo(): void;
}

const ShipmentCollectQuestion: React.FC<ShipmentCollectQuestionProps> = ({ handleScheduleYes, handleScheduleNo }) => {
  const classes = useStyles();
  const { handleCloseDialog } = useDialogInput();

  function handleClickNo() {
    handleScheduleNo();
    handleCloseDialog();
  }

  return (
    <div className={classes.container}>
      <Typography variant="h6">agendar a retirada?</Typography>
      <div className={classes.actions}>
        <Button onClick={handleScheduleYes} variant="contained" color="primary">
          Sim
        </Button>
        <Button onClick={handleClickNo} variant="contained" color="primary">
          Não
        </Button>
      </div>
    </div>
  );
};

export default ShipmentCollectQuestion;
