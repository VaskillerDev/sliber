import Owner from "./Owner";
import {randomUUID} from "crypto";


export default class OwnerManager {
    #ownerMap : Map<string, Owner>;
    
    constructor() {
        this.#ownerMap = new Map<string, Owner>();
    }
    
    public createEmptyOwner() : Owner {
        
        const uuid = randomUUID()
        return new Owner(uuid);
    }
}