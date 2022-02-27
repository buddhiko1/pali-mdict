#!/usr/bin/env ts-node

import { Command } from "commander";

import { GeneratorFactory } from "./factory";
import { DictEnum } from "./config";

const program = new Command();

program
  .version("1.0.0")
  .name("ts-node")
  .usage("command [options]")

program
  .command("clean")
  .description("Remove unnecessary files in output")
  .action(() => {
    for (let dict of Object.values(DictEnum)) {
      let generator = GeneratorFactory.createGenerator(dict)
      generator.clean()
    }
  })

program
  .command("make")
  .description("Generate Mdict txt file")
  .requiredOption(
    "-d, --dict <dict>",
    `choose a dictionary from the options: ${Object.values(DictEnum)}`,
    DictEnum.PTS
  )
  .option("-p, --pull", "pull the latest raw data from SuttaCentral")
  .action((options) => {
    if (!Object.values(DictEnum).includes(options.dict)) {
      console.error("error: invalid dict value!");
      process.exit();
    }
    let generator = GeneratorFactory.createGenerator(options.dict);
    generator.generate(options.pull);
  })

program.parse();