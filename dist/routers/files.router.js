"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const getFiles_controller_1 = __importDefault(require("../controllers/getFiles.controller"));
const sendFile_controller_1 = __importDefault(require("../controllers/sendFile.controller"));
const router = express_1.default.Router();
/*
// middleware that is specific to this router
router.use((req: Request, res: Response, next: NextFunction) => {
  console.log("Time: ", Date.now());
  next();
});
*/
// define the home page route
router.post("/getFiles", getFiles_controller_1.default.getFiles);
router.post("/sendFiles", sendFile_controller_1.default.sendFiles);
exports.default = router;
