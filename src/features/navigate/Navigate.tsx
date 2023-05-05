import {
  AppBar,
  Box,
  Button,
  Container,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAccount, useDisconnect } from 'wagmi';
import Connect from './Connect';

export default function Navigate() {
  const [value, setValue] = useState('one');
  const navigate = useNavigate();
  const { address, isConnected, isDisconnected } = useAccount();
  const { disconnect } = useDisconnect();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (value === 'one') {
      navigate('/protectData');
    } else if (value === 'two') {
      navigate('/grantAccess');
    }
  }, [value]);

  const shortAddress = (address: string) => {
    return address.slice(0, 6) + '...' + address.slice(-4);
  };

  return (
    <Container disableGutters>
      {isConnected && (
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
      )}
      <Box id="my-box">
        {isConnected && (
          <>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="wrapped label tabs example"
              sx={{ mt: 10 }}
            >
              <Tab value="one" label="Protect your data" />
              <Tab value="two" label="Grant & Revoke Access" />
            </Tabs>
            <Box id="my-box">
              <Box id="form-box">
                <Outlet />
              </Box>
            </Box>
          </>
        )}

        {isDisconnected && <Connect />}
      </Box>
    </Container>
  );
}
