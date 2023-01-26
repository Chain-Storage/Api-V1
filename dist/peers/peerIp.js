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
exports.peers = void 0;
const https_1 = __importDefault(require("https"));
const os_1 = __importDefault(require("os"));
const crypto_1 = __importDefault(require("crypto"));
const ip_1 = __importDefault(require("ip"));
function peers() {
    return __awaiter(this, void 0, void 0, function* () {
        let peerIp = "";
        const hostName = os_1.default.hostname();
        https_1.default
            .get("https://api.ipify.org", (res) => {
            res.on("data", (data) => __awaiter(this, void 0, void 0, function* () {
                console.log(`Your public IPv4 address is: ${data}`);
                peerIp = yield data.toString();
            }));
        })
            .on("error", (err) => {
            console.log(`Error: ${err.message}`);
        });
        const peerHash = crypto_1.default
            .createHash("sha256")
            .update(peerIp + hostName)
            .digest("hex");
        const ipV4 = ip_1.default.address();
        return {
            PublicIpV4: peerIp,
            DeviceIp: ipV4,
            hostName: hostName,
            peerHash: peerHash,
            port: 9001,
        };
    });
}
exports.peers = peers;
