import fs from "fs";
import path from "path";
import download from "download";

import { IConfig, Entry } from "./interfaces";
import { DictEnum } from "../config";

export abstract class BaseGenerator {
  private dictName: DictEnum;
  protected config: IConfig;

  constructor(
    rawUrl: string,
    dictDir: string,
    dictName: DictEnum,
    outputDir: string
  ) {
    const txtFile = `${outputDir}/${dictName}/${dictName}.txt`;
    this.dictName = dictName;
    this.config = {
      rawUrl,
      rawFile: `${dictDir}/${dictName}.json`,
      entryHtmlFile: `${dictDir}/entry.html`,
      txtFile,
      cssFileName: `${dictName}.css`,
    };
  }

  public clean(): void {
    if (fs.existsSync(this.config.txtFile)) {
      console.info(`rm ${this.config.txtFile}`);
      fs.unlinkSync(this.config.txtFile);
    }
  }

  async generate(pull: boolean): Promise<void> {
    console.info(`generating ${this.dictName}'s txt file...`);
    this._init();
    if (pull) {
      this._downloadRawFile();
    } else {
      if (!fs.existsSync(this.config.rawFile)) {
        await this._downloadRawFile();
      }
    }
    let htmlStr = this._generateHtmlStr();
    this._writeHtmlToFile(htmlStr);
    console.info(`${this.dictName}'s txt file generated!`);
  }

  private _init(): void {
    const outputDir = path.dirname(this.config.txtFile);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  }

  private async _downloadRawFile(): Promise<void> {
    console.info("downloading raw file...");
    fs.writeFileSync(this.config.rawFile, await download(this.config.rawUrl));
    console.info("download finished");
  }

  private _generateHtmlStr(): string {
    let result: string = "";
    const rawData = fs.readFileSync(this.config.rawFile);
    let json = JSON.parse(rawData.toString());
    for (let entry of json) {
      entry = <Entry>entry;
      result += this._generateEntryHtml(entry);
      result += "</>\r\n"; // Split string of entry
    }
    return result;
  }

  protected abstract _generateEntryHtml(entry: Entry): string;

  _writeHtmlToFile(htmlStr: string): void {
    // Replace LF with CRLF for bug fixing of mdx builder.
    // htmlStr = htmlStr.replace(/[^\r]\n/g, "\r\n");
    fs.writeFileSync(this.config.txtFile, htmlStr, "utf-8");
  }
}
