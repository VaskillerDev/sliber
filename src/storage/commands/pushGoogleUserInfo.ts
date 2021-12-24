import GoogleUserInfo from "../../app/oauth2/GoogleUserInfo";
import IStorage from "../IStorage";

const pushGoogleUserInfo = (s: IStorage, data : GoogleUserInfo) : Promise<void> => {
    const {id} = data;
    return s.push(id, data)
}

export default pushGoogleUserInfo;