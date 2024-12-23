import { useState } from 'react';
import { Address, IExecDataProtector } from '@iexec/dataprotector';
import {
  AddressOrEnsName,
  checkCurrentChain,
  checkIsConnected,
  IEXEC_EXPLORER_URL,
  WEB3MAIL_APP_ENS,
} from './utils/utils.ts';
import './App.css';
import loader from './assets/loader.gif';
import successIcon from './assets/success.png';

const iExecDataProtectorClient = new IExecDataProtector(window.ethereum);

export default function App() {
  // Global state
  const [protectedData, setProtectedData] = useState<Address | ''>('');
  const [authorizedUser, setAuthorizedUser] = useState<AddressOrEnsName | ''>(
    ''
  );

  // Loading and error states
  const [loadingProtect, setLoadingProtect] = useState(false);
  const [errorProtect, setErrorProtect] = useState('');
  const [loadingGrant, setLoadingGrant] = useState(false);
  const [errorGrant, setErrorGrant] = useState('');
  const [loadingRevoke, setLoadingRevoke] = useState(false);
  const [errorRevoke, setErrorRevoke] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [numberOfAccess, setNumberOfAccess] = useState<number>(1);
  const [userAddress, setUserAddress] = useState<AddressOrEnsName>('');
  const [revokeAccess, setRevokeAccess] = useState('');

  const protectedDataSubmit = async () => {
    setErrorProtect('');

    try {
      checkIsConnected();
      await checkCurrentChain();
    } catch (err) {
      setErrorProtect('Please install MetaMask');
      return;
    }

    if (!email) {
      setErrorProtect('Please enter a valid email address');
      return;
    }

    const data = { email };
    try {
      setLoadingProtect(true);
      const protectedDataResponse =
        await iExecDataProtectorClient.core.protectData({
          data,
          name,
        });
      setProtectedData(protectedDataResponse.address as Address);
      setErrorProtect('');
    } catch (error) {
      setErrorProtect(String(error));
    }
    setLoadingProtect(false);
  };

  const grantAccessSubmit = async () => {
    setErrorGrant('');
    try {
      checkIsConnected();
      await checkCurrentChain();
    } catch (err) {
      setErrorGrant('Please install MetaMask');
      return;
    }

    if (!userAddress) {
      setErrorGrant('Please enter a user address');
      return;
    }
    try {
      setLoadingGrant(true);
      await iExecDataProtectorClient.core.grantAccess({
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

  const revokeAccessSubmit = async () => {
    setRevokeAccess('');
    try {
      checkIsConnected();
      await checkCurrentChain();
    } catch (err) {
      setErrorRevoke('Please install MetaMask');
      return;
    }

    try {
      setLoadingRevoke(true);
      const allGrantedAccess =
        await iExecDataProtectorClient.core.getGrantedAccess({
          protectedData,
          authorizedUser,
          authorizedApp: WEB3MAIL_APP_ENS,
        });
      if (allGrantedAccess.count === 0) {
        throw new Error('No access to revoke');
      }
      const { txHash } = await iExecDataProtectorClient.core.revokeOneAccess(
        allGrantedAccess.grantedAccess[0]
      );
      setRevokeAccess(txHash);
    } catch (error) {
      setErrorRevoke(String(error));
      setRevokeAccess('');
    }
    setLoadingRevoke(false);
  };

  // Handlers
  const handleEmailChange = (event: any) => {
    setEmail(event.target.value);
    setIsValidEmail(event.target.validity.valid);
  };

  const handleNameChange = (event: any) => {
    setName(event.target.value);
  };

  const handleNumberOfAccessChange = (event: any) => {
    setNumberOfAccess(event.target.value);
  };

  const shareWithYourself = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      setUserAddress(accounts[0]);
    }
  };

  return (
    <>
      {/* Protect Data Form */}
      <div>
        <h2>Protect your email address</h2>
        <div>
          <label>
            Email:{' '}
            <input
              type="email"
              required
              value={email}
              placeholder="Email"
              onChange={handleEmailChange}
            />
            {!isValidEmail && (
              <div style={{ color: 'red' }}>
                Please enter a valid email address
              </div>
            )}
          </label>
        </div>
        <div>
          <label>
            ProtectedData Name:{' '}
            <input
              type="text"
              value={name}
              placeholder="Name"
              onChange={handleNameChange}
            />{' '}
          </label>
        </div>
        {errorProtect && (
          <div style={{ marginTop: '10px', maxWidth: 300, color: 'red' }}>
            <h6>Creation failed</h6>
            {errorProtect}
          </div>
        )}
        {!loadingProtect ? (
          <button onClick={protectedDataSubmit}>Create</button>
        ) : (
          <img src={loader} alt="loading" height="30px" />
        )}
        {protectedData && !errorProtect && (
          <div style={{ marginTop: '4px' }}>
            <img
              src={successIcon}
              alt="success"
              height="30px"
              style={{ verticalAlign: 'middle' }}
            />
            Your data has been protected!
            <a
              href={IEXEC_EXPLORER_URL + protectedData}
              rel="noreferrer"
              target="_blank"
            >
              You can check it here
            </a>
            <p>
              Your protected data address: <span>{protectedData}</span>
            </p>
          </div>
        )}
      </div>

      {/* Grant Access Form */}
      {protectedData && (
        <div>
          <hr style={{ marginTop: '30px' }} />
          <div>
            <h2>Grant Access to your protected data</h2>
            <label>
              Protected Data Address:{' '}
              <input
                type="text"
                disabled
                value={protectedData}
                placeholder="Protected Data Address"
              />
            </label>
          </div>
          <div>
            <label>
              Number of Access:{' '}
              <input
                type="number"
                value={numberOfAccess}
                placeholder="Allowed Access Count"
                min={1}
                onChange={handleNumberOfAccessChange}
              />
            </label>
          </div>
          <div>
            <label>
              User Address Restricted:{' '}
              <input
                type="text"
                value={userAddress}
                placeholder="User Address Restricted"
                required
                onChange={(event) => setUserAddress(event.target.value)}
              />
            </label>
          </div>
          <div>
            For testing here, you can{' '}
            <button type="button" onClick={shareWithYourself}>
              enter your own wallet address
            </button>
            .
          </div>
          {!loadingGrant ? (
            <button onClick={grantAccessSubmit}>Grant Access</button>
          ) : (
            <img src={loader} alt="loading" height="30px" />
          )}
          {errorGrant && (
            <div style={{ marginTop: '10px', maxWidth: 300, color: 'red' }}>
              <h6>Grant Access failed</h6>
              {errorGrant}
            </div>
          )}
          {authorizedUser && !errorGrant && (
            <div style={{ marginTop: '4px' }}>
              <img
                src={successIcon}
                alt="success"
                height="30px"
                style={{ verticalAlign: 'middle' }}
              />
              Access successfully granted
            </div>
          )}
        </div>
      )}

      {/* Revoke Access Form */}
      {protectedData && authorizedUser && (
        <div>
          <hr style={{ marginTop: '30px' }} />
          <div>
            <h2>Revoke Access to your protected data</h2>
            <label>
              Revoke Access for protectData:{' '}
              <input type="text" disabled value={protectedData} />
            </label>
          </div>
          {!loadingRevoke ? (
            <button onClick={revokeAccessSubmit}>Revoke Access</button>
          ) : (
            <img src={loader} alt="loading" height="30px" />
          )}
          {revokeAccess && !errorRevoke && (
            <div style={{ marginTop: '4px' }}>
              <img
                src={successIcon}
                alt="success"
                height="30px"
                style={{ verticalAlign: 'middle' }}
              />
              Access successfully revoked
            </div>
          )}
          {errorRevoke && (
            <div style={{ marginTop: '10px', maxWidth: 300, color: 'red' }}>
              <h6>Revoke Access failed</h6>
              {errorRevoke}
            </div>
          )}
        </div>
      )}
    </>
  );
}
