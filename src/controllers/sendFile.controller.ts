import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import crypto from "crypto";

import { connectPeer } from "../peers/connectPeer";
import { getPeers } from "../database/createPeer";

async function sendFiles(req: Request, res: Response): Promise<void> {
  const file = req?.files?.myFile as any | UploadedFile[];
  console.log(file);

  const fileName = file.name;

  const buffer = file.data;

  const fileHash = crypto
    .createHash("sha256")
    .update("Ec" + fileName)
    .digest("hex") as string;

  function mySplit(a: Buffer, delimiter: number): number[][] {
    const result = [];
    let currentToken = [];

    for (let i: number = 0; i < a.length; i++) {
      if (a[i] === delimiter) {
        if (currentToken.length !== 0) result.push(currentToken);
        currentToken = [];
      } else {
        currentToken.push(a[i]);
      }
    }
    if (currentToken.length !== 0) result.push(currentToken);

    return result;
  }

  const fileData: number[] = mySplit(buffer, -1)[0];

  console.log(fileData, fileHash, fileName);

  const readFiles = {
    fileData,
    fileHash,
    fileName,
  };

  const findPeers: any = await getPeers();
  const peers: any[] = [findPeers];

  let peersIp: string[] = [];

  for (let index = 0; index < findPeers.length; index++) {
    peersIp.push(peers[0][index].DeviceIp);
  }

  let uniqueChars: any[] = [...new Set(peersIp)];
  console.log(uniqueChars);

  console.log((await readFiles).fileData.length / 60000);
  console.log(Math.trunc((await readFiles).fileData.length / 60000) + 1);

  const loopCount: number =
    Math.trunc((await readFiles).fileData.length / 256) + 1;

  const sliceSize = Math.ceil((await readFiles).fileData.length / loopCount);
  const partsArray: any[] = [];

  console.log(loopCount);

  for (let i = 0; i < loopCount; i++) {
    const start = i * sliceSize;
    const end = start + sliceSize;
    partsArray.push((await readFiles).fileData.slice(start, end));
    let elementIp: string = "";

    // Change Configuration Send File by External IpV4
    if (typeof uniqueChars[i] !== "undefined") {
      elementIp = uniqueChars[i];
    } else {
      elementIp = uniqueChars[0];
    }

    console.log("Peers Ip: " + elementIp);

    connectPeer(
      elementIp,
      partsArray[partsArray.length - 1],
      `${(await readFiles).fileHash}-${i + 1}`,
      "sendFile",
      `${(await readFiles).fileName}`
    );

    if (loopCount === 1) {
      continue;
    }
  }

  console.log(partsArray);

  setTimeout(() => {}, 10000);

  res.json({
    message: "data sended succesfully",
    data: {
      hash: readFiles.fileHash,
      name: readFiles.fileName,
    },
  });
}

export default { sendFiles };
