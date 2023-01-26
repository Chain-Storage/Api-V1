import { getModelForClass, prop } from "@typegoose/typegoose";
import mongoose from "mongoose";

class UserClass {
  @prop()
  public PublicIpV4?: string;

  @prop()
  public DeviceIp?: string;

  @prop()
  public hostName?: string;

  @prop()
  public peerHash?: string;
}

export async function getPeers(): Promise<any> {
  const UserModel = getModelForClass(UserClass);

  let document: any = await UserModel.find({}).exec();

  return document;
}
