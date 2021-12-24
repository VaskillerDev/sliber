import Owner from "./Owner";
import {randomUUID} from "crypto";
import GoogleUserInfo from "../oauth2/GoogleUserInfo";
import IStorage from "../../storage/IStorage";
import pushOwner from "../../storage/commands/pushOwner";

export default class OwnerManager {
    
    #storage: IStorage;
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

        {
            const maybeOwner = await this.#storage.pull(id);

            if (maybeOwner) {
                let ownerObj = JSON.parse(maybeOwner)
                return new Owner(ownerObj['ownerId'], ownerObj['name']); // todo:???????
            }
        }

        const owner = this.createFromGoogleUserInfo(data);
        await pushOwner(this.#storage, owner);
        const maybeOwner = await this.#storage.pull(id);
        if (!maybeOwner) 
            throw new Error('getOrCreateOwnerFromGoogleUserInfo error: storage pull');
        
        return maybeOwner;
    }
}

export interface OwnerManagerArgs {
    storage: IStorage
}