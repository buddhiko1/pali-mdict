export interface IConfig {
  rawUrl: string; // For downloading raw file.
  rawFile: string; // For generating txt file.
  txtFile: string; // For building mdx with mdx-builder.
  entryHtmlFile: string; // Layout must compliance with the mdict standard.
  cssFileName: string; // Dict stylesheet.
}

export interface IDppn {
  word: string;
  text: string;
}

export interface INcped {
  entry: string;
  grammar?: string;
  definition?: string | string[];
  xr?: string | string[]; // cross references
}