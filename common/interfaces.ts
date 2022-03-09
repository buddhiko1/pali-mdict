export interface IDictConf {
  jsonUrl?: string;
  fullName: string;
  shortName: string;
  outputDir: string; 
}

export interface IFileName {
  entryTemplate: string;  // layout must compliance with the mdict standard
  json: string;           // name of dict's json file
  css: string;            // dict stylesheet
  txt: string;            // for building mdx with mdx-builder
  title: string;          // for building mdx with mdx-builder
  description: string;    // for building mdx with mdx-builder
  mdx: string;            // result mdict file
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

export interface IAbbr {
  abbr: string;
  text: string;
  type: string;
}

export type IEntry = IPts | INcped | IDppn | IAbbr;

export interface IJsonFileGenerator {
  generate(jsonFile: string): Promise<void>;
}
