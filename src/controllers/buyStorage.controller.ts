import { ethers } from "ethers";
import { Request, Response } from "express";

// Contract Address: 0x1bc08989E95e8526599da20D3eE0b6F2792E51FB

const abi = {
  abi: [
    {
      inputs: [],
      name: "currentRole",
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
              name: "role",
              type: "string",
            },
            {
              internalType: "string",
              name: "date",
              type: "string",
            },
          ],
          internalType: "struct BuyStorage.UserRole[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "userRoles",
      outputs: [
        {
          internalType: "address",
          name: "userAddress",
          type: "address",
        },
        {
          internalType: "string",
          name: "role",
          type: "string",
        },
        {
          internalType: "string",
          name: "date",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ],
};

async function buyStorage(req: Request, res: Response) {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://rpc-mumbai.maticvigil.com"
  );

  const contract = new ethers.Contract(
    "0x1bc08989E95e8526599da20D3eE0b6F2792E51FB",
    abi.abi,
    provider
  );

  const files = await contract.currentRole();
  console.log(files);
  let userData: any[] = [];
  let data: any[] = [];

  for (let index = 0; index < files.length; index++) {
    const element = files[index];

    if (element[0].toLowerCase() === req.params.userAddress.toLowerCase()) {
      userData.push(element);
    }
  }

  if (userData.length === 0) {
    res.status(200).json({
      message: "currentRole",
      data: ["date", "normal"],
    });
  } else {
    let latestDate = new Date(userData[0].date);

    for (let i = 1; i < userData.length; i++) {
      let currentDate = new Date(userData[i].date);
      let currentRole = userData[i].role;

      if (currentDate > latestDate) {
        latestDate = currentDate;
        const today = new Date();
        const differenceInMs = today.getTime() - latestDate.getTime();
        const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);

        if (differenceInDays >= 30) {
          console.log("The date has passed 30 days.");

          data = ["date", "normal"];
        } else {
          console.log("The date has not passed 30 days.");

          data = [latestDate, currentRole];
        }
      }
    }
    res.status(200).json({
      message: "currentRole",
      data: data,
    });
  }
}

export default { buyStorage };
