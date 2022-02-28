import { IDictConf, IFileNameMap } from "./common/interfaces";

export const FILENAME_MAP: IFileNameMap = {
  entryTemplate: 'entry.html',
  raw: "dict.json",
  css: "dict.css",
  txt: "dict.txt",
  title: "title.html",
  description: "description.html",
  mdx: "dict.mdx"
}

export enum DictEnum {
  PTS = "pts",
  DPPN = "dppn",
  NCPED = "ncped",
};

export const ASSETS_DIR = `${__dirname}/assets`;

type dictionary = Record<DictEnum, IDictConf>

export const DICTIONARY: dictionary = {
  [DictEnum.PTS]: {
    rawUrl:
      "https://raw.githubusercontent.com/suttacentral/sc-data/master/dictionaries/complex/en/pli2en_pts.json",
    fullName: "Pali Text Society Pali-English Dictionary",
    shortName: DictEnum.PTS,
    outputDir: `${ASSETS_DIR}/${DictEnum.PTS}`,
    moduleDir: `${__dirname}/${DictEnum.PTS}`,
  },
  [DictEnum.DPPN]: {
    rawUrl:
      "https://raw.githubusercontent.com/suttacentral/sc-data/master/dictionaries/complex/en/pli2en_dppn.json",
    fullName: "Dictionary of Pali Proper Names",
    shortName: DictEnum.DPPN,
    outputDir: `${ASSETS_DIR}/${DictEnum.DPPN}`,
    moduleDir: `${__dirname}/${DictEnum.DPPN}`,
  },
  [DictEnum.NCPED]: {
    rawUrl:
      "https://raw.githubusercontent.com/suttacentral/sc-data/master/dictionaries/simple/en/pli2en_ncped.json",
    fullName: "New Concise Pali-English Dictionary",
    shortName: DictEnum.NCPED,
    outputDir: `${ASSETS_DIR}/${DictEnum.NCPED}`,
    moduleDir: `${__dirname}/${DictEnum.NCPED}`,
  },
};

