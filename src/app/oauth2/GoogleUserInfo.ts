import IRawGoogleUserInfo from "../../handlers/oauth2/IRawGoogleUserInfo";

export default class GoogleUserInfo {
    public id: string;
    public email: string;
    public verifiedEmail: string;
    public picture: string;
    
    private constructor(raw : IRawGoogleUserInfo) {
        this.id = raw.id;
        this.email = raw.email;
        this.verifiedEmail = raw.verified_email;
        this.picture = raw.picture;
    }
    
    public static fromRaw(raw : IRawGoogleUserInfo) : GoogleUserInfo {
        return new GoogleUserInfo(raw);
    }
}