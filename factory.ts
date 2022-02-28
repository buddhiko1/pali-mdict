import { Maker as NcpedMaker } from "./ncped";
import { Maker as DppnMaker } from "./dppn";
import { Maker as PtsMaker } from "./pts";
import { BaseMaker } from "./common/classes";
import { DictEnum, DICTIONARY } from "./config";

export class MakerFactory {
  static create(dict: DictEnum): BaseMaker {
    switch (dict) {
      case DictEnum.PTS:
        return new PtsMaker(DICTIONARY[dict]);
      case DictEnum.NCPED:
        return new NcpedMaker(DICTIONARY[dict]);
      case DictEnum.DPPN:
        return new DppnMaker(DICTIONARY[dict]);
    }
    return <never>dict;
  }
}
