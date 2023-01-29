import { ethers } from "ethers";
import { Request, Response } from "express";

const abi = {
  abi: [
    {
      inputs: [],
      name: "getFiles",
      outputs: [
        {
          components: [
            {
              internalType: "address",
              name: "userAddress",
              type: "address",
            },
            {
              internalType: "string",
              name: "fileSize",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "fileCount",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "fileName",
              type: "string",
            },
            {
              internalType: "string",
              name: "fileHash",
              type: "string",
            },
            {
              internalType: "string[]",
              name: "sharedUsers",
              type: "string[]",
            },
          ],
          internalType: "struct Files.File[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ],
};

async function getFileContract(req: Request, res: Response) {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://rpc-mumbai.maticvigil.com"
  );

  const contract = new ethers.Contract(
    "0x9C07193a8d2AB07D5b30507462b1988513a17603",
    abi.abi,
    provider
  );

  const files = await contract.getFiles();
  console.log(files);

  const userAddress = req.params.userAddress as any;
  let filesArray: any[] = [];

  for (let index = 0; index < files.length; index++) {
    const element = files[index];

    if (element.userAddress.toLowerCase() === userAddress.toLowerCase()) {
      filesArray.push(element);
    }
  }

  res.json({
    message: "Files Sended Succesfully",
    data: filesArray,
  });
}

export default { getFileContract };
