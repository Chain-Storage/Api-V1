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
const fs_1 = __importDefault(require("fs"));
const net_1 = __importDefault(require("net"));
const createPeer_1 = require("../database/createPeer");
function getFiles(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const findPeers = yield (0, createPeer_1.getPeers)();
        let peersIp = [];
        for (let index = 0; index < findPeers.length; index++) {
            peersIp.push(findPeers[index].DeviceIp);
        }
        let uniqueChars = [...new Set(peersIp)];
        console.log(uniqueChars);
        let promises = [];
        for (let index = 0; index < uniqueChars.length; index++) {
            const element = uniqueChars[index];
            promises.push(new Promise((resolve, reject) => {
                // connect to the server using net.connect
                let chunks = [];
                const client = net_1.default.connect({
                    host: element,
                    port: 9001,
                }, () => __awaiter(this, void 0, void 0, function* () {
                    console.log("connected to server!");
                    // create message object to send to the server
                    const message = {
                        data: [],
                        fileHash: process.argv[2],
                        type: "getFile",
                        fileName: "unknow",
                        time: new Date(),
                    };
                    // convert message object to string
                    const messageString = JSON.stringify(message);
                    // send message to the server
                    client.write(messageString);
                    client.on("data", (data) => {
                        chunks.push(data.toString());
                    });
                    client.on("end", () => {
                        let jsonString = chunks.join("");
                        let jsonData = JSON.parse(jsonString);
                        resolve(jsonData);
                    });
                    client.on("error", (err) => {
                        reject(err);
                    });
                }));
            }));
            let fileArrayOutput = yield Promise.all(promises);
            let fileArray = [];
            for (let index = 0; index < fileArrayOutput.length; index++) {
                const element = fileArrayOutput[index];
                for (let index = 0; index < element.length; index++) {
                    const subElement = element[index];
                    fileArray.push(subElement);
                }
            }
            fileArray.sort(function (a, b) {
                let numA = parseInt(a.hash.split("-")[1]);
                let numB = parseInt(b.hash.split("-")[1]);
                return numA - numB;
            });
            console.log(fileArray);
            let bufferArray = [];
            for (let index = 0; index < fileArray.length; index++) {
                const element = fileArray[index].buffer;
                console.log(element);
                for (let index = 0; index < element.length; index++) {
                    const subElement = element[index];
                    bufferArray.push(subElement);
                }
            }
            const buffer = Buffer.from(bufferArray);
            fs_1.default.writeFileSync(fileArray[0].fileName, buffer);
            res.json({
                message: "File Write Succesfully",
            });
        }
    });
}
exports.default = { getFiles };
