// import { generateTxtFile as generateNcpedTxtFile } from "./ncped"; 
import { Generator as DppnGenerator } from "./dppn"; 
// import { generateTxtFile as generatePtsTxtFile } from "./pts"; 
import { Command, Option } from "commander";

import { URL } from "./config";

// const program = new Command();

enum DictEnum {
  PTS = "pts",
  DPPN = "dppn",
  NCPED = "ncped",
}

enum PullEnum {
  YES = "y",
  NO = "n"
}

// program
//   .version("1.0.0")
//   .name("Mdx-txt Generator")
//   .usage("[global options] command")
//   .addOption(
//     new Option("-d, --dict <dict>", "dictionary").choices([
//       DictEnum.PTS,
//       DictEnum.NCPED,
//       DictEnum.DPPN,
//     ])
//   )
//   .addOption(
//     new Option(
//       "-p, --pull <pull>",
//       "pull the latest source data of dict from SuttaCentral"
//     ).choices([PullEnum.YES, PullEnum.NO])
//   );

// program.parse();
// const options = program.opts();
// if (options.dict === DictEnum.PTS) {
//   generatePtsTxtFile(options.pull);
// } else if (options.dict === DictEnum.NCPED) {
//   generateNcpedTxtFile(options.pull);
// } else if (options.dict === DictEnum.DPPN) {
//   let generator = new DppnMdxTxtGenerator(URL.dppn, __dirname);
//   let downloadLastSourceData = options.pull === PullEnum.YES ? true : false
//   generator.generate(downloadLastSourceData)
// }

let outDir = `${__dirname}/output`
let generator = new DppnGenerator(URL.dppn, outDir);
let pull = false
generator.generate(pull)
