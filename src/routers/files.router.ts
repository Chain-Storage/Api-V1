import express, { Router } from "express";
import getFilesController from "../controllers/getFiles.controller";
import sendFileController from "../controllers/sendFile.controller";

const router: Router = express.Router();

/*
// middleware that is specific to this router
router.use((req: Request, res: Response, next: NextFunction) => {
  console.log("Time: ", Date.now());
  next();
});
*/

// define the home page route
router.get("/getFiles/:fileName", getFilesController.getFiles);

router.post("/sendFiles", sendFileController.sendFiles);

export default router;
