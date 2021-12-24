import Owner from "../../app/owner/Owner";
import IStorage from "../IStorage";

export default function pushOwner(s: IStorage, owner: Owner) : Promise<void> {
    const name = owner.getName();
    const ownerId = owner.getOwnerId();
    
    const dto = JSON.stringify({
        name,
        ownerId
    }) ;
    
    return s.push(ownerId, dto);
}