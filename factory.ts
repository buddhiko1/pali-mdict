import { Maker as NcpedMaker } from "./ncped";
import { Maker as DppnMaker } from "./dppn";
import { Maker as PtsMaker } from "./pts";
import { Maker as AbbrMaker } from "./abbr";
import { MakerBase } from "./common/classes";
import { DictEnum, DICTIONARY } from "./config";

export class MakerFactory {
  static create(dict: DictEnum): MakerBase {
    switch (dict) {
      case DictEnum.PTS:
        return new PtsMaker(DICTIONARY[dict]);
      case DictEnum.NCPED:
        return new NcpedMaker(DICTIONARY[dict]);
      case DictEnum.DPPN:
        return new DppnMaker(DICTIONARY[dict]);
      case DictEnum.ABBR:
        return new AbbrMaker(DICTIONARY[dict]);
    }
    return <never>dict;
  }
}
