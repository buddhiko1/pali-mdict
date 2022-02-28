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
  .option("-e, --eudic", "for eudic")
  .action((options) => {
    if (!Object.values(DictEnum).includes(options.dict)) {
      console.error("error: invalid options!");
      process.exit();
    }
    const forEudic = options.eudic ?? false
    let maker = MakerFactory.create(options.dict);
    maker.make(options.pull, forEudic);
  });

program.parse(process.argv);