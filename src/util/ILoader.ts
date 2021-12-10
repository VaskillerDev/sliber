import {PathLike} from "fs";

export default interface ILoader<ReturnType> {
    fromFile(path: PathLike) : Promise<ReturnType>;
    fromFileSync(path: PathLike) : ReturnType
}