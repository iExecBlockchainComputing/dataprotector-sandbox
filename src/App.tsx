import { Address } from '@iexec/dataprotector';
import { useState } from 'react';
import './App.css';
import loader from './assets/loader.gif';
import successIcon from './assets/success.png';
import {
  getDataProtectorCoreClient,
  initDataProtectorClient,
} from './externals/dataProtectorClient';
import { useWalletConnection } from './hooks/useWalletConnection';
import {
  AddressOrEnsName,
  checkIsConnected,
  SUPPORTED_CHAINS,
  WEB3MAIL_APP_ENS,
} from './utils/utils.ts';
import { NULL_ADDRESS } from 'iexec/utils';

export default function App() {
  const { isConnected, address, chainId } = useWalletConnection();
  const [selectedChain, setSelectedChain] = useState(SUPPORTED_CHAINS[2].id);
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

  const switchToChain = async (targetChainId: number) => {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed');
    }

    // Find the chain configuration
    const chain = SUPPORTED_CHAINS.find((c) => c.id === targetChainId);
    if (!chain) {
      throw new Error(`Chain with ID ${targetChainId} not supported`);
    }

    const chainIdHex = `0x${targetChainId.toString(16)}`;

    try {
      // Switch to existing chain
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });
    } catch (switchError: unknown) {
      // If chain doesn't exist in MetaMask (error 4902), add it
      if ((switchError as { code?: number }).code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: chainIdHex,
              chainName: chain.name,
              nativeCurrency: {
                name: chain.tokenSymbol,
                symbol: chain.tokenSymbol,
                decimals: 18,
              },
              rpcUrls: chain.rpcUrls,
              blockExplorerUrls: [chain.blockExplorerUrl],
            },
          ],
        });
      } else {
        throw switchError;
      }
    }
  };

  const handleChainChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newChainId = Number(event.target.value);
    setSelectedChain(newChainId);

    // Reset protected data state when switching chains
    setProtectedData('');
    setAuthorizedUser('');
    setRevokeAccess('');
    setErrorProtect('');
    setErrorGrant('');
    setErrorRevoke('');

    // Switch MetaMask to the selected chain
    try {
      await switchToChain(newChainId);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to switch chain:', error);
    }
  };

  const protectedDataSubmit = async () => {
    setErrorProtect('');

    try {
      checkIsConnected();
      await switchToChain(selectedChain);

      // Reinitialize the DataProtector client with the correct chain
      await initDataProtectorClient({
        provider: window.ethereum,
        chainId: selectedChain,
      });
    } catch (err) {
      setErrorProtect('Please install MetaMask or switch to the correct chain');
      return;
    }

    if (!email) {
      setErrorProtect('Please enter a valid email address');
      return;
    }

    const data = { email };
    try {
      setLoadingProtect(true);
      const client = await getDataProtectorCoreClient();
      const protectedDataResponse = await client.protectData({
        data,
        name,
      });
      setProtectedData(protectedDataResponse.address as Address);
      setErrorProtect('');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Protected data creation error:', error);

      // Provide more specific error messages
      if (String(error).includes('Internal JSON-RPC error')) {
        setErrorProtect(
          'RPC Error: Please check your network connection and ensure you have sufficient xRLC for gas fees on Bellecour'
        );
      } else if (String(error).includes('insufficient funds')) {
        setErrorProtect(
          'Insufficient funds: Please ensure you have enough xRLC tokens for gas fees'
        );
      } else if (String(error).includes('user rejected')) {
        setErrorProtect('Transaction rejected by user');
      } else {
        setErrorProtect(String(error));
      }
    }
    setLoadingProtect(false);
  };

  const grantAccessSubmit = async () => {
    setErrorGrant('');
    try {
      checkIsConnected();
      await switchToChain(selectedChain);

      // Reinitialize the DataProtector client with the correct chain
      await initDataProtectorClient({
        provider: window.ethereum,
        chainId: selectedChain,
      });
    } catch (err) {
      setErrorGrant('Please install MetaMask or switch to the correct chain');
      return;
    }

    if (!userAddress) {
      setErrorGrant('Please enter a user address');
      return;
    }
    try {
      setLoadingGrant(true);
      const client = await getDataProtectorCoreClient();
      await client.grantAccess({
        protectedData,
        authorizedUser: userAddress,
        authorizedApp: SUPPORTED_CHAINS.find((c) => c.id === selectedChain)?.web3mailAppAddress as Address,
        numberOfAccess,
      });
      setAuthorizedUser(userAddress);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Grant access error:', error);
      setErrorGrant(String(error));
    }
    setLoadingGrant(false);
  };

  const revokeAccessSubmit = async () => {
    setRevokeAccess('');
    try {
      checkIsConnected();
      await switchToChain(selectedChain);

      // Reinitialize the DataProtector client with the correct chain
      await initDataProtectorClient({
        provider: window.ethereum,
        chainId: selectedChain,
      });
    } catch (err) {
      setErrorRevoke('Please install MetaMask or switch to the correct chain');
      return;
    }

    try {
      setLoadingRevoke(true);
      const client = await getDataProtectorCoreClient();
      const allGrantedAccess = await client.getGrantedAccess({
        protectedData,
        authorizedUser,
        authorizedApp: SUPPORTED_CHAINS.find((c) => c.id === selectedChain)?.web3mailAppAddress as Address,
      });
      if (allGrantedAccess.count === 0) {
        throw new Error('No access to revoke');
      }
      const { txHash } = await client.revokeOneAccess(
        allGrantedAccess.grantedAccess[0]
      );
      setRevokeAccess(txHash);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Revoke access error:', error);
      setErrorRevoke(String(error));
      setRevokeAccess('');
    }
    setLoadingRevoke(false);
  };

  // Handlers
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setIsValidEmail(event.target.validity.valid);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleNumberOfAccessChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNumberOfAccess(Number(event.target.value));
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
      {/* Chain Selection */}
      <div
        style={{
          marginBottom: '20px',
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '8px',
        }}
      >
        <h2
          style={{
            margin: '0 0 10px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          Chain Selection
          <select
            value={selectedChain}
            onChange={handleChainChange}
            style={{
              padding: '5px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          >
            {SUPPORTED_CHAINS.map((chain) => (
              <option key={chain.id} value={chain.id}>
                {chain.name}
              </option>
            ))}
          </select>
        </h2>
        <p style={{ margin: '5px 0', color: '#666' }}>
          Selected chain:{' '}
          {SUPPORTED_CHAINS.find((c) => c.id === selectedChain)?.name} (ID:{' '}
          {selectedChain})
        </p>

        {/* Wallet Status */}
        <div style={{ marginTop: '10px', fontSize: '14px' }}>
          <p style={{ margin: '2px 0' }}>
            <strong>Wallet Status:</strong>{' '}
            {isConnected ? 'Connected' : 'Disconnected'}
          </p>
          {address && (
            <p style={{ margin: '2px 0' }}>
              <strong>Address:</strong> {address.slice(0, 6)}...
              {address.slice(-4)}
            </p>
          )}
          {chainId && (
            <p style={{ margin: '2px 0' }}>
              <strong>Current MetaMask Chain:</strong>{' '}
              {SUPPORTED_CHAINS.find((c) => c.id === chainId)?.name ||
                `Chain ${chainId}`}
            </p>
          )}
        </div>
      </div>

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
              href={
                SUPPORTED_CHAINS.find((c) => c.id === selectedChain)
                  ?.explorerUrl + protectedData
              }
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
