import BaseRouteHandlerMap from "./BaseRouteHandlerMap";
import IRouteHandlerMapArgs from "./IRouteHandlerMapArgs";
import RouteHandlerCommonMap, {RouteHandlerCommonType} from "./RouteHandlerCommonMap";
import RouteHandlerOwnerMap, {RouteHandlerOwnerType} from "./owner/RouteHandlerOwnerMap";
import RouteHandlerMapType from "./RouteHandlerMapType";

type InferRouteHandlerType<T>  = 
    T extends RouteHandlerCommonMap ? RouteHandlerCommonType 
    : T extends RouteHandlerOwnerMap ?  RouteHandlerOwnerType 
    : never;

type InferRouteHandlerMapType<T> 
    = RouteHandlerMapType<InferRouteHandlerType<T>, keyof InferRouteHandlerType<T>>

export default class RouteHandlerMapFactory {
    
    public static create<T extends BaseRouteHandlerMap>
    (baseRouteHandlerMap : T, args : IRouteHandlerMapArgs) {
        return baseRouteHandlerMap.create(args) as InferRouteHandlerMapType<T>
    }
}