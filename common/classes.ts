import fs from "fs";
import path from "path";
import download from "download";

import { IConfig } from "./interfaces";

export abstract class BaseGenerator {
  protected config: IConfig;

  constructor(
    rawUrl: string,
    dictDir: string,
    dictName: string,
    outputDir: string
  ) {
    const txtFile = `${outputDir}/${dictName}/${dictName}.txt`;
    this.config = {
      rawUrl,
      rawFile: `${dictDir}/${dictName}.json`,
      entryHtmlFile: `${dictDir}/entry.html`,
      txtFile,
      cssFileName: `${dictName}.css`,
    };
  }

  async generate(pull: boolean): Promise<void> {
    this._init();
    if (pull) {
      this._downloadRawFile();
    } else {
      if (!fs.existsSync(this.config.rawFile)) {
        await this._downloadRawFile();
      }
    }
    let htmlStr = this._generateHtmlStr();
    return this._writeHtmlToFile(htmlStr);
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

  protected abstract _generateHtmlStr(): string;

  _writeHtmlToFile(htmlStr: string): void {
    // Replace LF with CRLF for bug fixing of mdx builder.
    // htmlStr = htmlStr.replace(/\n/g, "\r\n");
    fs.writeFileSync(this.config.txtFile, htmlStr, "utf-8");
  }
}
