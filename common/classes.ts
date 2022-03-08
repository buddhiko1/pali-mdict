import fs from "fs";
import execSh from "exec-sh";
import { render } from "template-file";

import { IEntry, IDictConf, IJsonFileGenerator } from "./interfaces";
import { FILENAME_MAP } from "../config"

export abstract class BaseMaker {
  constructor(
    private conf: IDictConf,
    private jsonFileGenerator: IJsonFileGenerator
  ) {}

  public clean(): void {
    console.log("remove temporary files ...\n");
    if (fs.existsSync(this.txtOutputFile)) {
      fs.unlinkSync(this.txtOutputFile);
    }
    if (fs.existsSync(this.titleOutputFile)) {
      fs.unlinkSync(this.titleOutputFile);
    }
    if (fs.existsSync(this.descriptionOutputFile)) {
      fs.unlinkSync(this.descriptionOutputFile);
    }
  }

  async make(download: boolean, forEudic: boolean): Promise<void> {
    console.info(`making ${this.conf.shortName} mdict ...\n`);
    await this._init(download);
    let txtStr = this._generateTxtStr();
    this._makeTxtFile(txtStr);
    this._makeTitleFile(forEudic);
    this._makeDescriptionFile();
    await this._makeMdxFile();
    this.clean();
    console.info(`${this.conf.shortName} mdict created!\n`);
  }

  private async _init(download: boolean): Promise<void> {
    if (!fs.existsSync(this.conf.outputDir)) {
      fs.mkdirSync(this.conf.outputDir, { recursive: true });
    }
    if (download) {
      await this.jsonFileGenerator.generate(this.jsonFile);
    }
    if (!fs.existsSync(this.jsonFile)) {
      await this.jsonFileGenerator.generate(this.jsonFile);
    }
  }

  private _generateTxtStr(): string {
    let result: string = "";
    const jsonData = fs.readFileSync(this.jsonFile);
    let json = JSON.parse(jsonData.toString());
    for (let entry of json) {
      entry = <IEntry>entry;
      result += this._generateEntryHtml(entry);
      result += "</>\r\n"; // Split string of entry
    }
    return result;
  }

  protected abstract _generateEntryHtml(entry: IEntry): string;

  private _makeTxtFile(htmlStr: string): void {
    // Replace LF with CRLF for bug fixing of mdx builder.
    // htmlStr = htmlStr.replace(/[^\r]\n/g, "\r\n");
    fs.writeFileSync(this.txtOutputFile, htmlStr, "utf-8");
  }

  private _makeTitleFile(forEudic: boolean) {
    let htmlStr: string;
    if (forEudic) {
      htmlStr = this.conf.shortName.toLocaleUpperCase();
    } else {
      const data = {
        title: this.conf.shortName.toLocaleUpperCase(),
      };
      const template = fs.readFileSync(this.titleTemplateFile, "utf8");
      htmlStr = render(template, data);
    }
    fs.writeFileSync(this.titleOutputFile, htmlStr, "utf-8");
  }

  private _makeDescriptionFile() {
    const jsonData = fs.readFileSync(this.jsonFile);
    let json = JSON.parse(jsonData.toString());
    const data = {
      fullName: this.conf.fullName,
      jsonUrl: this.conf.jsonUrl,
      entries: json.length,
    };
    const template = fs.readFileSync(this.descriptionTemplateFile, "utf8");
    const htmlStr = render(template, data);
    fs.writeFileSync(this.descriptionOutputFile, htmlStr, "utf-8");
  }

  private async _makeMdxFile() {
    const command = `mdict --title ${FILENAME_MAP.title} --description ${FILENAME_MAP.description} -a ${FILENAME_MAP.txt} ${FILENAME_MAP.mdx}`;
    try {
      let result = await execSh.promise(command, { cwd: this.conf.outputDir });
      console.info(result.stdout);
      console.error(result.stderr);
    } catch (e) {
      console.log(`error: ${e}`);
    }
  }

  protected abstract get jsonFile(): string;

  protected abstract get entryTemplateFile(): string;

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
}
