import Owner from "../owner/Owner";
import fromUtf8ToBase64Url from "../../util/jwt/fromUtf8ToBase64Url";
import crypto, {Hmac} from "crypto";

const HASH_ALGO = 'sha256';

export default class Jwt {
    
    readonly #header: JwtHeader;
    readonly #payload : AllowedJwtPayloadType;
    readonly #rawToken : string;
    readonly #secEnc64Url : string
    
    constructor(header : JwtHeader, payload : AllowedJwtPayloadType, hashFn: () => string) {
        const header64
            = fromUtf8ToBase64Url(JSON.stringify(header));
        const s = JSON.stringify(payload);
        const payload64
            = fromUtf8ToBase64Url(s);
        const rawToken 
            = header64 + "." + payload64;
        
        const str = hashFn();
        const hashCode = J.generateHash(str);
        const hmac = J.generateHmac(hashCode);

        const secEnc = hmac.update(rawToken).digest('hex');
        const secEnc64Url = fromUtf8ToBase64Url(secEnc);
        
        this.#header = header;
        this.#payload = payload;
        this.#rawToken = rawToken;
        this.#secEnc64Url = secEnc64Url;
    }

    public toString() {
        return this.#rawToken + "." + this.#secEnc64Url;
    }
    
    private static generateHash(str : string) : string {
        return crypto
            .createHash(HASH_ALGO)
            .update(str)
            .digest('hex');
    }

    private static generateHmac(code: string) : Hmac {
        let subStr = code.substr(0, 32);
        return crypto.createHmac(HASH_ALGO, subStr);
    }
}

const J =Jwt;

export interface JwtHeader {
    alg: "HS256",
    typ: "JWT"
}

export type AllowedJwtPayloadType = Owner;