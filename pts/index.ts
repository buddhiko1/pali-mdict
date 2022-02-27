import fs from "fs";
import { render } from "template-file";

import { BaseGenerator } from "../common/classes";
import { IPts } from "../common/interfaces";
import { DictEnum } from "../config";

export class Generator extends BaseGenerator {
  constructor(rawUrl: string, outputDir: string) {
    super(rawUrl, __dirname, DictEnum.PTS, outputDir);
  }

  protected _generateEntryHtml(entry: IPts): string {
    const data = {
      entry: entry.word,
      textHtml: this._rmRedundanceDtTag(entry),
      cssFileName: this.config.cssFileName,
      etymologyHtml: this._extractEtymologyHtml(entry),
    };
    const entryHtmlStr = fs.readFileSync(this.config.entryHtmlFile, "utf8");
    return render(entryHtmlStr, data);
  }

  private _rmRedundanceDtTag(entry: IPts): string {
    let result = entry.text;

    //
    const tagRegexp = /<dt>.*?<\/dt>/g;
    let matchedArray = result.match(tagRegexp);
    if (matchedArray?.length === 1) {
      const aliasRegexp = />([^<>]+)</g;
      let alias = [...matchedArray[0].matchAll(aliasRegexp)].map(
        (item) => item[1]
      );
      if (alias[0].toLowerCase() === entry.word.toLowerCase()) {
        // console.log(`${word.word} \| ${alias[0]}`);
        result = result.replace(tagRegexp, "");
      }
    }

    return result;
  }

  private _extractEtymologyHtml(entry: IPts): string {
    const regexp = /(?<etymology><p class='eti'>.*?<\/p>)/g;
    let matchedArray = [...entry.text.matchAll(regexp)];
    if (matchedArray) {
      console.info(`word: ${entry.word}, etymology:${matchedArray}`);
    } else {
      console.log("empty");
    }
    return "";
  }
}
