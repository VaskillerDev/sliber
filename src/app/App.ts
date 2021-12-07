import {FastifyInstance} from "fastify";
import IRouteHandler from "../handlers/IRouteHandler";
import HostConfig from "../configs/HostConfig";

/** A class describing all interaction with the application */
export default class App {
    readonly #server : FastifyInstance;
    readonly #handlerMap : IHandlerMap = new Map<string, IRouteHandler>();
    
    #hostCfg? : HostConfig;
    
    constructor(server: FastifyInstance) {
        this.#server = server;
    }
    
    public setHostConfig(cfg: HostConfig) : void {
        this.#hostCfg = cfg;
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
            this.#server.log.error(err)
            process.exit(1)
        }
    }
}

type IHandlerMap = Map<string, IRouteHandler>
