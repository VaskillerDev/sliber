import IAppConfig from "./IAppConfig";

export default class HostConfig {
    
    readonly #port: number = 7070;
    readonly #scheme: string = 'http';
    readonly #address: string = "127.0.0.1";
    readonly #secure: boolean = false;
    
    constructor(port: number, address?: string) {
        this.#port = port;
        this.#address = address ?? this.#address;
    }
    
    public static fromAppConfig(cfg: IAppConfig): HostConfig {
        const {host} = cfg;
        return new HostConfig(host.port, host.address);
    }
    
    public toString() {
        return `${this.#scheme}://${this.#address}:${this.#port}`
    }

    public get port() : number {
        return this.#port
    }
    
    public get scheme() : string {
        return this.#scheme
    }

    public get address() : string {
        return this.#address
    }

    public get secure() : boolean {
        return this.#secure
    }
}