import express, { Router } from "express";
import getFilesController from "../controllers/getFiles.controller";
import sendFileController from "../controllers/sendFile.controller";
import contractsController from "../controllers/contracts.controller";
import buyStorageController from "../controllers/buyStorage.controller";

const router: Router = express.Router();

/*
// middleware that is specific to this router
router.use((req: Request, res: Response, next: NextFunction) => {
  console.log("Time: ", Date.now());
  next();
});
*/

router.get("/getFiles/:fileHash/:fileName", getFilesController.getFiles);

router.get(
  "/getFilesFromContract/:userAddress",
  contractsController.getFileContract
);

router.post("/sendFiles", sendFileController.sendFiles);

router.get("/getAccountType/:userAddress", buyStorageController.buyStorage);

export default router;
