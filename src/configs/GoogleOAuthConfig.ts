import IAppConfig from "./IAppConfig";
import JsonLoader from "../util/JsonLoader";

export default class GoogleOAuthConfig {
    readonly #path: string;
    readonly #callbackUri: string;
    readonly #startRedirectPath: string;
    
    constructor(path: string, callbackUri : string, startRedirectPath: string ) {
        this.#path = path;
        this.#callbackUri = callbackUri;
        this.#startRedirectPath = startRedirectPath;
    }

    public static fromAppConfig(cfg: IAppConfig): GoogleOAuthConfig {
        const {googleOauth} = cfg;
        if (!googleOauth) throw 'googleOauth config not found';
        const {path, callbackUri, startRedirectPath} = googleOauth;
        return new GoogleOAuthConfig(path, callbackUri, startRedirectPath);
    }
    
    public json() {
        return new JsonLoader().fromFileSync(this.#path);
    }
    
    public get callbackUri() {
        return this.#callbackUri;
    }
    
    public get startRedirectPath() {
        return this.#startRedirectPath;
    }
}