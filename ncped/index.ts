import fs from "fs";
import { render } from "template-file";

import { BaseMaker } from "../common/classes";
import { INcped, IDictConf } from "../common/interfaces";

export class Maker extends BaseMaker {
  constructor(dictConf: IDictConf) {
    super(dictConf, __dirname);
  }

  protected _generateEntryHtml(entry: INcped): string {
    //
    let grammarHtml: string = "";
    if (entry.grammar) {
      grammarHtml = `<span class="grammar">( ${entry.grammar} )</span>`;
    }

    //
    let definitionHtml: string = "";
    if (entry.definition) {
      if (typeof entry.definition === "string") {
        definitionHtml = `\n  <li>${entry.definition}</li>`;
      } else {
        for (let item of entry.definition) {
          definitionHtml += `\n  <li>${item}</li>`;
        }
      }
    }
    if (definitionHtml) {
      definitionHtml = `<ul class="definition">${definitionHtml}\n</ul>`;
    }

    //
    let xfHtml: string = "";
    if (entry?.xr) {
      if (typeof entry.xr === "string") {
        xfHtml = `\n  <li><a href="entry://${entry.xr}">${entry.xr}</a></li>`;
      } else {
        for (let item of entry.xr) {
          xfHtml += `\n  <li><a href="entry://${item}">${item}</a></li>`;
        }
      }
    }
    if (xfHtml) {
      xfHtml = `<ul class="crossRef">${xfHtml}\n</ul>`;
    }

    const data = {
      entry: entry.entry,
      grammarHtml: grammarHtml,
      cssFileName: this.conf.cssFileName,
      definitionHtml: definitionHtml,
      xfHtml: xfHtml,
    };
    const template = fs.readFileSync(this.conf.entryHtmlFile, "utf8");
    return render(template, data);
  }
}
