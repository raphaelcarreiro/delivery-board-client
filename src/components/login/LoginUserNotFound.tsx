import { Button, makeStyles, Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { DialogInputContext } from '../dialog/DialogInput';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: 200,
    position: 'relative',
    justifyContent: 'space-between',
  },
  message: {
    padding: '30px 20px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-around',
  },
});

interface UserNotFoundProps {
  message: string;
  registerUrl: string;
}

const LoginUserNotFound: React.FC<UserNotFoundProps> = ({ message, registerUrl }) => {
  const classes = useStyles();
  const { handleCloseDialog } = useContext(DialogInputContext);
  const router = useRouter();

  function handleYesClick() {
    router.push(registerUrl);
    handleCloseDialog();
  }

  return (
    <div className={classes.container}>
      <div className={classes.message}>
        <Typography align="center">{message}. Deseja se cadastrar?</Typography>
      </div>
      <div className={classes.actions}>
        <Button variant="text" size="small" color="primary" onClick={handleCloseDialog}>
          Agora não
        </Button>
        <Button variant="contained" color="primary" onClick={handleYesClick}>
          Sim
        </Button>
      </div>
    </div>
  );
};

export default LoginUserNotFound;
