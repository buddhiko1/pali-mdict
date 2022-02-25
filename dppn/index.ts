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

interface IName {
  word: string;
  text: string;
}

class TxtGenerator {
  private config: IConfig;
  constructor(config: IConfig) {
    this.config = config;
  }

  private async _downloadJsonFile(): Promise<void> {
    fs.writeFileSync(this.config.jsonFile, await download(this.config.jsonUrl));
  }

  private _getType(text: string): string {
    let regex = /^<dl class='(?<typeName>[a-z]*)'>?/;
    let result = text.match(regex);
    if (result?.groups) {
      return result.groups.typeName
    }
    throw Error("name's type is not exist!");
  }

  private _rmRedundanceDtFlag(name: IName): string {
    let result = name.text

    //
    const pattern = /<dt>.*?<\/dt>/g;
    let matchesArray = result.match(pattern);
    if (matchesArray?.length === 1) {
      result = result.replace(pattern, "");
    }

    // 
    if (matchesArray?.length === 2) {
      let matchesArrayStr = matchesArray.toString();
      if (!matchesArrayStr.includes("<sup>")) {
        const aliasRegexp = />([^<>,]+)</g
        let alias = [...matchesArrayStr.matchAll(aliasRegexp)].map(item => item[1])
        if (alias[0] === alias[1]) {
          result = result.replace(matchesArray[0], "");
          result = result.replace(matchesArray[1], "");
        }
      }
    }

    return result;
  }

  private _generateNameHtml(name: IName): string {


    const data = {
      word: name.word,
      type: this._getType(name.text),
      textHtml: this._rmRedundanceDtFlag(name),
      cssFileName: this.config.cssFileName,
    };
    const templateString = fs.readFileSync(this.config.templateFile, "utf8");
    return render(templateString, data);
  }

  private _generateTxtFile() {
    let resultString: string = "";
    const data = fs.readFileSync(this.config.jsonFile);
    let jsonData = JSON.parse(data.toString());
    for (let name of jsonData) {
      name = <IName>name;
      resultString += this._generateNameHtml(name);
    }
    // Replace LF with CRLF
    // resultString = resultString.replace(/\n/g, "\r\n");
    fs.writeFileSync(this.config.txtFile, resultString, "utf-8");
  }

  async generate() {
    // await this._downloadJsonFile();
    this._generateTxtFile();
  }
}

export async function generateTxtFile() {
  let config: IConfig = {
    jsonUrl:
      "https://raw.githubusercontent.com/suttacentral/sc-data/master/dictionaries/complex/en/pli2en_dppn.json",
    jsonFile: `${__dirname}/dppn.json`,
    txtFile: `${__dirname}/dppn.txt`,
    templateFile: `${__dirname}/template.html`,
    cssFileName: "dppn.css",
  };
  let generator = new TxtGenerator(config);
  generator.generate();
}
