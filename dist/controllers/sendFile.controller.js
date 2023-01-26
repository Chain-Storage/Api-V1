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
const crypto_1 = __importDefault(require("crypto"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const connectPeer_1 = require("../peers/connectPeer");
const createPeer_1 = require("../database/createPeer");
function sendFiles(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const file = (_a = req === null || req === void 0 ? void 0 : req.files) === null || _a === void 0 ? void 0 : _a.myFile;
        const fileName = path_1.default.basename(file.name);
        const buffer = fs_1.default.readFileSync(file.data);
        const fileHash = crypto_1.default
            .createHash("sha256")
            .update("Ec" + fileName)
            .digest("hex");
        function mySplit(a, delimiter) {
            const result = [];
            let currentToken = [];
            for (let i = 0; i < a.length; i++) {
                if (a[i] === delimiter) {
                    if (currentToken.length !== 0)
                        result.push(currentToken);
                    currentToken = [];
                }
                else {
                    currentToken.push(a[i]);
                }
            }
            if (currentToken.length !== 0)
                result.push(currentToken);
            return result;
        }
        const fileData = mySplit(buffer, -1)[0];
        console.log(fileData, fileHash, fileName);
        res.status(201).json({
            status: "success",
            data: {
                fileName: file.name,
            },
        });
        const readFiles = {
            fileData,
            fileHash,
            fileName,
        };
        const findPeers = yield (0, createPeer_1.getPeers)();
        const peers = [findPeers];
        let peersIp = [];
        for (let index = 0; index < findPeers.length; index++) {
            peersIp.push(peers[0][index].DeviceIp);
        }
        let uniqueChars = [...new Set(peersIp)];
        console.log(uniqueChars);
        console.log((yield readFiles).fileData.length / 60000);
        console.log(Math.trunc((yield readFiles).fileData.length / 60000) + 1);
        const loopCount = Math.trunc((yield readFiles).fileData.length / 256) + 1;
        const sliceSize = Math.ceil((yield readFiles).fileData.length / loopCount);
        const partsArray = [];
        console.log(loopCount);
        for (let i = 0; i < loopCount; i++) {
            const start = i * sliceSize;
            const end = start + sliceSize;
            partsArray.push((yield readFiles).fileData.slice(start, end));
            let elementIp = "";
            // Change Configuration Send File by External IpV4
            if (typeof uniqueChars[i] !== "undefined") {
                elementIp = uniqueChars[i];
            }
            else {
                elementIp = uniqueChars[0];
            }
            console.log("Peers Ip: " + elementIp);
            (0, connectPeer_1.connectPeer)(elementIp, partsArray[partsArray.length - 1], `${(yield readFiles).fileHash}-${i + 1}`, "sendFile", `${(yield readFiles).fileName}`);
            if (loopCount === 1) {
                continue;
            }
        }
        console.log(partsArray);
        setTimeout(() => { }, 10000);
        res.json({
            message: "data sended succesfully",
            data: {
                hash: readFiles.fileHash,
                name: readFiles.fileName,
            },
        });
    });
}
exports.default = { sendFiles };
