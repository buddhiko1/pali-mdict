import fs from "fs";
import { render } from "template-file";

import { BaseGenerator } from "../common/classes"; 
import { IDppn } from "../common/interfaces"
import { DictEnum } from "../config";

export class Generator extends BaseGenerator {
  constructor(rawUrl: string, outputDir: string) {
    super(rawUrl, __dirname, DictEnum.DPPN, outputDir);
  }
  
  protected _generateEntryHtml(entry: IDppn): string {
    const data = {
      entry: entry.word,
      type: this._getEntryType(entry.text),
      textHtml: this._rmRedundanceDtTag(entry.text),
      cssFileName: this.config.cssFileName,
    };
    const entryHtmlStr = fs.readFileSync(this.config.entryHtmlFile, "utf8");
    return render(entryHtmlStr, data);
  }

  private _getEntryType(text: string): string {
    let regex = /^<dl class='(?<entryType>[a-z]*)'>?/;
    let matched = text.match(regex);
    if (matched?.groups) {
      return matched.groups.entryType;
    }
    throw Error("The type of the entry doesn't exist in the text!");
  }

  private _rmRedundanceDtTag(text: string): string {
    let result = text;
    const regexp = /<dt>.*?<\/dt>/g;
    let matched = result.match(regexp);

    if (matched?.length === 1) {
      result = result.replace(regexp, "");
    }

    if (matched?.length === 2) {
      let matchedStr = matched.toString();
      if (!matchedStr.includes("<sup>")) {
        const regexp = />([^<>,]+)</g;
        let alias = [...matchedStr.matchAll(regexp)].map((item) => item[1]);
        if (alias[0] === alias[1]) {
          result = result.replace(matched[0], "");
          result = result.replace(matched[1], "");
        }
      }
    }
    
    return result;
  }
}
