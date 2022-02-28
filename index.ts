#!/usr/bin/env ts-node

import { Command } from "commander";

import { MakerFactory } from "./factory";
import { DictEnum } from "./config";

const program = new Command();

program
  .version("1.0.0")
  .name("ts-node")
  .usage("index.ts command [options]")

program
  .command("clean")
  .description("Remove unnecessary files")
  .action(() => {
    for (let dict of Object.values(DictEnum)) {
      let maker = MakerFactory.create(dict)
      maker.clean()
    }
  })

program
  .command("make")
  .description("Make Mdict")
  .requiredOption(
    "-d, --dict <dict>",
    `choose a dictionary: ${Object.values(DictEnum)}`,
    DictEnum.PTS
  )
  .option("-p, --pull", "pull the latest raw file from SuttaCentral")
  .action((options) => {
    if (!Object.values(DictEnum).includes(options.dict)) {
      console.error("error: invalid dict!");
      process.exit();
    }
    let maker = MakerFactory.create(options.dict);
    maker.make(options.pull);
  })

program.parse(process.argv);