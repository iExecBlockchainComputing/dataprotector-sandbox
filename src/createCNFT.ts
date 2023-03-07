const createCNFT = (data: string | null, cnftName: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject("foo");
    }, 3000);
  });
};

export default createCNFT;
