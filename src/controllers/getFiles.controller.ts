import { Request, Response } from "express";
import fs from "fs";
import net from "net";

import { getPeers } from "../database/createPeer";

async function getFiles(req: Request, res: Response) {
  const findPeers: any = await getPeers();

  let peersIp: string[] = [];

  for (let index: number = 0; index < findPeers.length; index++) {
    peersIp.push(findPeers[index].DeviceIp);
  }

  let uniqueChars: string[] = [...new Set(peersIp)];
  console.log(uniqueChars);

  let promises: Promise<any>[] = [];

  for (let index = 0; index < uniqueChars.length; index++) {
    const element = uniqueChars[index];

    promises.push(
      new Promise((resolve, reject) => {
        // connect to the server using net.connect
        let chunks: any[] = [];

        const client = net.connect(
          {
            host: element,
            port: 9001,
          },
          async () => {
            console.log("connected to server!");

            // create message object to send to the server
            const message = {
              data: [],
              fileHash: req.params.fileHash, // assuming you have a file hash passed as an argument
              type: "getFile",
              fileName: req.params.fileName,
              time: new Date(),
            };

            // convert message object to string
            const messageString = JSON.stringify(message);

            // send message to the server
            client.write(messageString);

            client.on("data", (data) => {
              chunks.push(data.toString());
              console.log(data.toString());
            });

            client.on("end", () => {
              let jsonString = chunks.join("");
              let jsonData = JSON.parse(jsonString);
              console.log(jsonData);

              resolve(jsonData);
            });

            client.on("error", (err: Error) => {
              reject(err);
            });
          }
        );
      })
    );
  }

  let fileArrayOutput: any = await Promise.all(promises);

  let fileArray: any[] = [];

  for (let index = 0; index < fileArrayOutput.length; index++) {
    const element = fileArrayOutput[index];
    for (let index = 0; index < element.length; index++) {
      const subElement = element[index];

      fileArray.push(subElement);
    }
  }

  console.log(fileArray);

  fileArray.sort(function (a: any, b: any) {
    let numA = parseInt(a.hash.split("-")[1]);
    let numB = parseInt(b.hash.split("-")[1]);
    return numA - numB;
  });

  console.log(fileArray);

  let bufferArray: number[] = [];

  for (let index = 0; index < fileArray.length; index++) {
    const element = fileArray[index].buffer;
    console.log(element);
    for (let index = 0; index < element.length; index++) {
      const subElement = element[index];
      bufferArray.push(subElement);
    }
  }

  const buffer = Buffer.from(bufferArray);

  fs.writeFileSync(req.params.fileName, buffer);
  res.download("./" + req.params.fileName);
  fs.unlinkSync(req.params.fileName);
}

export default { getFiles };
