import fs from "fs";
import { render } from "template-file";

import { BaseGenerator } from "../common/classes";
import { INcped } from "../common/interfaces";

export class Generator extends BaseGenerator {
  constructor(rawUrl: string, outputDir: string) {
    const name = "ncped";
    super(rawUrl, __dirname, name, outputDir);
  }

  private _generateEntryHtml(entry: INcped): string {
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
      cssFileName: this.config.cssFileName,
      definitionHtml: definitionHtml,
      xfHtml: xfHtml,
    };
    const templateString = fs.readFileSync(this.config.entryHtmlFile, "utf8");
    return render(templateString, data);
  }

  protected _generateHtmlStr(): string {
    let result: string = "";
    const rawData = fs.readFileSync(this.config.rawFile);
    let json = JSON.parse(rawData.toString());
    for (let entry of json) {
      entry = <INcped>entry;
      result += this._generateEntryHtml(entry)
      result += "</>\r\n"; // Split string of entry
    }
    return result;
  }
}
