import IAppConfig from "./IAppConfig";

export default class SecurityConfig {
    readonly #vec: string;
    readonly #algo: string = "aes-256-cbc";
    
    constructor(vec: string, algo: string) {
        this.#vec = vec;
        this.#algo = algo ?? this.#algo;
    }

    public static fromAppConfig(cfg: IAppConfig): SecurityConfig {
        const {security} = cfg;
        
        if (!security) throw new Error("security not found");
        if (!security.vec) throw new Error("security.vec not found");
        
        return new SecurityConfig(security.vec, security.algo);
    }
    
    public get initVector() {
        return this.#vec;
    }
    
    public get algorithm() {
        return this.#algo;
    }
}