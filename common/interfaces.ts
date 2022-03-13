import { IPts } from "../pts/interfaces";
import { IAbbr } from "../abbr/interfaces";
import { IDppn } from "../dppn/interfaces";
import { INcped } from "../ncped/interfaces";

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

export type IEntry = IPts | INcped | IDppn | IAbbr;

export interface IJsonFileGenerator {
  generate(jsonFile: string): Promise<void>;
}
