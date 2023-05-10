import { useState } from 'react';
import {
  TextField,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Link,
  Box,
} from '@mui/material';
import {
  protectDataFunc,
  grantAccessFunc,
  revokeAccessFunc,
} from './protectDataFunc';
import { isAddress } from 'ethers/lib/utils.js';
import { ethers } from 'ethers';

export default function Front() {
  //global state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [protectedData, setProtectedData] = useState();
  const [isValidProtectedData, setIsValidProtectedData] = useState(true);
  const [grantAccess, setGrantAccess] = useState('');
  const [revokeAccess, setRevokeAccess] = useState('');

  //for name et dataType
  const [name, setName] = useState();

  //for email
  const [email, setEmail] = useState();
  const [isValidEmail, setIsValidEmail] = useState(true);

  //for access number
  const [accessNumber, setAccessNumber] = useState<number>(1);

  //for user restricted address
  const [authorizedUser, setAuthorizedUser] = useState('');
  const [isValidAuthorizedUser, setIsValidAuthorizedUser] = useState(true);

  //handle functions
  const handleEmailChange = (event: any) => {
    setEmail(event.target.value);
    setIsValidEmail(event.target.validity.valid);
  };

  const handleNameChange = (event: any) => {
    setName(event.target.value);
  };

  const handleProtectedDataChange = (event: any) => {
    setProtectedData(event.target.value);
    setIsValidProtectedData(isAddress(event.target.value));
  };

  const handleAccessNumberChange = (event: any) => {
    setAccessNumber(event.target.value);
  };

  const authorizedUserChange = (event: any) => {
    setAuthorizedUser(event.target.value);
    setIsValidAuthorizedUser(isAddress(event.target.value));
  };

  //handle Submit
  const handleSubmit = async () => {
    if (email) {
      const data = { email: email };
      try {
        setLoading(true);
        const ProtectedDataAddress = await protectDataFunc(data, name);
        setProtectedData(ProtectedDataAddress);
        setError('');
      } catch (error) {
        setError(String(error));
      }
      setLoading(false);
    }
  };

  const grantAccessSubmit = async () => {
    try {
      setAuthorizedUser(authorizedUser);
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

  const revokeAccessSubmit = async () => {
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
      <Typography
        component="h1"
        variant="h5"
        sx={{ mt: 3, textAlign: 'center' }}
      >
        Protect your data
      </Typography>
      <TextField
        required
        fullWidth
        id="email"
        label="Email"
        variant="outlined"
        sx={{ mt: 3 }}
        value={email}
        onChange={handleEmailChange}
        type="email"
        error={!isValidEmail}
        helperText={!isValidEmail && 'Please enter a valid email address'}
      />
      <TextField
        fullWidth
        id="name"
        label="Name"
        variant="outlined"
        value={name}
        onChange={handleNameChange}
        sx={{ mt: 3 }}
      />
      {error && (
        <Alert sx={{ mt: 3, mb: 2 }} severity="error">
          <Typography variant="h6"> Creation failed </Typography>
          {error}
        </Alert>
      )}
      {protectedData && !error && (
        <Alert sx={{ mt: 3, mb: 2 }} severity="success">
          <Typography variant="h6"> Your data has been protected!</Typography>
          <Link
            href={`https://explorer.iex.ec/bellecour/dataset/${protectedData}`}
            target="_blank"
            sx={{ color: 'green', textDecorationColor: 'green' }}
          >
            You can reach it here
          </Link>
          <p>Your protected data address: {protectedData}</p>
        </Alert>
      )}
      {loading && (
        <CircularProgress
          sx={{ display: 'block', margin: '20px auto' }}
        ></CircularProgress>
      )}
      {!loading && (
        <Button
          sx={{ display: 'block', margin: '20px auto' }}
          onClick={handleSubmit}
          variant="contained"
        >
          Create
        </Button>
      )}
      {
        <Box>
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
              !isValidProtectedData &&
              'Please enter a valid protectedData address'
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
            <Button
              id="spacingStyle"
              onClick={grantAccessSubmit}
              variant="contained"
            >
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
                <Typography variant="h6">
                  Your access has been granted !
                </Typography>
              </Alert>
            </>
          )}
          {loading && <CircularProgress id="spacingStyle"></CircularProgress>}
        </Box>
      }
      {
        <Box>
          <TextField
            required
            fullWidth
            id="dataorderAddresssetAddress"
            label="Data Address"
            variant="outlined"
            sx={{ mt: 3 }}
            value={protectedData}
            onChange={handleProtectedDataChange}
            type="text"
            error={!isValidProtectedData}
            helperText={
              !isValidProtectedData &&
              'Please enter a valid protectedData address'
            }
          />
          {!loading && (
            <Button
              id="spacingStyle"
              onClick={revokeAccessSubmit}
              variant="contained"
            >
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
      }
    </Box>
  );
}
