import fs from "fs";
import download from "download";
import { IDictConf, IJsonFileGenerator } from "./interfaces";

export class GeneratorByDownload implements IJsonFileGenerator {
  constructor(private conf: IDictConf) {}
  async generate(jsonFile: string): Promise<void> {
    console.info("downloading json file...");
    if (this.conf.jsonUrl) {
      fs.writeFileSync(jsonFile, await download(this.conf.jsonUrl));
    } else {
      throw Error("invalid json url!")
    }
    console.info("download finished!");
  }
}

export class GeneratorByHand implements IJsonFileGenerator {
  constructor(private conf: IDictConf) {}
  async generate(jsonFile: string): Promise<void> {
    console.info("json file generated!");
  }
}
