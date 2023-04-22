import { makeStyles, TextField, Typography } from '@material-ui/core';
import React, { FC, useState, useRef, FormEvent } from 'react';
import { useDispatch } from 'react-redux';
import { ModalConsumer } from 'src/components/modal/hooks/useModal';
import { setBoardCustomer } from 'src/store/redux/modules/boardMovement/actions';
import Modal from '../../modal/Modal';
import CartCustomerActions from './CartCustomerActions';
import { useCart } from '../hooks/useCart';

const styles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 20,
    gap: 20,
  },
});

interface CartCustomerProps {
  onExited(): void;
}

const CartCustomer: FC<CartCustomerProps> = ({ onExited }) => {
  const classes = styles();
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const { handleSubmit } = useCart();

  function handleConfirm(closeDialog: () => void, event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    setError('');

    if (!name) {
      setError('O nome é obrigatório');
      throw new Error('O nome é obrigatório');
    }

    dispatch(setBoardCustomer(name));

    closeDialog();

    handleSubmit(name);
  }

  return (
    <Modal
      maxWidth="sm"
      onExited={onExited}
      title="seu nome"
      componentActions={<CartCustomerActions handleConfirm={handleConfirm} />}
    >
      <ModalConsumer>
        {context => (
          <form onSubmit={event => handleConfirm(context.handleModalClose, event)}>
            <div className={classes.container}>
              <Typography variant="body1">Para continuar por favor informe seu nome</Typography>
              <TextField
                inputRef={input}
                label="Seu nome"
                placeholder="Informe seu nome"
                margin="normal"
                value={name}
                onChange={event => setName(event.target.value)}
                fullWidth
                autoFocus
                error={!!error}
                helperText={error}
              />
              <button type="submit" style={{ display: 'none' }} />
            </div>
          </form>
        )}
      </ModalConsumer>
    </Modal>
  );
};

export default CartCustomer;
