import { type Connector } from 'wagmi';
import { DataSchema, DataProtector } from '@iexec/dataprotector';
import { Address, AddressOrEnsName } from '../utils/types.ts';

export async function protectData({
  connector,
  data,
  name,
}: {
  connector: Connector;
  data: DataSchema;
  name: string;
}) {
  const provider = await connector.getProvider();

  const dataProtector = new DataProtector(provider);

  const { address } = await dataProtector.protectData({
    data,
    name,
  });
  return address as Address;
}

export async function grantAccess({
  connector,
  protectedData,
  authorizedUser,
  authorizedApp,
  numberOfAccess,
}: {
  connector: Connector;
  protectedData: Address;
  authorizedUser: AddressOrEnsName;
  authorizedApp: AddressOrEnsName;
  numberOfAccess: number;
}) {
  const provider = await connector.getProvider();

  // Configure private data protector
  const dataProtector = new DataProtector(provider);

  await dataProtector.grantAccess({
    protectedData,
    authorizedUser,
    authorizedApp,
    numberOfAccess,
  });
}

export async function revokeAccess({
  connector,
  protectedData,
  authorizedUser,
  authorizedApp,
}: {
  connector: Connector;
  protectedData: Address;
  authorizedUser: AddressOrEnsName;
  authorizedApp: AddressOrEnsName;
}) {
  const provider = await connector.getProvider();

  const dataProtector = new DataProtector(provider);

  const grantedAccessArray = await dataProtector.fetchGrantedAccess({
    protectedData,
    authorizedUser,
    authorizedApp,
  });
  if (grantedAccessArray.count === 0) {
    throw new Error('No access to revoke');
  }
  const { txHash } = await dataProtector.revokeOneAccess(
    grantedAccessArray.grantedAccess[0]
  );

  return txHash;
}
