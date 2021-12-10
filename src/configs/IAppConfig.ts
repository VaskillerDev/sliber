export default interface IAppConfig {
    host: IHostConfig,
    googleOauth?: OAuthConfig
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