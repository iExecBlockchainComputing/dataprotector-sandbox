import {
  Alert,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import revokeAccessFunc from './revokeAccessFunc';
import { isAddress } from 'ethers/lib/utils.js';
import { useAppSelector } from '../../app/hooks';
import {
  selectProtectedDataCreated,
  selectAuthorizedUser,
} from '../../app/appSlice';
import { ethers } from 'ethers';

export default function RevokeAccess() {
  //global state
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [revokeAccess, setRevokeAccess] = useState<string>();
  const protectedDataRegistered = useAppSelector(selectProtectedDataCreated);
  const authorizedUser = useAppSelector(selectAuthorizedUser);

  //for order state
  const [protectedData, setProtectedData] = useState(protectedDataRegistered);
  const [isValidProtectedData, setIsValidProtectedData] = useState(true);

  //handle function
  const handleOrderAddressChange = (event: any) => {
    setProtectedData(event.target.value);
    setIsValidProtectedData(isAddress(event.target.value));
  };
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const tx = await revokeAccessFunc(
        protectedData,
        authorizedUser,
        ethers.constants.AddressZero
      );
      setRevokeAccess(tx);
    } catch (error) {
      setError(String(error));
      setRevokeAccess('');
    }
    setLoading(false);
  };
  return (
    <Box id="form-box">
      <TextField
        required
        fullWidth
        id="dataorderAddresssetAddress"
        label="Data Address"
        variant="outlined"
        sx={{ mt: 3 }}
        value={protectedData}
        onChange={handleOrderAddressChange}
        type="text"
        error={!isValidProtectedData}
        helperText={
          !isValidProtectedData && 'Please enter a valid protectedData address'
        }
      />
      {!loading && (
        <Button id="spacingStyle" onClick={handleSubmit} variant="contained">
          Revoke Access
        </Button>
      )}
      {loading && <CircularProgress id="spacingStyle"></CircularProgress>}
      {revokeAccess && !error && (
        <>
          <Alert sx={{ mt: 3, mb: 2 }} severity="success">
            <Typography variant="h6">
              You have successfully revoke access!
            </Typography>
          </Alert>
        </>
      )}
      {error && (
        <Alert sx={{ mt: 3, mb: 2 }} severity="error">
          <Typography variant="h6"> Revoke Access failed </Typography>
          {error}
        </Alert>
      )}
    </Box>
  );
}
