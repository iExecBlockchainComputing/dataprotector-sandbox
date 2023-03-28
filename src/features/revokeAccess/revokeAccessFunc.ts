import { getAccount } from '@wagmi/core';
import { IExecPrivateDataProtector } from 'iexec-private-data-protector'

const revokeAccessFunc = async (dataset: string, requesterrestrict: string) => {
  const result = getAccount()
  const provider = await result.connector?.getProvider()

  // Configure private data protector
  const PrivateData = new IExecPrivateDataProtector(provider, {
    iexecOptions: {
      smsURL: 'https://v7.sms.prod-tee-services.bellecour.iex.ec',
    },
  })

  const tx = await PrivateData.revokeConfidentialNFTUsage({
    dataset,
    requesterrestrict
  })
  return tx
}

export default revokeAccessFunc;