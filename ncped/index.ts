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
  entry: string;
  grammar?: string;
  definition?: string | string[];
  xr?: string | string[]; // cross references
}

class TxtGenerator {
  private config: IConfig;

  constructor(config: IConfig) {
    this.config = config;
  }

  private async downloadJsonFile(): Promise<void> {
    fs.writeFileSync(this.config.jsonFile, await download(this.config.jsonUrl));
  }

  private generateWordHtml(word: IWord): string {
    //
    let grammarHtml: string = "";
    if (word.grammar) {
      grammarHtml = `<span class="grammar">( ${word.grammar} )</span>`;
    }

    //
    let definitionListHtml: string = "";
    if (word.definition) {
      if (typeof word.definition === "string") {
        definitionListHtml = `\n  <li>${word.definition}</li>`;
      } else {
        for (let item of word.definition) {
          definitionListHtml += `\n  <li>${item}</li>`;
        }
      }
    }
    if (definitionListHtml) {
      definitionListHtml = `<ul class="definition">${definitionListHtml}\n</ul>`;
    }

    //
    let xfListHtml: string = "";
    if (word?.xr) {
      if (typeof word.xr === "string") {
        xfListHtml = `\n  <li><a href="entry://${word.xr}">${word.xr}</a></li>`;
      } else {
        for (let item of word.xr) {
          xfListHtml += `\n  <li><a href="entry://${item}">${item}</a></li>`;
        }
      }
    }
    if (xfListHtml) {
      xfListHtml = `<ul class="crossRef">${xfListHtml}\n</ul>`;
    }

    const data = {
      entry: word.entry,
      grammarHtml: grammarHtml,
      cssFileName: this.config.cssFileName,
      definitionListHtml: definitionListHtml,
      xfListHtml: xfListHtml,
    };
    const templateString = fs.readFileSync(this.config.templateFile, "utf8");
    return render(templateString, data);
  }

  private generateTxtFile() {
    let resultString: string = "";
    const data = fs.readFileSync(this.config.jsonFile);
    let jsonData = JSON.parse(data.toString());
    for (let word of jsonData) {
      word = <IWord>word;
      resultString += this.generateWordHtml(word);
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
      "https://raw.githubusercontent.com/suttacentral/sc-data/master/dictionaries/simple/en/pli2en_ncped.json",
    jsonFile: `${__dirname}/ncpde.json`,
    txtFile: `${__dirname}/ncpde.txt`,
    templateFile: `${__dirname}/template.html`,
    cssFileName: "ncpde.css",
  };
  let generator = new TxtGenerator(config);
  generator.generate();
}
