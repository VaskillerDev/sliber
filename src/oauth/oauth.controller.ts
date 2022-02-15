import {Controller, Get, Redirect, Req, Res} from '@nestjs/common';
import {ConfigService} from "../config/config.service";
import {Request, Response} from 'express';
import axios from "axios";
import AccessTokenJsonScheme from "../config/scheme/AccessTokenJsonScheme";
import makeQueryUrl from "../helper/makeQueryUrl";

const OAUTH = 'oauth';
const G_AUTH_PATH = '/g';
const G_AUTH_CALLBACK_PATH = '/g/callback';

@Controller(OAUTH)
export class OauthController {
    /**
     * Google authorization query params
     * @private
     */
    private readonly gAQ : GoogleAuthUrlQuery;
    /**
     * Full redirected google url
     * @private
     */
    private readonly gAuthRequestUrl : string;
    /**
     * Google get access toekn query params
     * @param configService
     */
    private readonly gAATQ : GoogleAuthAccessTokenQuery;
    
    
    constructor(private readonly configService: ConfigService) {
        const googleCred = configService.getGoogleCredentials();
        const baseUrl = configService.getBaseUrl();
        
        this.gAQ = {
            baseUrl: googleCred.web.auth_uri,
            clientId: googleCred.web.client_id,
            responseType: "code",
            scope: "https://www.googleapis.com/auth/userinfo.email",
            redirectUri: `${baseUrl}/${OAUTH}${G_AUTH_CALLBACK_PATH}`
        }

        {
            const {baseUrl, responseType, clientId, redirectUri, scope} = this.gAQ;
            this.gAuthRequestUrl = ""+makeQueryUrl<GoogleAuthRequestQueryParamObject>(baseUrl,{
                scope,
                client_id: clientId,
                redirect_uri: redirectUri,
                response_type: responseType,
            })
        }

        this.gAATQ = {
            clientId: googleCred.web.client_id,
            clientSecret: googleCred.web.client_secret,
            baseUrl: googleCred.web.token_uri,
            grantType: 'authorization_code'
        }
    }
    
    @Get(G_AUTH_PATH)
    @Redirect()
    public async authViaGoogle() {
        return { url: this.gAuthRequestUrl }
    }

    @Get(G_AUTH_CALLBACK_PATH)
    public async authViaGoogleCallback(@Req() req: Request, @Res() res: Response) {
        const inRes: GoogleAuthIncomingOAuthResponse = {
            code: req.query['code'] as string
        }
        
        const token = await this.getOrRefreshGoogleAccessToken(inRes);
        
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(token));
    }

    /**
     * Get or refresh access token
     * @param res
     * @private
     */
    private async getOrRefreshGoogleAccessToken(res: GoogleAuthIncomingOAuthResponse) : Promise<AccessTokenJsonScheme> {
        if (!res.code) throw new InOAuthFieldNotFound(`field 'code' not found`);
        const {baseUrl, clientId, clientSecret ,grantType} = this.gAATQ;
        
        const urlAccessTokenReq : string = ""+makeQueryUrl<GoogleAuthTokenRequestQueryParamObject>(baseUrl, {
            code: res.code,
            client_id: clientId,
            grant_type: grantType,
            client_secret: clientSecret,
            redirect_uri: this.gAQ.redirectUri
        });
        
        const tokenRes = await axios.post(urlAccessTokenReq, undefined, googleAuthAccessTokenRequestConfig);
        return tokenRes.data as AccessTokenJsonScheme;
    }
}

interface GoogleAuthRequestQueryParamObject {
    scope: string;
    client_id: string;
    redirect_uri: string;
    response_type: string;
}

interface GoogleAuthTokenRequestQueryParamObject {
    code: string;
    client_id: string;
    grant_type: string
    client_secret: string
    redirect_uri: string
}

/**
 * Address for authorization
 */
interface GoogleAuthUrlQuery {
    redirectUri: string;
    clientId: string;
    baseUrl: string;
    responseType: "code";
    scope: "https://www.googleapis.com/auth/userinfo.email";
}

/**
 * Incoming auth response from callback
 */
interface GoogleAuthIncomingOAuthResponse {
    code: string;
}

interface GoogleAuthAccessTokenQuery {
    clientId: string;
    clientSecret: string;
    baseUrl: string;
    grantType: 'authorization_code'
}

const googleAuthAccessTokenRequestConfig = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
}

export class InOAuthFieldNotFound extends Error {}