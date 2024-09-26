import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { Connector, useAccount } from 'wagmi';
import { IExecDataProtectorCore, type DataSchema } from '@iexec/dataprotector';
import { IEXEC_EXPLORER_URL } from '../utils/config.ts';
import { Address } from '../utils/types.ts';

export default function ProtectDataForm({
  protectedData,
  setProtectedData,
}: {
  protectedData: Address | '';
  setProtectedData: (protectedData: Address) => void;
}) {
  // ProtectDataForm only displayed if user is logged in
  const { connector } = useAccount() as { connector: Connector };

  //loading effect & error
  const [loadingProtect, setLoadingProtect] = useState(false);
  const [errorProtect, setErrorProtect] = useState('');

  //set name
  const [name, setName] = useState('');

  //set email
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);

  //handle functions
  const handleEmailChange = (event: any) => {
    setEmail(event.target.value);
    setIsValidEmail(event.target.validity.valid);
  };

  const handleNameChange = (event: any) => {
    setName(event.target.value);
  };

  //handle Submit
  const protectedDataSubmit = async () => {
    setErrorProtect('');

    if (!email) {
      setErrorProtect('Please enter a valid email address');
      return;
    }

    const data: DataSchema = { email: email } as DataSchema;
    try {
      setLoadingProtect(true);

      const provider = await connector.getProvider();
      const dataProtector = new IExecDataProtectorCore(provider);
      const { address: protectedDataAddress } = await dataProtector.protectData(
        {
          data,
          name,
        }
      );
      setProtectedData(protectedDataAddress as Address);
      setErrorProtect('');
    } catch (error) {
      setErrorProtect(String(error));
    }
    setLoadingProtect(false);
  };

  return (
    <Box className="form-box">
      <Typography component="h1" variant="h5" sx={{ mt: 3 }}>
        Protect your email address
      </Typography>
      <TextField
        type="email"
        fullWidth
        required
        label="Email"
        variant="outlined"
        value={email}
        sx={{ mt: 3 }}
        error={!isValidEmail}
        helperText={!isValidEmail && 'Please enter a valid email address'}
        onChange={handleEmailChange}
      />
      <TextField
        type="text"
        fullWidth
        label="Name"
        variant="outlined"
        value={name}
        sx={{ mt: 3 }}
        onChange={handleNameChange}
      />
      {errorProtect && (
        <Alert sx={{ mt: 3, mb: 2 }} severity="error">
          <Typography variant="h6">Creation failed</Typography>
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
          <Typography variant="h6">Your data has been protected!</Typography>
          <Link
            href={IEXEC_EXPLORER_URL + protectedData}
            target="_blank"
            sx={{ color: 'green', textDecorationColor: 'green' }}
          >
            You can check it here
          </Link>
          <p>
            Your protected data address:{' '}
            <span style={{ fontSize: '0.75rem', letterSpacing: '-0.025em' }}>
              {protectedData}
            </span>
          </p>
        </Alert>
      )}
      {loadingProtect && (
        <CircularProgress
          sx={{ display: 'block', margin: '20px auto' }}
        ></CircularProgress>
      )}
    </Box>
  );
}
