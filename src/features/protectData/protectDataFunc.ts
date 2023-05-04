import { getAccount } from '@wagmi/core';
import { IExecDataProtector, DataSchema } from '@iexec/dataprotector';

const protectDataFunc = async (data: DataSchema, name: string) => {
  const result = getAccount();
  const provider = await result.connector?.getProvider();
  const dataProtector = new IExecDataProtector(provider);
  console.log('Data protector: ', JSON.stringify(dataProtector));

  const { address } = await dataProtector.protectData({
    data,
    name,
  });
  console.log(`Data protected Func: ${address}`);
  return address;
};

export default protectDataFunc;
