import fs from "fs";
import { render } from "template-file";

import { BaseMaker } from "../common/classes";
import { IAbbr, IDictConf } from "../common/interfaces";
import { FILENAME_MAP } from "../config";

export class Maker extends BaseMaker {
  constructor(conf: IDictConf) {
    super(conf);
  }

  protected async _downloadRawFile(): Promise<void> {
    console.info("downloading raw file...");
    console.log("skip this step for abbr...")
    console.info("download finished");
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
}
