import { IDictConf, IFileName } from "./public/interfaces";

export enum DictEnum {
  PTS = "pts",
  DPPN = "dppn",
  NCPED = "ncped",
  ABBR = "abbr",
}

type dictionary = Record<DictEnum, IDictConf>;

export const ASSETS_DIR = `${__dirname}/assets`;

export const FILENAME: IFileName = {
  entryTemplate: "entry.html",
  json: "dict.json",
  css: "dict.css",
  txt: "dict.txt",
  title: "title.html",
  description: "description.html",
  mdx: "dict.mdx",
};

export const DICTIONARY: dictionary = {
  [DictEnum.PTS]: {
    jsonUrl:
      "https://raw.githubusercontent.com/suttacentral/sc-data/master/dictionaries/complex/en/pli2en_pts.json",
    fullName: "Pali Text Society Pali-English Dictionary",
    shortName: DictEnum.PTS,
    outputDir: `${ASSETS_DIR}/${DictEnum.PTS}`,
  },
  [DictEnum.DPPN]: {
    jsonUrl:
      "https://raw.githubusercontent.com/suttacentral/sc-data/master/dictionaries/complex/en/pli2en_dppn.json",
    fullName: "Dictionary of Pali Proper Names",
    shortName: DictEnum.DPPN,
    outputDir: `${ASSETS_DIR}/${DictEnum.DPPN}`,
  },
  [DictEnum.NCPED]: {
    jsonUrl:
      "https://raw.githubusercontent.com/suttacentral/sc-data/master/dictionaries/simple/en/pli2en_ncped.json",
    fullName: "New Concise Pali-English Dictionary",
    shortName: DictEnum.NCPED,
    outputDir: `${ASSETS_DIR}/${DictEnum.NCPED}`,
  },
  [DictEnum.ABBR]: {
    fullName: "New Concise Pali-English Dictionary",
    shortName: DictEnum.ABBR,
    outputDir: `${ASSETS_DIR}/${DictEnum.ABBR}`,
  },
};
