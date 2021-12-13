export default interface IAuthToken {
    access_token: string;
    expires_in: number;
    scope: string;
    token_type: 'Bearer';
    id_token: string;
}