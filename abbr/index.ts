import fs from "fs";
import { render } from "template-file";

import { MakerBase } from "../public/classes";
import { IDictConf } from "../public/interfaces";
import { GeneratorByHand } from "../public/jsonFileGenerator";
import { IAbbr } from "./interfaces";
import { FILENAME } from "../config";

export class Maker extends MakerBase {
  constructor(conf: IDictConf) {
    const jsonFileGenerator = new GeneratorByHand(conf);
    super(conf, jsonFileGenerator);
  }

  protected _generateEntryHtml(entry: IAbbr): string {
    const data = {
      entry: entry.abbr,
      type: entry.type,
      cssFileName: FILENAME.css,
      text: entry.text,
    };
    const template = fs.readFileSync(this._entryTemplateFile, "utf8");
    return render(template, data);
  }

  protected get _jsonFile(): string {
    return `${__dirname}/${FILENAME.json}`;
  }

  protected get _entryTemplateFile(): string {
    return `${__dirname}/${FILENAME.entryTemplate}`;
  }
}
