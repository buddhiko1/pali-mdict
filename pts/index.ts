import fs from "fs";
import { render } from "template-file";

import { BaseMaker } from "../common/classes";
import { IPts, IDictConf } from "../common/interfaces";

export class Maker extends BaseMaker {
  constructor(dictConf: IDictConf) {
    super(dictConf, __dirname);
  }

  protected _generateEntryHtml(entry: IPts): string {
    const data = {
      entry: entry.word,
      textHtml: this._rmRedundanceDtTag(entry),
      cssFileName: this.conf.cssFileName,
      etymologyHtml: this._extractEtymologyHtml(entry),
    };
    const template = fs.readFileSync(this.conf.entryHtmlFile, "utf8");
    return render(template, data);
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
