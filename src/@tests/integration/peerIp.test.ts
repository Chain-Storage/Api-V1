import { peers } from "../../peers/peerIp";

jest.mock("../peers/peerIp");

it("should mock function peers", () => {
  const functionNameMock = jest.fn();
  jest.spyOn(peers.prototype, "peers").mockImplementation(functionNameMock);
});
