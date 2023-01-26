import { getModelForClass, prop } from "@typegoose/typegoose";

class fileClass {
  @prop()
  public buffer?: number[];

  @prop()
  public fileName?: string;

  @prop()
  public type?: string;

  @prop()
  public hash?: string;
}

export async function createFile(
  buffer: number[],
  fileName: string,
  type: string,
  hash: string
) {
  const FileModel = getModelForClass(fileClass);

  let document = await FileModel.create({
    buffer,
    fileName,
    type,
    hash,
  });

  console.log(document);
}

export async function removeFile(hash: string, fileName: string) {
  const FileModel = getModelForClass(fileClass);

  let document = await FileModel.deleteMany({
    hash,
    fileName,
  }).exec();

  console.log(document);
}

export async function getFileDb(fileHash: string) {
  const FileModel = getModelForClass(fileClass);

  const regexp = new RegExp("^" + fileHash);
  let document: any = await FileModel.find({ hash: regexp }).exec();

  const o: any = {}; // empty Object
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

  return document;
}
