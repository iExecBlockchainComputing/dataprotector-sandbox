import { useState } from 'react';
import { Typography, Button, AppBar, Toolbar, Container } from '@mui/material';
import { useAccount, useDisconnect } from 'wagmi';
import { Address, AddressOrEnsName } from '../utils/types.ts';
import Connect from './Connect';
import ProtectDataForm from './ProtectDataForm.tsx';
import GrantAccessForm from './GrantAccessForm.tsx';
import RevokeAccessForm from './RevokeAccessForm.tsx';

export default function Front() {
  //connection with wallet
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  //global state
  const [protectedData, setProtectedData] = useState<Address | ''>('');

  //set user restricted address
  const [authorizedUser, setAuthorizedUser] = useState<AddressOrEnsName | ''>(
    ''
  );

  //wallet address shortening
  const shortAddress = (address: string) => {
    return address.slice(0, 6) + '...' + address.slice(-4);
  };

  return (
    <Container style={{ marginBottom: '120px' }}>
      {isConnected ? (
        <>
          {/**App bar for wallet connection*/}
          <AppBar
            position="static"
            elevation={0}
            sx={{ backgroundColor: 'transparent', width: '100%' }}
          >
            <Toolbar sx={{ justifyContent: 'space-between', padding: 0 }}>
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

          {/**First Box to create a Protected Data*/}
          <ProtectDataForm
            protectedData={protectedData}
            setProtectedData={setProtectedData}
          />

          {/**Second Box to grant access to a Protected Data */}
          {protectedData && (
            <GrantAccessForm
              protectedData={protectedData}
              authorizedUser={authorizedUser}
              setAuthorizedUser={setAuthorizedUser}
            />
          )}

          {/**Third Box to revoke the access given to a Protected Data*/}
          {protectedData && authorizedUser && (
            <RevokeAccessForm
              protectedData={protectedData}
              authorizedUser={authorizedUser}
            />
          )}
        </>
      ) : (
        <Connect />
      )}
    </Container>
  );
}
