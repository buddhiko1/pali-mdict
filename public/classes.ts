import fs from "fs";
import execSh from "exec-sh";
import { render } from "template-file";

import { IEntry, IDictConf, IJsonFileGenerator } from "./interfaces";
import { FILENAME } from "../config";

export abstract class MakerBase {
  constructor(
    private conf: IDictConf,
    private jsonFileGenerator: IJsonFileGenerator
  ) {}

  clean(): void {
    console.log("remove temporary files ...\n");
    if (fs.existsSync(this._txtOutputFile)) {
      fs.unlinkSync(this._txtOutputFile);
    }
    if (fs.existsSync(this._titleOutputFile)) {
      fs.unlinkSync(this._titleOutputFile);
    }
    if (fs.existsSync(this._descriptionOutputFile)) {
      fs.unlinkSync(this._descriptionOutputFile);
    }
  }

  async make(download: boolean, forEudic: boolean): Promise<void> {
    console.info(`making ${this.conf.shortName} mdict ...\n`);
    await this._init(download);
    const txtStr = this._generateTxtStr();
    this._makeTxtFile(txtStr);
    this._makeTitleFile(forEudic);
    this._makeDescriptionFile();
    await this._makeMdxFile();
    this._makeAssets();
    this.clean();
    console.info(`${this.conf.shortName} mdict created!\n`);
  }

  private async _init(download: boolean): Promise<void> {
    if (!fs.existsSync(this.conf.outputDir)) {
      fs.mkdirSync(this.conf.outputDir, { recursive: true });
    }
    if (download) {
      await this.jsonFileGenerator.generate(this._jsonFile);
    }
    if (!fs.existsSync(this._jsonFile)) {
      await this.jsonFileGenerator.generate(this._jsonFile);
    }
  }

  private _generateTxtStr(): string {
    let result = "";
    const jsonData = fs.readFileSync(this._jsonFile);
    const json = JSON.parse(jsonData.toString());
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
    fs.writeFileSync(this._txtOutputFile, htmlStr, "utf-8");
  }

  private _makeTitleFile(forEudic: boolean) {
    let htmlStr: string;
    if (forEudic) {
      htmlStr = this.conf.shortName.toLocaleUpperCase();
    } else {
      const data = {
        title: this.conf.shortName.toLocaleUpperCase(),
      };
      const template = fs.readFileSync(this._titleTemplateFile, "utf8");
      htmlStr = render(template, data);
    }
    fs.writeFileSync(this._titleOutputFile, htmlStr, "utf-8");
  }

  private _makeDescriptionFile() {
    const jsonData = fs.readFileSync(this._jsonFile);
    const json = JSON.parse(jsonData.toString());
    const data = {
      fullName: this.conf.fullName,
      entries: json.length,
    };
    const template = fs.readFileSync(this._descriptionTemplateFile, "utf8");
    const htmlStr = render(template, data);
    fs.writeFileSync(this._descriptionOutputFile, htmlStr, "utf-8");
  }

  private async _makeMdxFile() {
    const command = `mdict --title ${FILENAME.title} --description ${FILENAME.description} -a ${FILENAME.txt} ${FILENAME.mdx}`;
    try {
      const result = await execSh.promise(command, {
        cwd: this.conf.outputDir,
      });
      console.info(result.stdout);
      console.error(result.stderr);
    } catch (e) {
      console.log(`error: ${e}`);
    }
  }

  private _makeAssets() {
    fs.copyFileSync(
      `${this.conf.assetsDir}/${FILENAME.css}`,
      `${this.conf.outputDir}/${FILENAME.css}`
    );
    fs.copyFileSync(
      `${this.conf.assetsDir}/${FILENAME.icon}`,
      `${this.conf.outputDir}/${FILENAME.icon}`
    );
  }

  protected abstract get _jsonFile(): string;

  protected abstract get _entryTemplateFile(): string;

  private get _txtOutputFile(): string {
    return `${this.conf.outputDir}/${FILENAME.txt}`;
  }

  private get _titleTemplateFile(): string {
    return `${__dirname}/${FILENAME.title}`;
  }

  private get _titleOutputFile(): string {
    return `${this.conf.outputDir}/${FILENAME.title}`;
  }

  private get _descriptionTemplateFile(): string {
    return `${__dirname}/${FILENAME.description}`;
  }

  private get _descriptionOutputFile(): string {
    return `${this.conf.outputDir}/${FILENAME.description}`;
  }
}
