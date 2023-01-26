"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileDb = exports.removeFile = exports.createFile = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const mongoose_1 = __importStar(require("mongoose"));
class fileClass {
}
__decorate([
    (0, typegoose_1.prop)()
], fileClass.prototype, "buffer", void 0);
__decorate([
    (0, typegoose_1.prop)()
], fileClass.prototype, "fileName", void 0);
__decorate([
    (0, typegoose_1.prop)()
], fileClass.prototype, "type", void 0);
__decorate([
    (0, typegoose_1.prop)()
], fileClass.prototype, "hash", void 0);
function createFile(buffer, fileName, type, hash) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = "mongodb://localhost:27017/EtrusChain";
        yield (0, mongoose_1.connect)(db);
        const FileModel = (0, typegoose_1.getModelForClass)(fileClass);
        let document = yield FileModel.create({
            buffer,
            fileName,
            type,
            hash,
        });
        console.log(document);
        //mongoose.disconnect();
    });
}
exports.createFile = createFile;
function removeFile(hash, fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = "mongodb://localhost:27017/EtrusChain";
        yield (0, mongoose_1.connect)(db);
        const FileModel = (0, typegoose_1.getModelForClass)(fileClass);
        let document = yield FileModel.deleteMany({
            hash,
            fileName,
        }).exec();
        console.log(document);
        mongoose_1.default.disconnect();
    });
}
exports.removeFile = removeFile;
function getFileDb(fileHash) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = "mongodb://localhost:27017/EtrusChain";
        yield (0, mongoose_1.connect)(db);
        const FileModel = (0, typegoose_1.getModelForClass)(fileClass);
        const regexp = new RegExp("^" + fileHash);
        let document = yield FileModel.find({ hash: regexp }).exec();
        const o = {}; // empty Object
        const key = "files";
        o[key] = []; // empty Array, which you can push() values into
        for (let index = 0; index < document.length; index++) {
            const element = document[index];
            const data = {
                buffer: element.buffer,
                hash: element.hash,
                fileName: element.fileName,
            };
            o[key].push(data);
        }
        // mongoose.disconnect();
        return document;
    });
}
exports.getFileDb = getFileDb;
