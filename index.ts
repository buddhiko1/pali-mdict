import { Command } from "commander";

import { GeneratorFactory } from "./factory";
import { DictEnum } from "./config";

const program = new Command();

program
  .version("1.0.0")
  .name("ts-node")
  .usage("index.ts [options]")
  .requiredOption(
    "-d, --dict <dict>",
    `choose a dictionary from the options: ${Object.values(DictEnum)}`,
    DictEnum.PTS
  )
  .option("-p, --pull", "pull the latest raw data from SuttaCentral");

program.parse();
const options = program.opts();
if (!Object.values(DictEnum).includes(options.dict)) {
  console.error('error: invalid dict value!')
  process.exit()
}

let generator = GeneratorFactory.createGenerator(options.dict)
generator.generate(options.pull)