import {FastifyInstance} from "fastify";
import IRouteHandler from "../handlers/IRouteHandler";
import GoogleAuth from "./oauth2/GoogleAuth";
import IAppConfig from "../configs/IAppConfig";
import GoogleOAuthConfig from "../configs/GoogleOAuthConfig";
import OwnerManager from "./owner/OwnerManager";
import IKeyValueStorage from "../storage/IKeyValueStorage";
import KeyValueStorage from "../storage/KeyValueStorage";

import HostConfig from "../configs/HostConfig";
import SecurityConfig from "../configs/SecurityConfig";
import JwtManager from "./jwt/JwtManager";

/** A class describing all interaction with the application */
export default class App {
    private static instance?: App = undefined;
    
    readonly #server : FastifyInstance;
    readonly #handlerMap : IHandlerMap = new Map<string, IRouteHandler>();
    
    #hostCfg? : HostConfig;
    #securityCfg? : SecurityConfig
    
    #googleAuth? : GoogleAuth;
    #storage : IKeyValueStorage = new KeyValueStorage();
    
    #ownerManager: OwnerManager;
    #jwtManager?: JwtManager;
    
    private constructor(server: FastifyInstance) {
        this.#server = server;
        this.#ownerManager = new OwnerManager({ 
            storage: this.#storage
        });
    }
    
    public initOwnerManager() {
        this.#ownerManager = new OwnerManager({
            storage: this.#storage
        });
    }
    
    public initJwtManager() {
        if (!this.#securityCfg) 
            throw new Error("securityCfg not found");
        
        this.#jwtManager = new JwtManager({
            securityConfig: this.#securityCfg
        })
    }
    
    public getOwnerManager() : OwnerManager {
        return this.#ownerManager
    }
    
    public static getInstance(server?: FastifyInstance) : App {
        if (!App.instance) {
            if (!server) throw new Error('App.instance not found and server param not specified');
            App.instance = new App(server);
        }
        return App.instance;
    }
    
    public setHostConfig(config: IAppConfig) : void {
        if (!config.host) throw new Error('hostConfig not found');
        this.#hostCfg = HostConfig.fromAppConfig(config);
    }
    
    public setSecurityConfig(config: IAppConfig) : void {
        if (!config.security) throw new Error('securityConfig not found');
        this.#securityCfg = SecurityConfig.fromAppConfig(config);
    }
    
    public setGoogleAuth(config: IAppConfig) {
        if (!this.#hostCfg) throw new Error('hostConfig not found');
        if (!config.googleOauth) throw new Error('googleOauth not found');

        const googleOauthConfig = GoogleOAuthConfig.fromAppConfig(config);
        this.#googleAuth = GoogleAuth.fromConfig(googleOauthConfig);
        this.registerGoogleAuthHandlers();
        
        GoogleAuth.register(this.#server, this.#hostCfg, this.#googleAuth);
    }
    
    private registerGoogleAuthHandlers() {
        if (!this.#googleAuth) return;

        // регистрация owner'а по userInfo
        this.#googleAuth
            .emitter
            .onUserInfoReceived(async info => {
                let owner = await this.#ownerManager.getOrCreateOwnerFromGoogleUserInfo(info);
                
                
                let jwt = this.#jwtManager?.createJwtFromOwner(owner);
                let a = 2+2;
            });
    }
    
    public getGoogleAuth() : GoogleAuth {
        if (this.#googleAuth === undefined) throw new Error('googleAuth is undefined');
        return this.#googleAuth;
    }

    public setStorage(storage : IKeyValueStorage) {
        this.#storage = storage;
    }
    
    public getStorage() : IKeyValueStorage {
        if (this.#storage === undefined) throw new Error('storage is undefined');
        return this.#storage;
    }
    
    public setHandler(handler: IRouteHandler) : void {
        if (handler.schema) {
            this.setHandlerWithSpecifyRouteAndSchema(handler.route, handler.schema, handler);
            return;
        }
        
        this.setHandlerWithSpecifyRoute(handler.route, handler);
    }
    
    public setHandlerWithSpecifyRoute(route: string, handler: IRouteHandler) : void {
        this.#handlerMap.set(route, handler);
        this.#server[handler.method](route, handler.fn);
    }

    public setHandlerWithSpecifyRouteAndSchema(route: string, schema: object, handler: IRouteHandler) : void {
        this.#handlerMap.set(route, handler);
        this.#server[handler.method](route, {schema}, handler.fn);
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
