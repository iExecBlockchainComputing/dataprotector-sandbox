import { getAccount } from '@wagmi/core';
import { IExecDataProtector, DataSchema } from '@iexec/dataprotector';

//protect data by calling protectData method from @iexec/dataprotector
const protectDataFunc = async (data: DataSchema, name: string) => {
  const result = getAccount();
  const provider = await result.connector?.getProvider();

  // Configure private data protector
  const dataProtector = new IExecDataProtector(provider);

  const { address } = await dataProtector.protectData({
    data,
    name,
  });
  return address;
};

//revoke access by calling revokeOneAccess method from @iexec/dataprotector
const revokeAccessFunc = async (
  protectedData: string,
  authorizedUser: string,
  authorizedApp: string
) => {
  const result = getAccount();
  const provider = await result.connector?.getProvider();

  // Configure private data protector
  const dataProtector = new IExecDataProtector(provider);

  const grantedAccessArray = await dataProtector.fetchGrantedAccess({
    protectedData,
    authorizedUser,
    authorizedApp,
  });
  const { txHash } = await dataProtector.revokeOneAccess(grantedAccessArray[0]);

  return txHash;
};

//grant access by calling grantAccess method from @iexec/dataprotector
const grantAccessFunc = async (
  protectedData: string,
  authorizedUser: string,
  authorizedApp: string,
  pricePerAccess: number
) => {
  const result = getAccount();
  const provider = await result.connector?.getProvider();

  // Configure private data protector
  const dataProtector = new IExecDataProtector(provider);

  const accessHash = await dataProtector.grantAccess({
    protectedData,
    authorizedUser,
    authorizedApp,
    pricePerAccess,
  });
  return accessHash;
};

export { protectDataFunc, revokeAccessFunc, grantAccessFunc };
