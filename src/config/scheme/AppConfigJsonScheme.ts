export default interface AppConfigJsonScheme {
    host: AppConfigHostJsonScheme;
    security: SecurityConfigJsonScheme;
    googleOauth?: VendorOAuthConfigJsonScheme;
    facebookOAuth?: VendorOAuthConfigJsonScheme;
}

export interface AppConfigHostJsonScheme {
    address: string | 'localhost';
    port: number;
    scheme: 'http' | 'https';
    secure: boolean;
}

/**
 * OAuth common config 
 */
export interface VendorOAuthConfigJsonScheme {
    /**
     * Path to json config file
     */
    path: string;
    /**
     * Uri for callback by vendor service
     */
    callbackUri: string;
    /**
     * Ulr handle for services
     */
    startRedirectPath: string;
}

/**
 * config for crypto module settings
 */
export interface SecurityConfigJsonScheme {
    algo: string;
    vec: string;
}