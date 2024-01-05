import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material';
import { useAccount } from 'wagmi';
import { WEB3MAIL_APP_ENS } from '../utils/constants.ts';
import { Address, AddressOrEnsName } from '../utils/types.ts';
import * as dataProtectorClient from '../externals/dataProtector.client.ts';

export default function RevokeAccessForm({
  protectedData,
  authorizedUser,
}: {
  protectedData: Address;
  authorizedUser: AddressOrEnsName;
}) {
  const { connector } = useAccount();

  //loading effect & error
  const [loadingRevoke, setLoadingRevoke] = useState(false);
  const [errorRevoke, setErrorRevoke] = useState('');

  const [revokeAccess, setRevokeAccess] = useState('');

  const revokeAccessSubmit = async () => {
    setRevokeAccess('');
    try {
      setLoadingRevoke(true);
      const tx = await dataProtectorClient.revokeAccess({
        connector: connector!,
        protectedData,
        authorizedUser,
        authorizedApp: WEB3MAIL_APP_ENS,
      });
      setRevokeAccess(tx);
    } catch (error) {
      setErrorRevoke(String(error));
      setRevokeAccess('');
    }
    setLoadingRevoke(false);
  };

  return (
    <Box className="form-box">
      <Typography component="h1" variant="h5" sx={{ mt: 3 }}>
        Revoke Access to your protected data
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
      {!loadingRevoke && (
        <Button
          variant="contained"
          className="with-space"
          onClick={revokeAccessSubmit}
        >
          Revoke Access
        </Button>
      )}
      {loadingRevoke && (
        <CircularProgress className="with-space"></CircularProgress>
      )}
      {revokeAccess && !errorRevoke && (
        <>
          <Alert sx={{ mt: 3, mb: 2 }} severity="success">
            <Typography variant="h6">
              You have successfully revoked access!
            </Typography>
          </Alert>
        </>
      )}
      {errorRevoke && (
        <Alert sx={{ mt: 3, mb: 2 }} severity="error">
          <Typography variant="h6">Revoke Access failed</Typography>
          {errorRevoke}
        </Alert>
      )}
    </Box>
  );
}
