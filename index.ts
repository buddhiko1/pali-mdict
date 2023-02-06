import { Command, Option } from "commander";

import { MakerFactory } from "./factory";
import { DictEnum } from "./config";

const program = new Command();

program
  .version("1.0.0")
  .name("ts-node")
  .usage("index.ts [options]")
  .addOption(
    new Option("-t, --type <type>", "dictionary type").choices(
      Object.values(DictEnum)
    )
  )
  .option(
    "-d, --download",
    "download the latest json file from SuttaCentral repository"
  )
  .option("-e, --eudic", "for eudic")
  .action((options) => {
    if (!Object.values(DictEnum).includes(options.type)) {
      console.error("error: invalid options!");
      process.exit();
    }
    const forEudic = options.eudic ?? false;
    const maker = MakerFactory.create(options.type);
    maker.make(options.download, forEudic);
  });

program.parse(process.argv);
