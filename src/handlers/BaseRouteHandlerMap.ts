import IRouteHandlerMapArgs from "./IRouteHandlerMapArgs";
import RouteHandlerMapType from "./RouteHandlerMapType";

export default abstract class BaseRouteHandlerMap {
    
    public abstract create(args: IRouteHandlerMapArgs): RouteHandlerMapType<unknown,unknown>;
    
    public abstract setAllHandlers(routeHandlerMap: RouteHandlerMapType<any>): void;
}