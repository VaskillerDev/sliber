import GoogleCredentialsJsonScheme from "./scheme/GoogleCredentialsJsonScheme";
import AppConfigJsonScheme, {AppConfigHostJsonScheme} from "./scheme/AppConfigJsonScheme";

import {Inject, Injectable} from '@nestjs/common';
import {ConfigFileLoader} from "./config.provider";

@Injectable()
export class ConfigService {
    private readonly baseUrl: string;
    
    private readonly appConfig: AppConfigJsonScheme = null;
    private readonly hostConfig: AppConfigHostJsonScheme = null;
    private readonly googleCredentials: GoogleCredentialsJsonScheme = null;

    constructor(@Inject('CONFIG_LOADER') private loader : ConfigFileLoader) {
        const {appConfig, googleCredentials} = loader;
        const {host} = appConfig;
        
        this.googleCredentials = googleCredentials;
        this.appConfig = appConfig
        this.hostConfig = host;
        
        this.baseUrl = `${host.scheme}://${host.address}:${host.port}`;
    }
    
    /**
     * Get application config
     */
    public getAppConfig() : AppConfigJsonScheme {
        return this.appConfig;
    }
    
    /**
     * Get google credentials as JSON
     */
    public getGoogleCredentials() : GoogleCredentialsJsonScheme {
        if (this.appConfig.googleOauth == null) {
            throw new CredentialsConfigNotFoundError('google credentials config not found');
        }
        
        return this.googleCredentials
    }
    
    public getHostConfig() : AppConfigHostJsonScheme {
        return this.hostConfig;
    }
    
    public getBaseUrl() : string {
        return this.baseUrl;
    }
 }

export type ConfigMode = 'prod' | 'dev';
export class CredentialsConfigNotFoundError extends Error {}


