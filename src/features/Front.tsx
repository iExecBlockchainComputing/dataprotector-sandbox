import { useState } from 'react';
import {
  TextField,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Link,
  Box,
  AppBar,
  Toolbar,
  Container,
} from '@mui/material';
import {
  protectDataFunc,
  grantAccessFunc,
  revokeAccessFunc,
} from './protectDataFunc';
import { isAddress } from 'ethers/lib/utils.js';
import { ethers } from 'ethers';
import Connect from './Connect';
import { useAccount, useDisconnect } from 'wagmi';

export default function Front() {
  //connection with wallet
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  //loading effect & error
  const [loadingProtect, setLoadingProtect] = useState(false);
  const [errorProtect, setErrorProtect] = useState('');
  const [loadingGrant, setLoadingGrant] = useState(false);
  const [errorGrant, setErrorGrant] = useState('');
  const [loadingRevoke, setLoadingRevoke] = useState(false);
  const [errorRevoke, setErrorRevoke] = useState('');

  //global state
  const [protectedData, setProtectedData] = useState('');
  const [isValidProtectedData, setIsValidProtectedData] = useState(true);
  const [grantAccess, setGrantAccess] = useState('');
  const [revokeAccess, setRevokeAccess] = useState('');

  //set name
  const [name, setName] = useState('');

  //set email
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);

  //set access number
  const [accessNumber, setAccessNumber] = useState<number>(1);

  //set user restricted address
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
  const protectedDataSubmit = async () => {
    setErrorProtect('');
    if (email) {
      const data = { email: email };
      try {
        setLoadingProtect(true);
        const ProtectedDataAddress = await protectDataFunc(data, name);
        console.log('ProtectedDataAddress', ProtectedDataAddress);
        setProtectedData(ProtectedDataAddress);
        setErrorProtect('');
      } catch (error) {
        setErrorProtect(String(error));
      }
      setLoadingProtect(false);
    } else {
      setErrorProtect('Please enter a valid email address');
    }
  };

  const grantAccessSubmit = async () => {
    setErrorGrant('');
    try {
      setAuthorizedUser(authorizedUser);
      setLoadingGrant(true);
      const accessHash = await grantAccessFunc(
        protectedData,
        authorizedUser,
        ethers.constants.AddressZero,
        accessNumber
      );
      setErrorGrant('');
      setGrantAccess(accessHash);
    } catch (error) {
      setErrorGrant(String(error));
      setGrantAccess('');
    }
    setLoadingGrant(false);
  };

  const revokeAccessSubmit = async () => {
    setRevokeAccess('');
    try {
      setLoadingRevoke(true);
      const tx = await revokeAccessFunc(
        protectedData,
        authorizedUser,
        ethers.constants.AddressZero
      );
      setRevokeAccess(tx);
    } catch (error) {
      setErrorRevoke(String(error));
      setRevokeAccess('');
    }
    setLoadingRevoke(false);
  };

  //wallet address shortening
  const shortAddress = (address: string) => {
    return address.slice(0, 6) + '...' + address.slice(-4);
  };

  return (
    <Container disableGutters>
      {isConnected ? (
        <>
          <AppBar
            position="static"
            elevation={0}
            sx={{ backgroundColor: 'transparent', width: '100%' }}
          >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
              <Typography
                sx={{
                  flexGrow: 1,
                  textAlign: 'right',
                  mr: 2,
                  fontStyle: 'italic',
                }}
              >
                {shortAddress(address as string)}
              </Typography>
              <Button variant="contained" onClick={() => disconnect()}>
                Disconnect
              </Button>
            </Toolbar>
          </AppBar>

          <Box id="form-box">
            <Typography component="h1" variant="h5" sx={{ mt: 3 }}>
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
            {errorProtect && (
              <Alert sx={{ mt: 3, mb: 2 }} severity="error">
                <Typography variant="h6"> Creation failed </Typography>
                {errorProtect}
              </Alert>
            )}
            {!loadingProtect && (
              <Button
                sx={{ display: 'block', margin: '20px auto' }}
                onClick={protectedDataSubmit}
                variant="contained"
              >
                Create
              </Button>
            )}
            {protectedData && !errorProtect && (
              <Alert sx={{ mt: 3, mb: 2 }} severity="success">
                <Typography variant="h6">
                  {' '}
                  Your data has been protected!
                </Typography>
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
            {loadingProtect && (
              <CircularProgress
                sx={{ display: 'block', margin: '20px auto' }}
              ></CircularProgress>
            )}
          </Box>

          {protectedData && (
            <Box id="form-box">
              <Typography component="h1" variant="h5" sx={{ mt: 3 }}>
                Grant Access For Your data
              </Typography>
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
              {!loadingGrant && (
                <Button
                  id="spacingStyle"
                  onClick={grantAccessSubmit}
                  variant="contained"
                >
                  Grant Access
                </Button>
              )}
              {errorGrant && (
                <Alert sx={{ mt: 3, mb: 2 }} severity="error">
                  <Typography variant="h6"> Grant Access failed </Typography>
                  {errorGrant}
                </Alert>
              )}
              {grantAccess && !errorGrant && (
                <>
                  <Alert sx={{ mt: 3, mb: 2 }} severity="success">
                    <Typography variant="h6">
                      Your access has been granted !
                    </Typography>
                  </Alert>
                </>
              )}
              {loadingGrant && (
                <CircularProgress id="spacingStyle"></CircularProgress>
              )}
            </Box>
          )}

          {grantAccess && (
            <Box id="form-box">
              <Typography component="h1" variant="h5" sx={{ mt: 3 }}>
                Revoke Access For Your data
              </Typography>
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
              {!loadingRevoke && (
                <Button
                  id="spacingStyle"
                  onClick={revokeAccessSubmit}
                  variant="contained"
                >
                  Revoke Access
                </Button>
              )}
              {loadingRevoke && (
                <CircularProgress id="spacingStyle"></CircularProgress>
              )}
              {revokeAccess && !errorRevoke && (
                <>
                  <Alert sx={{ mt: 3, mb: 2 }} severity="success">
                    <Typography variant="h6">
                      You have successfully revoke access!
                    </Typography>
                  </Alert>
                </>
              )}
              {errorRevoke && (
                <Alert sx={{ mt: 3, mb: 2 }} severity="error">
                  <Typography variant="h6"> Revoke Access failed </Typography>
                  {errorRevoke}
                </Alert>
              )}
            </Box>
          )}
        </>
      ) : (
        <Connect />
      )}
    </Container>
  );
}
