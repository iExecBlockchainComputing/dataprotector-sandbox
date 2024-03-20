import { IExecDataProtector } from '@iexec/dataprotector';
import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material';
import { Connector, useAccount } from 'wagmi';
import { WEB3MAIL_APP_ENS } from '../utils/constants.ts';
import { Address, AddressOrEnsName } from '../utils/types.ts';

export default function GrantAccessForm({
  protectedData,
  authorizedUser,
  setAuthorizedUser,
}: {
  protectedData: Address;
  authorizedUser: AddressOrEnsName | '';
  setAuthorizedUser: (authorizedUser: AddressOrEnsName) => void;
}) {
  // ProtectDataForm only displayed if user is logged in
  const { connector, address } = useAccount() as {
    connector: Connector;
    address: Address;
  };

  //loading effect & error
  const [loadingGrant, setLoadingGrant] = useState(false);
  const [errorGrant, setErrorGrant] = useState('');

  //set number of access
  const [numberOfAccess, setNumberOfAccess] = useState<number>(1);

  //set user address
  const [userAddress, setUserAddress] = useState<AddressOrEnsName>('');

  const handleNumberOfAccessChange = (event: any) => {
    setNumberOfAccess(event.target.value);
  };

  const grantAccessSubmit = async () => {
    setErrorGrant('');
    if (!userAddress) {
      setErrorGrant('Please enter a user address');
      return;
    }
    try {
      setLoadingGrant(true);

      const provider = await connector.getProvider();
      const dataProtector = new IExecDataProtector(provider);
      await dataProtector.grantAccess({
        protectedData,
        authorizedUser: userAddress,
        authorizedApp: WEB3MAIL_APP_ENS,
        numberOfAccess,
      });

      setAuthorizedUser(userAddress);
    } catch (error) {
      setErrorGrant(String(error));
    }
    setLoadingGrant(false);
  };

  const shareWithYourself = () => {
    setUserAddress(address as string);
  };

  return (
    <Box className="form-box">
      <Typography component="h1" variant="h5" sx={{ mt: 3 }}>
        Grant Access to your protected data
      </Typography>
      <TextField
        type="text"
        disabled
        fullWidth
        label="Protected Data Address"
        variant="outlined"
        value={protectedData}
        sx={{ mt: 3 }}
        className="contains-address"
      />
      <TextField
        type="number"
        fullWidth
        label="Allowed Access Count"
        variant="outlined"
        value={numberOfAccess}
        sx={{ mt: 3 }}
        InputProps={{ inputProps: { min: 1 } }}
        onChange={handleNumberOfAccessChange}
      />
      <TextField
        type="text"
        fullWidth
        required
        label="User Address Restricted"
        variant="outlined"
        value={userAddress}
        sx={{ mt: 3 }}
        onChange={(event) => setUserAddress(event.target.value)}
      />
      <div className="input-hint">
        For testing here, you can{' '}
        <button type="button" className="btn-text" onClick={shareWithYourself}>
          enter you own wallet address
        </button>
        .
      </div>
      {!loadingGrant && (
        <Button
          variant="contained"
          className="with-space"
          onClick={grantAccessSubmit}
        >
          Grant Access
        </Button>
      )}
      {errorGrant && (
        <Alert sx={{ mt: 3, mb: 2 }} severity="error">
          <Typography variant="h6">Grant Access failed</Typography>
          {errorGrant}
        </Alert>
      )}
      {authorizedUser && !errorGrant && (
        <>
          <Alert sx={{ mt: 3, mb: 2 }} severity="success">
            <Typography variant="h6" sx={{ pt: -2 }}>
              Access has been granted!
            </Typography>
          </Alert>
        </>
      )}
      {loadingGrant && (
        <CircularProgress className="with-space"></CircularProgress>
      )}
    </Box>
  );
}
