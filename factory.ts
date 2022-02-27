import { Generator as NcpedGenerator } from "./ncped";
import { Generator as DppnGenerator } from "./dppn";
import { Generator as PtsGenerator } from "./pts";
import { BaseGenerator } from "./common/classes";

import { DictEnum, OUTPUT, URL } from "./config";

export class GeneratorFactory {
  static createGenerator(dict: DictEnum): BaseGenerator {
    switch (dict) {
      case DictEnum.PTS:
        return new PtsGenerator(URL.ncped, OUTPUT);
      case DictEnum.NCPED:
        return new NcpedGenerator(URL.ncped, OUTPUT);
      case DictEnum.DPPN:
        return new DppnGenerator(URL.dppn, OUTPUT);
    }
    return <never>dict;
  }
}
