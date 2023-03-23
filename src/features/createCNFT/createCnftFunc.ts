import { PrivateData } from "../../App";

const createCNFT = async (data: string | ArrayBuffer | Uint8Array | Buffer, cNFTName: string) => {
  console.log("onclick")
  const { cNFTAddress, encryptionKey, Ipfsmultiaddr } = await PrivateData.createCNFT(
    data,
    cNFTName
  ).catch((err: any) => {
    console.error(err);
  });

  console.log(cNFTAddress, encryptionKey, Ipfsmultiaddr);
  return cNFTAddress
};

export default createCNFT;
