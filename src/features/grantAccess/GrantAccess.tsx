import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import RevokeAccess from '../revokeAccess/RevokeAccess';
import grantAccessFunc from './grantAccessFunc';
import { isAddress } from 'ethers/lib/utils.js';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  selectProtectedDataCreated,
  setAuthorizedUser,
} from '../../app/appSlice';
import { ethers } from 'ethers';

export default function GrantAccess() {
  //global state
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [grantAccess, setGrantAccess] = useState('');
  const dispatch = useAppDispatch();
  const protectedDataRegistered = useAppSelector(selectProtectedDataCreated);

  //for protectedData address
  const [protectedData, setProtectedData] = useState(protectedDataRegistered);
  const [isValidProtectedData, setIsValidProtectedData] = useState(true);

  //for access number
  const [accessNumber, setAccessNumber] = useState<number>(1);

  //for user restricted address
  const [authorizedUser, setAuthorizedUserTemp] = useState('');
  const [isValidAuthorizedUser, setIsValidAuthorizedUser] = useState(true);

  //handle functions
  const handleProtectedDataChange = (event: any) => {
    setProtectedData(event.target.value);
    setIsValidProtectedData(isAddress(event.target.value));
  };

  const handleAccessNumberChange = (event: any) => {
    setAccessNumber(event.target.value);
  };

  const authorizedUserChange = (event: any) => {
    setAuthorizedUserTemp(event.target.value);
    setIsValidAuthorizedUser(isAddress(event.target.value));
  };

  const handleSubmit = async () => {
    try {
      dispatch(setAuthorizedUser(authorizedUser));
      setLoading(true);
      const accessHash = await grantAccessFunc(
        protectedData,
        authorizedUser,
        ethers.constants.AddressZero,
        accessNumber
      );
      setError('');
      setGrantAccess(accessHash);
    } catch (error) {
      setError(String(error));
      setGrantAccess('');
    }
    setLoading(false);
  };

  return (
    <div>
      <TextField
        required
        fullWidth
        label="Data Address"
        variant="outlined"
        sx={{ mt: 3 }}
        value={protectedData}
        onChange={handleProtectedDataChange}
        type="text"
        error={!isValidProtectedData}
        helperText={
          !isValidProtectedData && 'Please enter a valid protectedData address'
        }
      />
      <TextField
        fullWidth
        type="number"
        id="age"
        label="Access Number"
        variant="outlined"
        value={accessNumber}
        InputProps={{ inputProps: { min: 1 } }}
        onChange={handleAccessNumberChange}
        sx={{ mt: 3 }}
      />
      <TextField
        fullWidth
        id="authorizedUser"
        label="User Address Restricted"
        variant="outlined"
        sx={{ mt: 3 }}
        value={authorizedUser}
        onChange={authorizedUserChange}
        type="text"
        error={!isValidAuthorizedUser}
        helperText={
          !isValidAuthorizedUser && 'Please enter a valid user address'
        }
      />
      {!loading && (
        <Button id="spacingStyle" onClick={handleSubmit} variant="contained">
          Grant Access
        </Button>
      )}
      {error && (
        <Alert sx={{ mt: 3, mb: 2 }} severity="error">
          <Typography variant="h6"> Grant Access failed </Typography>
          {error}
        </Alert>
      )}
      {grantAccess && !error && (
        <>
          <Alert sx={{ mt: 3, mb: 2 }} severity="success">
            <Typography variant="h6">Your access has been granted !</Typography>
          </Alert>
          <RevokeAccess />
        </>
      )}
      {loading && <CircularProgress id="spacingStyle"></CircularProgress>}
    </div>
  );
}
