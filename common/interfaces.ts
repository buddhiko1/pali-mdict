export interface IDictConf {
  rawUrl: string; // for downloading raw file
  fullName: string; // full name of dictionary
  shortName: string; // short name of dictionary
  outputDir: string; 
  moduleDir: string;
}

export interface IFileNameMap {
  entryTemplate: string; // layout must compliance with the mdict standard
  raw: string; // file name of raw dict data
  css: string; // dict stylesheet
  txt: string; // for building mdx with mdx-builder
  title: string; // for building mdx with mdx-builder
  description: string; // for building mdx with mdx-builder
  mdx: string; // result mdict file
}

export interface IPts {
  word: string;
  text: string;
}

export interface INcped {
  entry: string;
  grammar?: string;
  definition?: string | string[];
  xr?: string | string[]; // cross references
}

export interface IDppn {
  word: string;
  text: string;
}

export type Entry = IPts | INcped | IDppn;
