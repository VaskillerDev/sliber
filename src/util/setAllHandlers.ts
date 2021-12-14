import RouteHandlerMapType from "../handlers/RouteHandlerMapType";
import IRouteHandler from "../handlers/IRouteHandler";

export default function setAllHandlers(routeHandlerMap: RouteHandlerMapType<any>) {
    // @ts-ignore
    for (let i in routeHandlerMap) {
        // @ts-ignore
        let handler = routeHandlerMap[i] as IRouteHandler;
        
        let {app} = handler;
        app? app.setHandler(handler) : {};
    }
}