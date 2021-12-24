import IStorage from "./IStorage";

export default class KVStorage implements IStorage {
    readonly #storage : Map<string, string | object>;
    
    constructor() {
        this.#storage = new Map();
    }
    
    public async pull(key: string) {
       return this.#storage.get(key)
    }

    public async push(key: string, value: string | object) {
        this.#storage.set(key, value);
        return Promise.resolve();
    }
}

interface IInternalStorage {
    [key : string] : string | object
}