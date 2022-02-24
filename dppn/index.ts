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

  private async downloadJsonFile(): Promise<void> {
    fs.writeFileSync(this.config.jsonFile, await download(this.config.jsonUrl));
  }

  private generateNameHtml(name: IName): string {
    const data = {
      word: name.word,
      textHtml: name.text,
      cssFileName: this.config.cssFileName
    };
    const templateString = fs.readFileSync(this.config.templateFile, "utf8");
    return render(templateString, data);
  }

  private generateTxtFile() {
    let resultString: string = "";
    const data = fs.readFileSync(this.config.jsonFile);
    let jsonData = JSON.parse(data.toString());
    for (let name of jsonData) {
      name = <IName>name;
      resultString += this.generateNameHtml(name);
    }
    // Replace LF with CRLF
    // resultString = resultString.replace(/\n/g, "\r\n");
    fs.writeFileSync(this.config.txtFile, resultString, "utf-8");
  }

  async generate() {
    await this.downloadJsonFile();
    this.generateTxtFile();
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
