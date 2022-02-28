import { Command, Option } from "commander";

import { MakerFactory } from "./factory";
import { DictEnum } from "./config";

const program = new Command();

program
  .version("1.0.0")
  .name("ts-node")
  .usage("index.ts [options]")
  .addOption(
    new Option("-d, --dict <dict>", "dictionary").choices(
      Object.values(DictEnum)
    )
  )
  .option("-p, --pull", "pull the latest raw file from SuttaCentral")
  .action((options) => {
    if (!Object.values(DictEnum).includes(options.dict)) {
      console.error("error: invalid options!");
      process.exit();
    }
    let maker = MakerFactory.create(options.dict);
    maker.make(options.pull);
  });

program.parse(process.argv);