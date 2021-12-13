export default interface GoogleOAuthCredentials {
    clientId: string;
    projectId : string;
    authUri: string;
    tokenUri: string;
    authProvider: string;
    clientSecret: string;
}