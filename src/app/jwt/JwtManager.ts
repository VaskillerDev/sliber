import SecurityConfig from "../../configs/SecurityConfig";
import Owner from "../owner/Owner";
import Jwt, {JwtHeader} from "./Jwt";
import crypto, {Cipher, Decipher} from "crypto";

const JWT_HEADER : JwtHeader = {
    alg: "HS256",
    typ: "JWT"
};

const HASH_ALGO = 'sha256';

export default class JwtManager {

    #securityConfig : SecurityConfig;
    
    constructor(args: JwtManagerArgs) {
        const {securityConfig} = args;
        
        this.#securityConfig = securityConfig;
    }
    
    public createJwtFromOwner(owner : Owner) : Jwt {
        return new Jwt(JWT_HEADER, owner, () => {
            return owner.getName() + owner.getOwnerId();
        });
    }

    private generateCipher(code: string) : Cipher {
        const algo = this.#securityConfig.algorithm;
        const initVec = this.#securityConfig.initVector;
        
        const key = JM.generateHash(code).substr(0, 32);
        const cipher = crypto.createCipheriv(algo, key, initVec);

        return cipher;
    }
    
    private generateDecipher(code: string) : Decipher {
        const algo = this.#securityConfig.algorithm;
        const initVec = this.#securityConfig.initVector;

        const key = JM.generateHash(code).substr(0, 32);
        const decipher = crypto.createDecipheriv(algo, key, initVec);

        return decipher;
    }
    
    private static generateHash(str : string) : string {
        return crypto
            .createHash(HASH_ALGO)
            .update(str)
            .digest('hex');
    }
    
}

const JM = JwtManager;

export interface JwtManagerArgs {
    securityConfig: SecurityConfig
}