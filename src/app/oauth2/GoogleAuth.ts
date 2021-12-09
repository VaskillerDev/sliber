import oauthPlugin, {OAuth2Namespace} from 'fastify-oauth2';
import {FastifyInstance} from "fastify";

const scopes = [
    'https://www.googleapis.com/auth/userinfo.email'
];

export default class GoogleAuth {
    
    readonly #credentials: GoogleOAuthCredentials;
    
    
    constructor(cred: GoogleOAuthCredentials) {
        this.#credentials = cred;
    }
    
    public static createFromJson(json: any) : GoogleAuth {
        
        const cred : GoogleOAuthCredentials = {
            clientId: json['client_id'],
            projectId: json['project_id'],
            authUri: json['auth_uri'],
            tokenUri: json['token_uri'],
            authProvider: json['auth_provider_x509_cert_url'],
            clientSecret: json['client_secret']
        }

        return new GoogleAuth(cred);
    }
    
    public static register (server : FastifyInstance, auth: GoogleAuth) : void {
        const {clientId, clientSecret} = auth.#credentials;
        
        server.register(oauthPlugin, {
            name: 'googleOAuth2',
            scope: scopes,
            credentials: {
                client: {
                    id: clientId,
                    secret: clientSecret
                },
                auth: oauthPlugin.GOOGLE_CONFIGURATION
            },
            startRedirectPath: '/auth',
            callbackUri: 'http://localhost:7070/auth/cb'
        });
        
        server.get('/auth/cb', async function(req,res) {

            let oauth2Response = (this as unknown as any)['googleOAuth2'] as OAuth2Namespace;
            const token = await oauth2Response.getAccessTokenFromAuthorizationCodeFlow(req);
            
            res.code(200).send({token});
        });
    }
}

export interface GoogleOAuthCredentials {
    clientId: string;
    projectId : string;
    authUri: string;
    tokenUri: string;
    authProvider: string;
    clientSecret: string;
}