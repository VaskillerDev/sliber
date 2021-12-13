import IRouteHandler from "./IRouteHandler";

type RouteHandlerMapType <Key=string, RouteType=string> = {
    [key in (keyof Key)] : IRouteHandler<RouteType> 
}
export default RouteHandlerMapType;