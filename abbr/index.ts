import fs from "fs";
import { render } from "template-file";

import { MakerBase } from "../common/classes";
import { IAbbr, IDictConf } from "../common/interfaces";
import { GeneratorByHand } from "../common/jsonFileGenerator";
import { FILENAME } from "../config";

export class Maker extends MakerBase {
  constructor(conf: IDictConf) {
    let jsonFileGenerator = new GeneratorByHand(conf);
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
