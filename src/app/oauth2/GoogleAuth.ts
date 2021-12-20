import oauthPlugin, {OAuth2Namespace} from 'fastify-oauth2';
import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import GoogleOAuthConfig from "../../configs/GoogleOAuthConfig";
import HostConfig from "../../configs/HostConfig";
import GoogleOAuthCredentials from "./GoogleOAuthCredentials";
import IRawGoogleOAuthCredentials from "../../handlers/oauth2/IRawGoogleOAuthCredentials";

const name = 'googleOAuth2';

const scopes = [
    'https://www.googleapis.com/auth/userinfo.email'
];

export default class GoogleAuth {
    
    readonly #config: GoogleOAuthConfig;
    readonly #credentials: GoogleOAuthCredentials;
    
    constructor(config :GoogleOAuthConfig, cred: GoogleOAuthCredentials,) {
        this.#config = config;
        this.#credentials = cred;
    }
    
    public static fromConfig(config : GoogleOAuthConfig) {
        const json = config.json();
        const cred = GoogleAuth.createCredentialsFromJson(json.web);
        
        return new GoogleAuth(config, cred);
    }
    
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
    
    public static register (server : FastifyInstance, host: HostConfig, auth: GoogleAuth) : void {
        const {clientId, clientSecret} = auth.#credentials;
        const startRedirectPath = auth.#config.startRedirectPath;
        const callbackUri = `${host.scheme}://${host.address}:${host.port}${auth.#config.callbackUri}`;
        
        server.register(oauthPlugin, {
            name,
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
            await auth.authCallback.bind(this)(req,res)
        });
    }
    
    public async authCallback(req: FastifyRequest,res: FastifyReply) {
        let oauth2Response = (this as unknown as any)[name] as OAuth2Namespace;
        const token = await oauth2Response.getAccessTokenFromAuthorizationCodeFlow(req);

        res.code(200).send({token});
    }
    
    public getConfig() : GoogleOAuthConfig {
        return this.#config;
    }
}