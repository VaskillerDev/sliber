import ILoader from "./ILoader";
import {PathLike} from "fs";
import JsonLoader from "./JsonLoader";
import IAppConfig from "../configs/IAppConfig";

export default class ConfigLoader 
    implements ILoader<any> {
    public async fromFile(path: PathLike): Promise<IAppConfig> {
        const loader = new JsonLoader();
        return loader.fromFile(path);
    }

    fromFileSync(path: PathLike): IAppConfig {
        const loader = new JsonLoader();
        return loader.fromFileSync(path);
    }
}