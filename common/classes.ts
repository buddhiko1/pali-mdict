import fs from "fs";
import { render } from "template-file";
import download from "download";

import { Entry, IDictConf } from "./interfaces";
import { FILENAME_MAP } from "../config"

export abstract class BaseMaker {
  constructor(private conf: IDictConf) {}

  private get rawFile(): string {
    return `${this.conf.moduleDir}/${FILENAME_MAP.raw}`;
  }

  private get txtOutputFile(): string {
    return `${this.conf.outputDir}/${FILENAME_MAP.txt}`;
  }

  private get titleTemplateFile(): string {
    return `${__dirname}/${FILENAME_MAP.title}`;
  }

  private get titleOutputFile(): string {
    return `${this.conf.outputDir}/${FILENAME_MAP.title}`;
  }

  private get descriptionTemplateFile(): string {
    return `${__dirname}/${FILENAME_MAP.description}`;
  }

  private get descriptionOutputFile(): string {
    return `${this.conf.outputDir}/${FILENAME_MAP.description}`;
  }

  protected get entryTemplateFile(): string {
    return `${this.conf.moduleDir}/${FILENAME_MAP.entryTemplate}`;
  }

  public clean(): void {
    if (fs.existsSync(this.txtOutputFile)) {
      console.info(`rm ${this.txtOutputFile}`);
      fs.unlinkSync(this.txtOutputFile);
    }
  }

  async make(pull: boolean): Promise<void> {
    console.info(`making ${this.conf.shortName} mdict...`);
    this._init();
    if (pull) {
      this._downloadRawFile();
    } else {
      if (!fs.existsSync(this.rawFile)) {
        await this._downloadRawFile();
      }
    }
    let txtStr = this._generateTxtStr();
    this._makeTxtFile(txtStr);
    this._makeTitleFile();
    this._makeDescriptionFile();
    console.info(`${this.conf.shortName} mdict created!`);
  }

  private _init(): void {
    if (!fs.existsSync(this.conf.outputDir)) {
      fs.mkdirSync(this.conf.outputDir, { recursive: true });
    }
  }

  private async _downloadRawFile(): Promise<void> {
    console.info("downloading raw file...");
    fs.writeFileSync(this.rawFile, await download(this.conf.rawUrl));
    console.info("download finished");
  }

  private _generateTxtStr(): string {
    let result: string = "";
    const rawData = fs.readFileSync(this.rawFile);
    let json = JSON.parse(rawData.toString());
    for (let entry of json) {
      entry = <Entry>entry;
      result += this._generateEntryHtml(entry);
      result += "</>\r\n"; // Split string of entry
    }
    return result;
  }

  protected abstract _generateEntryHtml(entry: Entry): string;

  private _makeTxtFile(htmlStr: string): void {
    // Replace LF with CRLF for bug fixing of mdx builder.
    // htmlStr = htmlStr.replace(/[^\r]\n/g, "\r\n");
    fs.writeFileSync(this.txtOutputFile, htmlStr, "utf-8");
  }

  private _makeTitleFile() {
    const data = {
      title: this.conf.shortName.toLocaleUpperCase(),
    };
    const template = fs.readFileSync(this.titleTemplateFile, "utf8");
    const htmlStr = render(template, data);
    fs.writeFileSync(this.titleOutputFile, htmlStr, "utf-8");
  }

  private _makeDescriptionFile() {
    const rawData = fs.readFileSync(this.rawFile);
    let json = JSON.parse(rawData.toString());
    const data = {
      fullName: this.conf.fullName,
      rawUrl: this.conf.rawUrl,
      entries: json.length,
    };
    const template = fs.readFileSync(this.descriptionTemplateFile, "utf8");
    const htmlStr = render(template, data);
    fs.writeFileSync(this.descriptionOutputFile, htmlStr, "utf-8");
  }
}
