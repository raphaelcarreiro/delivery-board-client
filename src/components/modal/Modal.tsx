import React, { ReactElement, useState } from 'react';
import { Dialog, AppBar, Toolbar, IconButton, Typography, makeStyles } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useApp } from 'src/hooks/app';
import { ModalProvider } from './hooks/useModal';

interface ModalStyleProps {
  backgroundColor: string;
  title: boolean;
  displayBottomActions: boolean;
  height: string;
}

const useStyles = makeStyles(theme => ({
  modal: {
    overflowY: 'auto',
    padding: '0 30px 40px',
    [theme.breakpoints.down('sm')]: {
      padding: '0 30px 40px !important',
    },
  },
  root: {
    paddingRight: '0!important',
    position: 'relative',
  },
  appbar: {
    position: 'absolute',
    zIndex: 1102,
    [theme.breakpoints.down('sm')]: {
      position: 'fixed',
    },
    '@media print': {
      display: 'none',
    },
  },
  grow: {
    flexGrow: 1,
  },
  paper: ({ backgroundColor, height }: ModalStyleProps) => ({
    backgroundColor: backgroundColor,
    [theme.breakpoints.up('md')]: {
      height: height,
    },
  }),
  content: ({ title, displayBottomActions }: ModalStyleProps) => ({
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    marginTop: title ? 64 : 15,
    marginBottom: displayBottomActions ? 72 : 0,
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
    overflowY: 'auto',
    [theme.breakpoints.down('sm')]: {
      marginTop: title ? 56 : 15,
    },
    [theme.breakpoints.between('xs', 'xs') + ' and (orientation: landscape)']: {
      marginTop: title ? 48 : 15,
    },
  }),
}));

interface ModalProps {
  onExited(): void;
  title?: string;
  componentActions?: ReactElement;
  backgroundColor?: string;
  hideBackdrop?: boolean;
  displayBottomActions?: boolean;
  height?: string;
  backAction?(): void;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
}

const Modal: React.FC<ModalProps> = ({
  onExited,
  title,
  componentActions,
  children,
  backgroundColor = '#fff',
  hideBackdrop = false,
  displayBottomActions = false,
  maxWidth = 'md',
  height = '100vh',
  backAction,
  ...rest
}) => {
  const [open, setOpen] = useState(true);
  const app = useApp();
  const styleProps = { backgroundColor, title: !!title, displayBottomActions, height };
  const classes = useStyles(styleProps);

  function handleModalClose() {
    setOpen(false);
  }

  return (
    <Dialog
      {...rest}
      classes={{ root: classes.root, paper: classes.paper }}
      hideBackdrop={hideBackdrop}
      open={open}
      onClose={handleModalClose}
      fullWidth
      fullScreen={app.isMobile || app.windowWidth < 960}
      maxWidth={maxWidth}
      onExited={onExited}
    >
      {title && (
        <AppBar className={classes.appbar}>
          <Toolbar>
            <IconButton color="inherit" onClick={backAction || handleModalClose}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" noWrap>
              {title}
            </Typography>
            <div className={classes.grow} />
            <div>{componentActions}</div>
          </Toolbar>
        </AppBar>
      )}
      <div className={classes.content}>
        <ModalProvider value={{ handleModalClose }}>{children}</ModalProvider>
      </div>
    </Dialog>
  );
};

export default Modal;
