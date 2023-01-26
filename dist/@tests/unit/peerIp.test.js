"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const peerIp_1 = require("../../peers/peerIp");
jest.mock("../peers/peerIp");
it("should mock function peers", () => {
    const functionNameMock = jest.fn();
    jest.spyOn(peerIp_1.peers.prototype, "peers").mockImplementation(functionNameMock);
});
