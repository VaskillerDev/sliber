import GoogleUserInfo from "../../app/oauth2/GoogleUserInfo";
import IKeyValueStorage from "../IKeyValueStorage";

const pushGoogleUserInfo = (s: IKeyValueStorage, data : GoogleUserInfo) : Promise<void> => {
    const {id} = data;
    return s.push(id, data)
}

export default pushGoogleUserInfo;