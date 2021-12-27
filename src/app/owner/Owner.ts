export default class Owner {
    
    private readonly ownerId : string;
    private readonly name : string;
    
    constructor(ownerId: string, name : string) {
        this.ownerId = ownerId;
        this.name = name;
    }
    
    public getOwnerId() : string {
        return this.ownerId;
    }
    
    public getName() : string {
        return this.name;
    }
}