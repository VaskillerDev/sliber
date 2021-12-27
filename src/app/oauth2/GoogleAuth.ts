import oauthPlugin, {OAuth2Namespace} from 'fastify-oauth2';
import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import GoogleOAuthConfig from "../../configs/GoogleOAuthConfig";
import HostConfig from "../../configs/HostConfig";
import GoogleOAuthCredentials from "./GoogleOAuthCredentials";
import IRawGoogleOAuthCredentials from "../../handlers/oauth2/IRawGoogleOAuthCredentials";
import axios, {AxiosRequestConfig} from "axios";
import IRawGoogleUserInfo from "../../handlers/oauth2/IRawGoogleUserInfo";
import GoogleUserInfo from "./GoogleUserInfo";
import GoogleAuthEventEmitter from "../../emmiters/ouath2/GoogleAuthEventEmitter";

const NAME = 'googleOAuth2';
const URL_USER_INFO = 'https://www.googleapis.com/oauth2/v2/userinfo';

const scopes = [
    'https://www.googleapis.com/auth/userinfo.email'
];

export default class GoogleAuth {
    
    readonly #config: GoogleOAuthConfig;
    readonly #credentials: GoogleOAuthCredentials;
    
    public emitter : GoogleAuthEventEmitter;
    
    constructor(config :GoogleOAuthConfig, cred: GoogleOAuthCredentials,) {
        this.emitter = new GoogleAuthEventEmitter();
        this.#config = config;
        this.#credentials = cred;
    }

    /**
     * Создать GoogleAuth из конфигурации
     * @param config
     */
    public static fromConfig(config : GoogleOAuthConfig) {
        const json = config.json();
        const cred = GA.createCredentialsFromJson(json.web);
        
        return new GoogleAuth(config, cred);
    }
    
    /**
     * Зарегистрировать GoogleAuth, начать прослушивание маршрутов
     * @param server
     * @param host
     * @param auth
     */
    public static register (server : FastifyInstance, host: HostConfig, auth: GoogleAuth) : void {
        const {clientId, clientSecret} = auth.#credentials;
        const startRedirectPath = auth.#config.startRedirectPath;
        const callbackUri = `${host.scheme}://${host.address}:${host.port}${auth.#config.callbackUri}`;
        
        server.register(oauthPlugin, {
            name: NAME,
            scope: scopes,
            credentials: {
                client: {
                    id: clientId,
                    secret: clientSecret
                },
                auth: oauthPlugin.GOOGLE_CONFIGURATION
            },
            startRedirectPath,
            callbackUri
        });
        
        server.get(auth.#config.callbackUri, async function(req,res) {
            await auth.authCallback.bind(this)(auth, req, res);
        });
    }

    /**
     * Обратный вызов после того как токен был получен со стороны google api
     * @param auth
     * @param req
     * @param res
     */
    public async authCallback(auth: GoogleAuth, req: FastifyRequest,res: FastifyReply) {
        let oauth2Response = (this as unknown as any)[NAME] as OAuth2Namespace;
        const token = await oauth2Response.getAccessTokenFromAuthorizationCodeFlow(req);
        
        const info = await GA.getGoogleUserInfo(token.access_token);
        auth.emitter.emitUserInfoReceived({
            info,
            res
        });
        return;
    }

    /**
     * Получить объект конфигурации googleOAuth2
     */
    public getConfig() : GoogleOAuthConfig {
        return this.#config;
    }

    /**
     * Получить userInfo google-пользователя
     * @param accessToken
     * @private
     */
    private static async getGoogleUserInfo(accessToken: string) : Promise<GoogleUserInfo> {
        const response = await axios.get(URL_USER_INFO, GA.makeAuthorizationToken(accessToken));
        
        if (!response) throw new Error('response not found');
        if (!response.data) throw new Error('data not found');

        return GoogleUserInfo.fromRaw(response.data as IRawGoogleUserInfo);
    }


    /**
     * Сформировать конфигурацию для axios
     * @param accessToken
     * @private
     */
    private static makeAuthorizationToken(accessToken: string) : AxiosRequestConfig {
        return {
            headers: {
                Authorization: 'Bearer ' + accessToken
            }
        }
    }

    /**
     * Создание учетных данных к App из json-файла
     * @param json
     * @private
     */
    private static createCredentialsFromJson(json: IRawGoogleOAuthCredentials) : GoogleOAuthCredentials {
        return {
            clientId: json['client_id'],
            projectId: json['project_id'],
            authUri: json['auth_uri'],
            tokenUri: json['token_uri'],
            authProvider: json['auth_provider_x509_cert_url'],
            clientSecret: json['client_secret']
        };
    }
}

const GA = GoogleAuth;