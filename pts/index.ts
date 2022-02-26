import fs from "fs";
import download from "download";
import { render } from "template-file";

interface IConfig {
  jsonUrl: string;
  jsonFile: string;
  txtFile: string;
  templateFile: string;
  cssFileName: string;
}

interface IWord {
  word: string;
  text: string;
}

class TxtGenerator {
  private config: IConfig;
  private count: number = 0;
  constructor(config: IConfig) {
    this.config = config;
  }

  private async _downloadJsonFile(): Promise<void> {
    fs.writeFileSync(this.config.jsonFile, await download(this.config.jsonUrl));
  }

  private _rmRedundanceDtTag(word: IWord): string {
    let result = word.text;

    //
    const pattern = /<dt>.*?<\/dt>/g;
    let matchesArray = result.match(pattern);
    if (matchesArray?.length === 1) {
       const aliasRegexp = />([^<>]+)</g;
       let alias = [...matchesArray[0].matchAll(aliasRegexp)].map(
         (item) => item[1]
      );
      if (alias[0].toLowerCase() === word.word.toLowerCase()) {
        // console.log(`${word.word} \| ${alias[0]}`);
        result = result.replace(pattern, "");
        this.count += 1;
      }
    }

    return result;
  }

  private _extractEtymologyHtml(word: IWord): string {
    const pattern = /(?<etymology><p class='eti'>.*?<\/p>)/g
    let matchesArray = [...word.text.matchAll(pattern)]
    if (matchesArray) {
      console.info(`word: ${word.word}, etymology:${matchesArray}`);
    } else {
      console.log('empty')
    }
    return ''
  }

  private _generateWordHtml(word: IWord): string {
    const data = {
      word: word.word,
      textHtml: this._rmRedundanceDtTag(word),
      cssFileName: this.config.cssFileName,
      etymologyHtml: this._extractEtymologyHtml(word)
    };
    const templateString = fs.readFileSync(this.config.templateFile, "utf8");
    return render(templateString, data);
  }

  private _generateTxtFile() {
    let resultString: string = "";
    const data = fs.readFileSync(this.config.jsonFile);
    let jsonData = JSON.parse(data.toString());
    for (let word of jsonData) {
      word = <IWord>word;
      resultString += this._generateWordHtml(word);
    }

    console.log(`count: ${this.count}`)
    // Replace LF with CRLF
    // resultString = resultString.replace(/\n/g, "\r\n");
    fs.writeFileSync(this.config.txtFile, resultString, "utf-8");
  }

  async generate() {
    // await this._downloadJsonFile();
    this._generateTxtFile();
  }
}

export async function generateTxtFile(pull:boolean) {
  let config: IConfig = {
    jsonUrl:
      "https://raw.githubusercontent.com/suttacentral/sc-data/master/dictionaries/complex/en/pli2en_pts.json",
    jsonFile: `${__dirname}/pts.json`,
    txtFile: `${__dirname}/pts.txt`,
    templateFile: `${__dirname}/template.html`,
    cssFileName: "pts.css",
  };
  let generator = new TxtGenerator(config);
  generator.generate();
}
