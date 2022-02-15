export default interface AccessTokenJsonScheme {
    access_token: string;
    expires_in: number;
    id_token: string;
    scope: string;
    token_type: 'Bearer';
}