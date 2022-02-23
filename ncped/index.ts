import fs from "fs";
import download from "download";

interface IConfig {
  jsonUrl: string;
  jsonFile: string;
  txtFile: string;
  cssFile: string;
}

interface IWord {
  entry: string;
  grammar?: string;
  definition?: string | string[];
  xr?: string | string[];
}

class Ncpde {
  private config: IConfig;

  constructor(config: IConfig) {
    this.config = config;
  }

  private async downloadJsonFile(): Promise<void> {
    fs.writeFileSync(this.config.jsonFile, await download(this.config.jsonUrl));
  }

  private generateWordHtml(word: IWord): string {
    //
    let definitionItemHtml: string = "";
    if (word.definition) {
      if (typeof word.definition === "string") {
        definitionItemHtml = `
  <li>${word.definition}</li>`;
      } else {
        for (let item of word.definition) {
          definitionItemHtml += `
  <li>${item}</li>`;
        }
      }
    }
    if (definitionItemHtml) {
      definitionItemHtml = `<ul class="definition">${definitionItemHtml}
</ul>`;
    }

    //
    let crossRefHtml: string = "";
    if (word?.xr) {
      if (typeof word.xr === "string") {
        crossRefHtml = `
  <li>
    <a href="entry://${word.xr}">${word.xr}</a>
  </li>`;
      } else {
        for (let item of word.xr) {
          crossRefHtml += `
  <li>
    <a href="entry://${item}">${item}</a>
  </li>`;
        }
      }
    }
    if (crossRefHtml) {
      crossRefHtml = `<ul class="crossRef">${crossRefHtml}
</ul>`;
    }

    return `
${word.entry}
<link rel="stylesheet" type="text/css" href="${this.config.cssFile}" />
<div class="title">
  <span class="entry">${word.entry}</span>
  <span class="grammar">( ${word.grammar ?? ""} )</span>
</div>
${definitionItemHtml}
${crossRefHtml}
</>`;
  }

  private generateTxtFile() {
    let resultString: string = "";
    const data = fs.readFileSync(this.config.jsonFile);
    let jsonData = JSON.parse(data.toString());
    for (let word of jsonData) {
      word = <IWord>word;
      resultString += this.generateWordHtml(word);
    }
    resultString = resultString.trimStart().replace(/\n/g, "\r\n");
    fs.writeFileSync(this.config.txtFile, resultString, "utf-8");
  }

  async generate() {
    await this.downloadJsonFile();
    this.generateTxtFile();
  }
}

export async function generateMdx() {
  let config: IConfig = {
    jsonUrl:
      "https://raw.githubusercontent.com/suttacentral/sc-data/master/dictionaries/simple/en/pli2en_ncped.json",
    jsonFile: `${__dirname}/ncpde.json`,
    txtFile: `${__dirname}/ncpde.txt`,
    cssFile: "ncpde.css",
  };
  let ncpde = new Ncpde(config);
  ncpde.generate();
}
