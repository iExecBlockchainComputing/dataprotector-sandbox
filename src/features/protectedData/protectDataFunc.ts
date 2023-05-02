import { getAccount } from "@wagmi/core";
import { IExecDataProtector } from "@iexec/dataprotector";

const protectDataFunc = async (
  data: string | ArrayBuffer | Uint8Array | Buffer,
  name: string
) => {
  const result = getAccount();
  const provider = await result.connector?.getProvider();

  // Configure private data protector
  const dataProtector = new IExecDataProtector(provider);

  const { address } = await dataProtector.protectData({
    data: {
      firstName: "John",
      familyName: "Doe",
      birthYear: 1971,
      usCitizen: true,
    },
    name: "my personal data",
  });
  return address;
};

export default protectDataFunc;
