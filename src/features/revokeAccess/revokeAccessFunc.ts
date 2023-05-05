import { getAccount } from '@wagmi/core';
import { IExecDataProtector } from '@iexec/dataprotector';

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

export default revokeAccessFunc;
