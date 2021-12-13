import RouteHandlerMapType from "../handlers/RouteHandlerMapType";
import IRouteHandler from "../handlers/IRouteHandler";
import App from "../app/App";

export default function injectRouteHandlerMap(app: App, routeHandlerMap: RouteHandlerMapType<any>) {
    // @ts-ignore
    for (let i in routeHandlerMap) {
        // @ts-ignore
        let handler = routeHandlerMap[i] as IRouteHandler;
        handler.app = app;
        app.setHandler(handler);
    }
}