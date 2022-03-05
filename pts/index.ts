import fs from "fs";
import { render } from "template-file";

import { BaseMaker } from "../common/classes";
import { IPts, IDictConf } from "../common/interfaces";
import { FILENAME_MAP } from "../config";

export class Maker extends BaseMaker {
  constructor(conf: IDictConf) {
    super(conf);
  }

  protected _generateEntryHtml(entry: IPts): string {
    entry.text = this._rmRedundanceDtTag(entry);
    let isSingleDdEntry = this._isSingleDdEntry(entry)
    let entryGrammarHtml = isSingleDdEntry ? this._getEntryGrammarHtml(entry) : '' 
    const data = {
      entry: entry.word,
      entryGrammarHtml,
      textHtml: this._generateTextHtml(entry, isSingleDdEntry),
      cssFileName: FILENAME_MAP.css,
    };
    const template = fs.readFileSync(this.entryTemplateFile, "utf8");
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
        result = result.replace(tagRegexp, "");
      }
    }

    return result;
  }

  private _getEntryGrammarHtml(entry: IPts): string {
    const ddRegexp = /<dd(?: id='[^>]*-(?<index>\d)')?>.*?<\/dd>/g;
    let matchedArray = [...entry.text.matchAll(ddRegexp)];
    let [grammarHtml, _] = this._extractDdGrammarHtml(matchedArray[0][0]);
    return grammarHtml;
  }

  private _isSingleDdEntry(entry: IPts): boolean {
    const ddRegexp = /<dd(?: id='[^>]*-(?<index>\d)')?>.*?<\/dd>/g;
    let matchedArray = [...entry.text.matchAll(ddRegexp)];
    return matchedArray.length === 1;
  }

  private _generateTextHtml(entry: IPts, isSingleDdEntry:boolean): string {
    let result = "";
    const ddRegexp = /<dd(?: id='[^>]*-(?<index>\d)')?>.*?<\/dd>/g;
    let matchedArray = [...entry.text.matchAll(ddRegexp)];
    for (let dd of matchedArray) {
      let [ddGrammarHtml, ddHtml] = this._extractDdGrammarHtml(dd[0]);
      ddHtml = this._replaceKeywordLink(ddHtml);
      if (isSingleDdEntry) {
        result += ddHtml
      } else {
        let ddTitleHtml = `<div class='subTitle'><span class='word'>${entry.word}<sup>${dd?.groups?.index}</sup></span>${ddGrammarHtml}</div>`;
        result += ddTitleHtml + ddHtml; 
      }
    }
    return result;
  }

  private _extractDdGrammarHtml(ddHtml: string): [string, string] {
    const regexp = /<span class='grammar'>(?<grammar>.*?)<\/span>/g;
    let matchedArray = [...ddHtml.matchAll(regexp)];
    if (matchedArray.length) {
      let grammarHtml = `<span class='grammar'>( ${matchedArray[0].groups?.grammar} )</span>`;
      return [grammarHtml, ddHtml.replace(regexp, "")]
    }
    return ["", ddHtml];
  }

  private _replaceKeywordLink(text: string):string {
    const regexp = /<a href='\/define\/(.*?)'>/g;
    return text.replace(regexp, "<a class='linkTerm' href='entry://$1'>");
  }
}
