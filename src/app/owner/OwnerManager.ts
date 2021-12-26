import Owner from "./Owner";
import {randomUUID} from "crypto";
import GoogleUserInfo from "../oauth2/GoogleUserInfo";
import IKeyValueStorage from "../../storage/IKeyValueStorage";
import pushOwner from "../../storage/commands/pushOwner";

export default class OwnerManager {
    
    #storage: IKeyValueStorage;
    #ownerMap : Map<string, Owner>;
    
    constructor(args: OwnerManagerArgs) {
        this.#storage = args.storage;
        this.#ownerMap = new Map<string, Owner>();
    }
    
    public createEmptyOwner() : Owner {
        
        const uuid = randomUUID()
        return new Owner(uuid, "empty");
    }
    
    public createFromGoogleUserInfo(data: GoogleUserInfo) : Owner {
        return new Owner(data.id, data.email);
    }
    
    public async getOrCreateOwnerFromGoogleUserInfo(data: GoogleUserInfo) : Promise<Owner> {
        const {id} = data;

        { // try get exist owner
            const maybeOwner = await this.#storage.pull(id);

            if (maybeOwner) {
                const {ownerId, name} = JSON.parse(maybeOwner);
                const owner = new Owner(ownerId, name);
                this.#ownerMap.set(ownerId,owner);
                return owner;
            }
        }
        { // create new owner and save to db
            const owner = this.createFromGoogleUserInfo(data);
            await pushOwner(this.#storage, owner);
        }
        // try get created owner
        const maybeOwnerJson = await this.#storage.pull(id);
        if (!maybeOwnerJson) 
            throw new Error('getOrCreateOwnerFromGoogleUserInfo error: storage pull');
        
        const {ownerId, name} = JSON.parse(maybeOwnerJson);
        const owner = new Owner(ownerId, name);
        this.#ownerMap.set(ownerId,owner);
        
        return owner;
    }
}

export interface OwnerManagerArgs {
    storage: IKeyValueStorage
}