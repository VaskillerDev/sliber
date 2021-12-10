import {FastifyInstance} from "fastify";
import IRouteHandler from "../handlers/IRouteHandler";
import HostConfig from "../configs/HostConfig";
import GoogleAuth from "./oauth2/GoogleAuth";
import IAppConfig from "../configs/IAppConfig";
import GoogleOAuthConfig from "../configs/GoogleOAuthConfig";

/** A class describing all interaction with the application */
export default class App {
    readonly #server : FastifyInstance;
    readonly #handlerMap : IHandlerMap = new Map<string, IRouteHandler>();
    
    #hostCfg? : HostConfig;
    
    constructor(server: FastifyInstance) {
        this.#server = server;
    }

    public setHostConfig(config: IAppConfig) : void {
        if (!config.host) throw new Error('hostConfig not found');
        this.#hostCfg = HostConfig.fromAppConfig(config);
    }
    
    public setGoogleAuth(config: IAppConfig) {
        if (!this.#hostCfg) throw new Error('hostConfig not found');
        if (!config.googleOauth) throw new Error('googleOauth not found');

        const googleOauthConfig = GoogleOAuthConfig.fromAppConfig(config);
        const googleAuth = GoogleAuth.fromConfig(googleOauthConfig);
        GoogleAuth.register(this.#server, this.#hostCfg, googleAuth);
    }
    
    public setHandler(handler: IRouteHandler) : void {
        this.setHandlerWithSpecifyRoute(handler.route, handler);
    }
    
    public setHandlerWithSpecifyRoute(route: string, handler: IRouteHandler) : void {
        this.#handlerMap.set(route, handler);
        this.#server[handler.method](route, handler.fn);
    }
    
    public listen() : void {
        if (this.#hostCfg === undefined) {
            throw new Error("host config not specified");
        }
        
        const port = this.#hostCfg.port;
        this.#server.listen(port, this.listenCallback)
    }
    
    private listenCallback(err: Error|null, address: string) : void {
        if (err) {
            // todo: add logger
            this.#server.log.error(err)
            process.exit(1)
        }
    }
}

type IHandlerMap = Map<string, IRouteHandler>
