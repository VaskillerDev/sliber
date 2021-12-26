export default interface IKeyValueStorage {
    pull(key : string) : Promise<any>;
    push(key: string, value: string | object) : Promise<void>;
}