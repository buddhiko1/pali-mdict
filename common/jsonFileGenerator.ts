import fs from "fs";
import download from "download";
import { IDictConf, IJsonFileGenerator } from "./interfaces";

export class GeneratorByDownload implements IJsonFileGenerator {
  constructor(private conf: IDictConf) {}
  async generate(destinationPath: string): Promise<void> {
    console.info("downloading json file...");
    fs.writeFileSync(destinationPath, await download(this.conf.jsonUrl));
    console.info("download finished!");
  }
}

export class GeneratorByHand implements IJsonFileGenerator {
  constructor(private conf: IDictConf) {}
  async generate(destinationPath: string): Promise<void> {
    console.info("json file generated!");
  }
}
