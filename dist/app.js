"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const files_router_1 = __importDefault(require("./routers/files.router"));
const mongoose_1 = require("mongoose");
dotenv_1.default.config();
function rundbweb() {
    return __awaiter(this, void 0, void 0, function* () {
        // 4. Connect to MongoDB
        yield (0, mongoose_1.connect)(`${process.env.MONGODB}`);
    });
}
rundbweb();
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 4000;
app.use((0, express_fileupload_1.default)());
app.use(express_1.default.json());
app.use("/", files_router_1.default);
app.listen(port, () => {
    console.log(`Server run on http://127.0.0.1:${port}`);
});
