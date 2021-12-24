export default interface IStorage {
    pull(key : string) : Promise<any>;
    push(key: string, value: string | object) : Promise<void>;
}