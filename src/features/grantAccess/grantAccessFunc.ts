import { getAccount } from '@wagmi/core';
import { IExecDataProtector } from '@iexec/dataprotector';

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

export default grantAccessFunc;
