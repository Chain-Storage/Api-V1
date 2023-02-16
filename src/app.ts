import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import filesRouter from "./routers/files.router";
import { connect } from "mongoose";
import cors from "cors";

dotenv.config();

async function rundbweb() {
  // 4. Connect to MongoDB
  await connect(`${process.env.MONGOURI}`);
}

rundbweb();
const app: Express = express();
const port: number = Number(process.env.NODEPORT) || 4000;

app.use(fileUpload());
app.use(express.json());

app.use(function (req: Request, res: Response, next: NextFunction) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  next();
});

app.use(cors());

app.use("/", filesRouter);

app.listen(port, () => {
  console.log(`Server run on http://127.0.0.1:${port}`);
});
