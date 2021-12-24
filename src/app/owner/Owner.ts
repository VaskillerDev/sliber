export default class Owner {
    
    readonly #ownerId : string;
    readonly #name : string;
    
    constructor(ownerId: string, name : string) {
        this.#ownerId = ownerId;
        this.#name = name;
    }
    
    public getOwnerId() : string {
        return this.#ownerId;
    }
    
    public getName() : string {
        return this.#name;
    }
}