import EventEmitter from "events";
import GoogleUserInfo from "../../app/oauth2/GoogleUserInfo";

export default class GoogleAuthEventEmitter 
    extends EventEmitter
    implements IGoogleAuthEventEmitter {
    
    public emitUserInfoReceived(data : GoogleUserInfo) : boolean {
        return (this as IGoogleAuthEventEmitter).emit('userInfoReceived', data);
    }
    
    public onUserInfoReceived(listener: (data: GoogleUserInfo) => any) {
        (this as IGoogleAuthEventEmitter).on('userInfoReceived', listener);
    }
}

export declare interface IGoogleAuthEventEmitter 
    extends EventEmitter {
    emit(eventName: KeyOfGoogleAuthEvent, data: GoogleUserInfo) : boolean;
    on(event: KeyOfGoogleAuthEvent, listener: (data: GoogleUserInfo) => void) : this;
    on(event: string, listener: Function): this;
}

export interface GoogleAuthEventMap { 
    'userInfoReceived': GoogleUserInfo
}

export type KeyOfGoogleAuthEvent = keyof GoogleAuthEventMap
