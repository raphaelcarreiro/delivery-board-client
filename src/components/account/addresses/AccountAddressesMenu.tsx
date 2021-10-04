import React, { Dispatch, SetStateAction } from 'react';
import { Menu, MenuItem } from '@material-ui/core';
import { Address } from 'src/types/address';

interface AccountAddressesMenuProps {
  selectedAddress: Address;
  anchorEl: HTMLButtonElement | null;
  setAnchorEl: Dispatch<SetStateAction<HTMLButtonElement | null>>;
  handleUpdateIsMainAddress(addressId: number): void;
  handleDeleteAddress(address: Address): void;
}

const AccountAddressesMenu: React.FC<AccountAddressesMenuProps> = ({
  anchorEl,
  setAnchorEl,
  selectedAddress,
  handleDeleteAddress,
  handleUpdateIsMainAddress,
}) => {
  return (
    <Menu onClose={() => setAnchorEl(null)} anchorEl={anchorEl} open={Boolean(anchorEl)}>
      {!selectedAddress.is_main && (
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            handleUpdateIsMainAddress(selectedAddress.id);
          }}
        >
          Marcar como principal
        </MenuItem>
      )}
      <MenuItem
        onClick={() => {
          setAnchorEl(null);
          handleDeleteAddress(selectedAddress);
        }}
      >
        Excluir
      </MenuItem>
    </Menu>
  );
};

export default AccountAddressesMenu;
