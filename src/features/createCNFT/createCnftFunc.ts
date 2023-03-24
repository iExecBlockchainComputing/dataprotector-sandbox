import { PrivateData } from "../../index";

const createCNFT = async (data: string | ArrayBuffer | Uint8Array | Buffer, cNFTName: string) => {
  const { cNFTAddress, encryptionKey, Ipfsmultiaddr } = await PrivateData.createCNFT(
    data,
    cNFTName
  ).catch((err: any) => {
    console.error(err);
  });
  return cNFTAddress
};

export default createCNFT;
