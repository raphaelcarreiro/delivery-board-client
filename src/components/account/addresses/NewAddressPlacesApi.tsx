import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@material-ui/core';
import AccountAddressesAction from './AccountAddressesAction';
import { makeStyles } from '@material-ui/core/styles';
import { api } from 'src/services/api';
import { moneyFormat } from 'src/helpers/numberFormat';
import { useMessaging } from 'src/hooks/messaging';
import { useSelector } from 'src/store/redux/selector';
import { useAddressValidation } from './validation/useAddressValidation';
import { AreaRegion, NewAddress } from 'src/types/address';
import CustomDialogForm from 'src/components/dialog/CustomDialogForm';
import AddressForm from './AddressForm';

const useStyles = makeStyles(theme => ({
  actions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    display: 'flex',
    backgroundColor: '#fff',
    boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
    justifyContent: 'center',
    padding: 15,
    [theme.breakpoints.down('md')]: {
      position: 'fixed',
    },
  },
  form: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    [theme.breakpoints.down('md')]: {
      marginBottom: 72,
    },
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  loading: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    backgroundColor: 'rgba(250, 250, 250, 0.6)',
  },
}));

const interval = 500;
let timer;

interface NewAddressPlacesApiProps {
  handleAddressSubmit(address: NewAddress): Promise<void>;
  onExited(): void;
  saving: boolean;
}

const NewAddressPlacesApi: React.FC<NewAddressPlacesApiProps> = ({ handleAddressSubmit, onExited, saving }) => {
  const restaurant = useSelector(state => state.restaurant);
  const mainAddress = restaurant?.addresses.find(address => address.is_main);
  const [regions, setRegions] = useState<AreaRegion[]>([]);
  const [loading, setLoading] = useState(false);
  const [postalCode, setPostalCode] = useState('');
  const [address, setAddress] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState(mainAddress?.city || '');
  const [region, setRegion] = useState(mainAddress?.region || '');
  const [areaRegionId, setAreaRegionId] = useState<null | number>(null);
  const messaging = useMessaging();
  const classes = useStyles();
  const [validation, setValidation, validate] = useAddressValidation();

  useEffect(() => {
    if (restaurant?.configs.tax_mode !== 'district') return;

    setLoading(true);
    api
      .get('/areas')
      .then(response => {
        setRegions(
          response.data.regions.map(r => {
            r.formattedTax = moneyFormat(r.tax);
            return r;
          })
        );
      })
      .catch(() => {
        console.log('Não foi possível carregar os bairros');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [restaurant]);

  function handleValidation() {
    const data = {
      address,
      number,
      complement,
      district,
      region,
      city,
      area_region_id: areaRegionId,
      postal_code: restaurant?.configs.use_postalcode ? postalCode : '00000000',
    };

    validate(data, restaurant?.configs.tax_mode || 'no_tax')
      .then(handleSubmit)
      .catch(err => console.error(err));
  }

  async function handleSubmit() {
    const data = {
      address,
      number,
      complement,
      district,
      region,
      city,
      area_region_id: areaRegionId,
      postal_code: restaurant?.configs.use_postalcode ? postalCode : '00000000',
    };

    setValidation({});
    await handleAddressSubmit(data).catch(err => {
      messaging.handleOpen(err.response.data.error);
    });
  }

  function handleDistrictSelectChange(value: string) {
    setAreaRegionId(parseInt(value));

    const region = regions.find(r => r.id === parseInt(value));

    if (!region) return;

    setDistrict(region.name);
  }

  return (
    <CustomDialogForm
      title="adicionar endereço"
      handleModalState={onExited}
      handleSubmit={handleValidation}
      closeOnSubmit
      async
      componentActions={<AccountAddressesAction saving={saving} />}
      maxWidth="sm"
      height="80vh"
    >
      {saving && (
        <div className={classes.loading}>
          <CircularProgress color="primary" />
        </div>
      )}

      <AddressForm
        handleDistrictSelectChange={handleDistrictSelectChange}
        validation={validation}
        regions={regions}
        areaRegionId={areaRegionId}
      />
    </CustomDialogForm>
  );
};

export default NewAddressPlacesApi;
