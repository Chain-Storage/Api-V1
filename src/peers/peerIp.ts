import https from "https";
import os from "os";
import crypto from "crypto";
import ip from "ip";

import { Ipeers } from "../@interfaces/peerIpInterface";

export async function peers(): Promise<Ipeers> {
  let peerIp: string = "";
  const hostName: string = os.hostname();

  https
    .get("https://api.ipify.org", (res: any) => {
      res.on("data", async (data: any) => {
        console.log(`Your public IPv4 address is: ${data}`);
        peerIp = await data.toString();
      });
    })
    .on("error", (err) => {
      console.log(`Error: ${err.message}`);
    });

  const peerHash = crypto
    .createHash("sha256")
    .update(peerIp + hostName)
    .digest("hex") as string;

  const ipV4 = ip.address();

  return {
    PublicIpV4: peerIp,
    DeviceIp: ipV4,
    hostName: hostName,
    peerHash: peerHash,
    port: 9001,
  };
}
