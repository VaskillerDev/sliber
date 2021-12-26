import Owner from "../../app/owner/Owner";
import IKeyValueStorage from "../IKeyValueStorage";

export default function pushOwner(s: IKeyValueStorage, owner: Owner) : Promise<void> {
    const name = owner.getName();
    const ownerId = owner.getOwnerId();
    
    const dto = JSON.stringify({
        name,
        ownerId
    }) ;
    
    return s.push(ownerId, dto);
}