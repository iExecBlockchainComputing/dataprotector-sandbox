import { getAccount } from '@wagmi/core';
import { IExecPrivateDataProtector } from 'iexec-private-data-protector'

const grantAccessFunc = async (
  dataset: string,
  volume: number,
  requesterrestrict: string
) => {
  const result = getAccount()
  const provider = await result.connector?.getProvider()

  // Configure private data protector
  const PrivateData = new IExecPrivateDataProtector(provider, {
    iexecOptions: {
      smsURL: 'https://v7.sms.prod-tee-services.bellecour.iex.ec',
    },
  })

  const accessHash = await PrivateData.authorizeConfidentialNFTUsage({
    dataset,
    volume,
    requesterrestrict
  })
  return accessHash
}

export default grantAccessFunc;

