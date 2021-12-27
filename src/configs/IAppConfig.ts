export default interface IAppConfig {
    host: IHostConfig,
    googleOauth?: OAuthConfig,
    security?: ISecurityConfig
}

export interface IHostConfig {
    address: string,
    port: number,
    scheme: boolean,
    secure: boolean
}

export interface OAuthConfig {
    path: string,
    callbackUri: string,
    startRedirectPath: string
}

export interface ISecurityConfig {
    algo: string,
    vec: string
}