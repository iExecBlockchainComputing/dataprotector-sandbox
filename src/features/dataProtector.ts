import { type Connector } from 'wagmi';
import { IExecDataProtector, DataSchema } from '@iexec/dataprotector';
import { Address, AddressOrEnsName } from '../utils/types.ts';

//protect data by calling protectData method from @iexec/dataprotector
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

  const dataProtector = new IExecDataProtector(provider);

  const { address } = await dataProtector.protectData({
    data,
    name,
  });
  return address as Address;
}

//revoke access by calling revokeOneAccess method from @iexec/dataprotector
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

  const dataProtector = new IExecDataProtector(provider);

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

//grant access by calling grantAccess method from @iexec/dataprotector
export async function grantAccess({
  connector,
  protectedData,
  authorizedUser,
  authorizedApp,
  pricePerAccess,
}: {
  connector: Connector;
  protectedData: Address;
  authorizedUser: AddressOrEnsName;
  authorizedApp: AddressOrEnsName;
  pricePerAccess: number;
}) {
  const provider = await connector.getProvider();

  // Configure private data protector
  const dataProtector = new IExecDataProtector(provider);

  await dataProtector.grantAccess({
    protectedData,
    authorizedUser,
    authorizedApp,
    pricePerAccess,
  });
}
