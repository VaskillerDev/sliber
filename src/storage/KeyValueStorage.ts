import IKeyValueStorage from "./IKeyValueStorage";
import SqliteKeyValueStorage from "./impl/sqlite/SqliteKeyValueStorage";

export default class KeyValueStorage implements IKeyValueStorage {
    readonly #storage : IKeyValueStorage;
    
    constructor() {
        this.#storage = new SqliteKeyValueStorage();
    }
    
    public async pull(key: string) {
        let result = await this.#storage.pull(key);
        return result?.['value'];
    }

    public async push(key: string, value: string | object) {
        await this.#storage.push(key, value);
        return Promise.resolve();
    }
}