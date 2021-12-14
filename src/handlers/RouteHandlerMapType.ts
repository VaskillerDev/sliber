import IRouteHandler from "./IRouteHandler";

/**
 * Used to configure static validation rules key - route
 */
type RouteHandlerMapType <Key=string, RouteType=string> = {
    [key in (keyof Key)] : IRouteHandler<RouteType> 
}
export default RouteHandlerMapType;