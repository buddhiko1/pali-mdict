import fs from "fs";
import { render } from "template-file";

import { MakerBase } from "../common/classes";
import { IDictConf } from "../common/interfaces";
import { GeneratorByDownload } from "../common/jsonFileGenerator";
import { IDppn } from "./interfaces";
import { FILENAME } from "../config";

export class Maker extends MakerBase {
  constructor(conf: IDictConf) {
    const jsonFileGenerator = new GeneratorByDownload(conf);
    super(conf, jsonFileGenerator);
  }

  protected _generateEntryHtml(entry: IDppn): string {
    const data = {
      entry: entry.word,
      type: this._getEntryType(entry.text),
      textHtml: this._rmRedundanceDtTag(entry.text),
      cssFileName: FILENAME.css,
    };
    const template = fs.readFileSync(this._entryTemplateFile, "utf8");
    return render(template, data);
  }

  private _getEntryType(text: string): string {
    const regex = /^<dl class='(?<entryType>[a-z]*)'>?/;
    const matched = text.match(regex);
    if (matched?.groups) {
      return matched.groups.entryType;
    }
    throw Error("Entry's type information doesn't exist!");
  }

  private _rmRedundanceDtTag(text: string): string {
    let result = text;
    const dtRegexp = /<dt>.*?<\/dt>/g;
    const matched = result.match(dtRegexp);

    if (matched?.length === 1) {
      result = result.replace(dtRegexp, "");
    }

    // remove a few exceptions
    if (matched?.length === 2) {
      const matchedStr = matched.toString();
      if (!matchedStr.includes("<sup>")) {
        const regexp = />([^<>,]+)</g;
        const alias = [...matchedStr.matchAll(regexp)].map((item) => item[1]);
        if (alias[0] === alias[1]) {
          result = result.replace(matched[0], "");
          result = result.replace(matched[1], "");
        }
      }
    }

    return result;
  }

  protected get _jsonFile(): string {
    return `${__dirname}/${FILENAME.json}`;
  }

  protected get _entryTemplateFile(): string {
    return `${__dirname}/${FILENAME.entryTemplate}`;
  }
}
