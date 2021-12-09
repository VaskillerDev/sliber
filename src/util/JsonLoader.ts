import fs, {PathLike} from 'fs'

export default class JsonLoader {
    public static async fromFile(path: PathLike) : Promise<any> {
        let buf = await fs.promises.readFile(path);
        let str = buf.toString('utf-8');
        return JSON.parse(str);
    }

    public static fromFileSync(path: PathLike) : any {
        let buf = fs.readFileSync(path);
        let str = buf.toString('utf-8');
        return JSON.parse(str);
    }
}