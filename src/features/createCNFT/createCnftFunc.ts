import { getAccount } from '@wagmi/core'
import { IExecPrivateDataProtector } from 'private-data-protector-testing-sdk'

const createCNFT = async (data: string | ArrayBuffer | Uint8Array | Buffer, cNFTName: string) => {
  const result = getAccount()
  const provider = await result.connector?.getProvider()

  // Configure private data protector
  const PrivateData = new IExecPrivateDataProtector(provider, {
    iexecOptions: {
      smsURL: 'https://v7.sms.prod-tee-services.bellecour.iex.ec',
    },
  })

  const { cNFTAddress, encryptionKey, Ipfsmultiaddr } = await PrivateData.createCNFT(
    data,
    cNFTName
  ).catch((err: any) => {
    console.error(err);
  });
  return cNFTAddress
};

export default createCNFT;
