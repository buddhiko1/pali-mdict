import fs from "fs";
import { render } from "template-file";

import { MakerBase } from "../common/classes";
import { IDictConf } from "../common/interfaces";
import { GeneratorByDownload } from "../common/jsonFileGenerator";
import { INcped } from "./interfaces";
import { FILENAME } from "../config";

export class Maker extends MakerBase {
  constructor(conf: IDictConf) {
    const jsonFileGenerator = new GeneratorByDownload(conf);
    super(conf, jsonFileGenerator);
  }

  protected _generateEntryHtml(entry: INcped): string {
    //
    let grammarHtml = "";
    if (entry.grammar) {
      grammarHtml = `<span class="grammar">( ${entry.grammar} )</span>`;
    }

    //
    let definitionHtml = "";
    if (entry.definition) {
      if (typeof entry.definition === "string") {
        definitionHtml = `\n  <li>${entry.definition}</li>`;
      } else {
        for (const item of entry.definition) {
          definitionHtml += `\n  <li>${item}</li>`;
        }
      }
    }
    if (definitionHtml) {
      definitionHtml = `<ul class="definition">${definitionHtml}\n</ul>`;
    }

    //
    let xfHtml = "";
    if (entry?.xr) {
      if (typeof entry.xr === "string") {
        xfHtml = `\n  <li><a href="entry://${entry.xr}">${entry.xr}</a></li>`;
      } else {
        for (const item of entry.xr) {
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
      cssFileName: FILENAME.css,
      definitionHtml: definitionHtml,
      xfHtml: xfHtml,
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
