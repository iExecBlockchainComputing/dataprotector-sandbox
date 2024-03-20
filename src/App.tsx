import { useState } from 'react';
import { Container } from '@mui/material';
import { useAccount } from 'wagmi';
import { NavBar } from './features/NavBar.tsx';
import { Address, AddressOrEnsName } from './utils/types.ts';
import Connect from './features/Connect';
import ProtectDataForm from './features/ProtectDataForm.tsx';
import GrantAccessForm from './features/GrantAccessForm.tsx';
import RevokeAccessForm from './features/RevokeAccessForm.tsx';

export default function App() {
  //connection with wallet
  const { isConnected } = useAccount();

  //global state
  const [protectedData, setProtectedData] = useState<Address | ''>('');

  //set user restricted address
  const [authorizedUser, setAuthorizedUser] = useState<AddressOrEnsName | ''>(
    ''
  );

  return (
    <Container style={{ marginBottom: '120px' }}>
      {isConnected ? (
        <>
          <NavBar />

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
