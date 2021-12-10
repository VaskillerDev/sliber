import fs, {PathLike} from 'fs'
import ILoader from "./ILoader";

export default class JsonLoader 
    implements ILoader<any> {
    
    public async fromFile(path: PathLike) : Promise<any> {
        let buf = await fs.promises.readFile(path);
        let str = buf.toString('utf-8');
        return JSON.parse(str);
    }

    public fromFileSync(path: PathLike) : any {
        let buf = fs.readFileSync(path);
        return JSON.parse(buf.toString('utf-8'));
    }
}