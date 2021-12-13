export default interface IRawGoogleOAuthCredentials {
    client_id: string;
    project_id: string;
    auth_uri: string;
    token_uri: string;
    auth_provider: string;
    client_secret: string;
    auth_provider_x509_cert_url: string;
}