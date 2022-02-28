import fs from "fs";
import { render } from "template-file";
import download from "download";

import { IMakerConf, Entry, IDictConf } from "./interfaces";

export abstract class BaseMaker {
  protected conf: IMakerConf;

  constructor(
    dictConf: IDictConf,
    dictDir: string,
  ) {
    const txtFile = `${dictConf.outputDir}/${dictConf.shortName}.txt`;
    this.conf = {
      dictConf,
      rawFile: `${dictDir}/${dictConf.shortName}.json`,
      entryHtmlFile: `${dictDir}/entry.html`,
      txtFile,
      cssFileName: `${dictConf.shortName}.css`,
    };
  }

  public clean(): void {
    if (fs.existsSync(this.conf.txtFile)) {
      console.info(`rm ${this.conf.txtFile}`);
      fs.unlinkSync(this.conf.txtFile);
    }
  }

  async make(pull: boolean): Promise<void> {
    console.info(`making ${this.conf.dictConf.shortName} mdict...`);
    this._init();
    if (pull) {
      this._downloadRawFile();
    } else {
      if (!fs.existsSync(this.conf.rawFile)) {
        await this._downloadRawFile();
      }
    }
    let txtStr = this._generateTxtStr();
    this._makeTxtFile(txtStr);
    this._makeTitleHtmlFile();
    this._makeDescriptionHtmlFile();
    
    console.info(`${this.conf.dictConf.shortName} mdict created!`);
  }

  private _init(): void {
    if (!fs.existsSync(this.conf.dictConf.outputDir)) {
      fs.mkdirSync(this.conf.dictConf.outputDir, { recursive: true });
    }
  }

  private async _downloadRawFile(): Promise<void> {
    console.info("downloading raw file...");
    fs.writeFileSync(this.conf.rawFile, await download(this.conf.dictConf.rawUrl));
    console.info("download finished");
  }

  private _generateTxtStr(): string {
    let result: string = "";
    const rawData = fs.readFileSync(this.conf.rawFile);
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
    fs.writeFileSync(this.conf.txtFile, htmlStr, "utf-8");
  }
  
  private _makeTitleHtmlFile() {
    const data = {
      title: this.conf.dictConf.shortName.toLocaleUpperCase(),
    };
    const template = fs.readFileSync(`${__dirname}/title.html`, "utf8");
    return render(template, data);
  };
  
  private _makeDescriptionHtmlFile() {
    const rawData = fs.readFileSync(this.conf.rawFile);
    let json = JSON.parse(rawData.toString());
    const data = {
      fullName: this.conf.dictConf.fullName,
      rawUrl: this.conf.dictConf.rawUrl,
      entries: json.length
    };
    const template = fs.readFileSync(`${__dirname}/description.html`, "utf8");
    return render(template, data);
  }
}
