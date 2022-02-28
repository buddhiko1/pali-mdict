export interface IMakerConf {
  dictConf: IDictConf; // For downloading raw file.
  rawFile: string; // For generating txt file.
  txtFile: string; // For building mdx with mdx-builder.
  entryHtmlFile: string; 
  cssFileName: string; // Dict stylesheet.
}

export interface IDictConf {
  rawUrl: string; // for downloading raw file.
  fullName: string; // full name of dictionary.
  shortName: string; // short name of dictionary.
  outputDir: string;
  entryFileName: string; // layout must compliance with the mdict standard.
  cssFileName: string; // dict stylesheet.
  txtFileName: string; // for building mdx with mdx-builder.
  titleFileName: string; // for building mdx with mdx-builder.
  descriptionFileName: string; // for building mdx with mdx-builder.
  mdxFileName: string; // result mdict file
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
