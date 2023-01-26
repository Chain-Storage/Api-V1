import net from "net";

export async function connectPeer(
  host: string,
  data: number[][] | any[],
  fileHash: string,
  type: string,
  fileName: string
) {
  const client = net.connect(
    {
      host: host,
      port: 9001,
    },
    () => {
      console.log("connected to server!");

      const obj = {
        data,
        fileHash,
        type,
        fileName,
        time: new Date(),
      };

      const messageString = JSON.stringify(obj);

      client.write(messageString);

      client.on("data", (data) => {
        const stringData = data.toString();
        console.log("Server revice data: " + stringData);
      });

      client.on("close", () => {
        console.log("File sended succesfully");
      });
    }
  );
}
