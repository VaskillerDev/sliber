import EventEmitter from "events";
import GoogleUserInfo from "../../app/oauth2/GoogleUserInfo";
import {FastifyReply} from "fastify";

export default class GoogleAuthEventEmitter 
    extends EventEmitter
    implements IGoogleAuthEventEmitter {
    
    public emitUserInfoReceived(data : UserInfoReceivedDTO) : boolean {
        return (this as IGoogleAuthEventEmitter).emit('userInfoReceived', data);
    }
    
    public onUserInfoReceived(listener: (data: UserInfoReceivedDTO) => any) {
        (this as IGoogleAuthEventEmitter).on('userInfoReceived', listener);
    }
}

export declare interface IGoogleAuthEventEmitter 
    extends EventEmitter {
    emit(eventName: KeyOfGoogleAuthEvent, data: UserInfoReceivedDTO) : boolean;
    on(event: KeyOfGoogleAuthEvent, listener: (data: GoogleUserInfo) => void) : this;
    on(event: string, listener: Function): this;
}

export interface GoogleAuthEventMap { 
    'userInfoReceived': UserInfoReceivedDTO
}

export type UserInfoReceivedDTO = {info: GoogleUserInfo, res: FastifyReply}
export type KeyOfGoogleAuthEvent = keyof GoogleAuthEventMap
