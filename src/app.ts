import express, { Express } from "express";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import filesRouter from "./routers/files.router";
import { connect } from "mongoose";

dotenv.config();

async function rundbweb() {
  // 4. Connect to MongoDB
  await connect(`${process.env.MONGOURI}`);
}

rundbweb();
const app: Express = express();
const port: number = Number(process.env.PORT) || 4000;

app.use(fileUpload());
app.use(express.json());

app.use("/", filesRouter);

app.listen(port, () => {
  console.log(`Server run on http://127.0.0.1:${port}`);
});
