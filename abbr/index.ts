import fs from "fs";
import { render } from "template-file";

import { BaseMaker } from "../common/classes";
import { IAbbr, IDictConf } from "../common/interfaces";
import { GeneratorByHand } from "../common/jsonFileGenerator";
import { FILENAME_MAP } from "../config";

export class Maker extends BaseMaker {
  constructor(conf: IDictConf) {
    let jsonFileGenerator = new GeneratorByHand(conf);
    super(conf, jsonFileGenerator);
  }

  protected _generateEntryHtml(entry: IAbbr): string {
    const data = {
      entry: entry.abbr,
      type: entry.type,
      cssFileName: FILENAME_MAP.css,
      text: entry.text,
    };
    const template = fs.readFileSync(this.entryTemplateFile, "utf8");
    return render(template, data);
  }

  protected get jsonFile(): string {
    return `${__dirname}/${FILENAME_MAP.json}`;
  }

  protected get entryTemplateFile(): string {
    return `${__dirname}/${FILENAME_MAP.entryTemplate}`;
  }
}
